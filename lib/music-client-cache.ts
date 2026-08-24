"use client";

import { startTransition, useSyncExternalStore } from "react";
import type { MusicSection, MusicTrack } from "@/lib/music";
import {
  isNowPlaying,
  nowPlayingToTrack,
} from "@/lib/now-playing";

type MusicResponse = {
  sections: MusicSection[];
  nowPlaying?: MusicTrack | null;
  totalTracks?: number;
  partial?: boolean;
};

type MusicCacheSnapshot = {
  sections: MusicSection[] | null;
  nowPlaying: MusicTrack | null;
  totalTracks: number;
  partial: boolean;
};

const PREVIEW_STORAGE_KEY = "portfolio:music-preview:v1";
const NOW_PLAYING_POLL_MS = 10_000;

const listeners = new Set<() => void>();

let cachedSections: MusicSection[] | null = null;
let cachedNowPlaying: MusicTrack | null = null;
let cachedTotalTracks = 0;
let cachedPartial = false;
let hasFullLibrary = false;
let didHydrateStorage = false;
let libraryRequest: Promise<MusicSection[] | null> | null = null;
let fullLibraryRequest: Promise<void> | null = null;
let syncRequest: Promise<void> | null = null;
let nowPlayingInFlight: Promise<void> | null = null;
let nowPlayingTimer: number | null = null;
let nowPlayingListenersBound = false;

let snapshot: MusicCacheSnapshot = {
  sections: null,
  nowPlaying: null,
  totalTracks: 0,
  partial: false,
};

function stripNowPlaying(sections: MusicSection[]) {
  return sections.filter((section) => section.id !== "nowplaying");
}

function overlayLiveNowPlaying(
  sections: MusicSection[],
  nowPlaying: MusicTrack | null,
): MusicSection[] {
  const without = stripNowPlaying(sections)
    .map((section) =>
      nowPlaying
        ? {
            ...section,
            tracks: section.tracks.filter((track) => track.id !== nowPlaying.id),
          }
        : section,
    )
    .filter((section) => section.tracks.length > 0);

  if (!nowPlaying) {
    return without;
  }

  return [
    {
      id: "nowplaying",
      label: "Now playing",
      tracks: [nowPlaying],
    },
    ...without,
  ];
}

function emit() {
  snapshot = {
    sections:
      cachedSections === null && !cachedNowPlaying
        ? null
        : overlayLiveNowPlaying(cachedSections ?? [], cachedNowPlaying),
    nowPlaying: cachedNowPlaying,
    totalTracks: cachedTotalTracks,
    partial: cachedPartial,
  };
  for (const listener of listeners) {
    listener();
  }
}

function trackCount(sections: MusicSection[]) {
  return stripNowPlaying(sections).reduce(
    (count, section) => count + section.tracks.length,
    0,
  );
}

function isMusicTrack(value: unknown): value is MusicTrack {
  if (!value || typeof value !== "object") {
    return false;
  }

  const track = value as Record<string, unknown>;

  return (
    typeof track.id === "string" &&
    typeof track.name === "string" &&
    typeof track.artist === "string" &&
    (track.image === null || typeof track.image === "string") &&
    typeof track.url === "string" &&
    (track.playedAt === null || typeof track.playedAt === "number")
  );
}

function isMusicResponse(value: unknown): value is MusicResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Record<string, unknown>;
  const sections = payload.sections;

  if (
    !Array.isArray(sections) ||
    !sections.every(
      (section) =>
        section &&
        typeof section === "object" &&
        typeof (section as MusicSection).id === "string" &&
        typeof (section as MusicSection).label === "string" &&
        Array.isArray((section as MusicSection).tracks) &&
        (section as MusicSection).tracks.every(isMusicTrack),
    )
  ) {
    return false;
  }

  if (payload.nowPlaying != null && !isMusicTrack(payload.nowPlaying)) {
    return false;
  }

  return true;
}

function nowPlayingEquals(first: MusicTrack | null, second: MusicTrack | null) {
  if (first === second) {
    return true;
  }

  if (!first || !second) {
    return false;
  }

  return (
    first.id === second.id &&
    first.name === second.name &&
    first.artist === second.artist &&
    first.image === second.image &&
    first.url === second.url
  );
}

function persistPreview(sections: MusicSection[], totalTracks: number) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      PREVIEW_STORAGE_KEY,
      JSON.stringify({
        sections: stripNowPlaying(sections),
        totalTracks,
      }),
    );
  } catch {
    // Ignore quota / private-mode failures.
  }
}

function readPreviewFromStorage(): {
  sections: MusicSection[];
  totalTracks: number;
} | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(PREVIEW_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const payload: unknown = JSON.parse(raw);

    if (!payload || typeof payload !== "object") {
      return null;
    }

    const stored = payload as {
      sections?: unknown;
      totalTracks?: unknown;
    };

    if (!Array.isArray(stored.sections) || stored.sections.length === 0) {
      return null;
    }

    if (
      !stored.sections.every(
        (section) =>
          section &&
          typeof section === "object" &&
          typeof (section as MusicSection).id === "string" &&
          typeof (section as MusicSection).label === "string" &&
          Array.isArray((section as MusicSection).tracks) &&
          (section as MusicSection).tracks.every(isMusicTrack),
      )
    ) {
      return null;
    }

    return {
      sections: stripNowPlaying(stored.sections as MusicSection[]),
      totalTracks:
        typeof stored.totalTracks === "number"
          ? stored.totalTracks
          : trackCount(stored.sections as MusicSection[]),
    };
  } catch {
    return null;
  }
}

function hydrateFromStorage() {
  if (didHydrateStorage) {
    return;
  }

  didHydrateStorage = true;

  if (cachedSections !== null) {
    return;
  }

  const stored = readPreviewFromStorage();

  if (!stored) {
    return;
  }

  cachedSections = stored.sections;
  cachedPartial = true;
  cachedTotalTracks = stored.totalTracks;
  snapshot = {
    sections: overlayLiveNowPlaying(cachedSections, cachedNowPlaying),
    nowPlaying: cachedNowPlaying,
    totalTracks: cachedTotalTracks,
    partial: cachedPartial,
  };
}

function applyLibrary(
  nextSections: MusicSection[],
  options: { deferred?: boolean; partial?: boolean; totalTracks?: number } = {},
) {
  const update = () => {
    const partial = options.partial === true;

    if (partial && hasFullLibrary) {
      return;
    }

    cachedSections = stripNowPlaying(nextSections);
    cachedPartial = partial;
    cachedTotalTracks = options.totalTracks ?? trackCount(cachedSections);
    if (!partial) {
      hasFullLibrary = true;
      cachedPartial = false;
    } else {
      persistPreview(cachedSections, cachedTotalTracks);
    }
    emit();
  };

  if (options.deferred) {
    startTransition(update);
    return;
  }

  update();
}

async function fetchMusicResponse(
  url: string,
  options: { priority?: RequestInit["priority"] } = {},
) {
  const response = await fetch(url, {
    priority: options.priority,
  });

  if (!response.ok) {
    throw new Error(`music ${response.status}`);
  }

  const payload: unknown = await response.json();

  if (!isMusicResponse(payload)) {
    throw new Error("invalid music response");
  }

  return payload;
}

function scheduleIdle(task: () => void) {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(() => task(), { timeout: 1200 });
    return;
  }

  window.setTimeout(task, 0);
}

export function getMusicCacheSnapshot(): MusicCacheSnapshot {
  hydrateFromStorage();
  return snapshot;
}

export function getServerMusicCacheSnapshot(): MusicCacheSnapshot {
  return snapshot;
}

export function subscribeMusicCache(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function seedMusicCache(
  initialSections: MusicSection[],
  totalTracks?: number,
) {
  if (cachedSections !== null || initialSections.length === 0) {
    return;
  }

  cachedSections = stripNowPlaying(initialSections);
  cachedPartial = true;
  cachedTotalTracks = totalTracks ?? trackCount(cachedSections);
  snapshot = {
    sections: overlayLiveNowPlaying(cachedSections, cachedNowPlaying),
    nowPlaying: cachedNowPlaying,
    totalTracks: cachedTotalTracks,
    partial: cachedPartial,
  };
  persistPreview(cachedSections, cachedTotalTracks);
}

export function prefetchMusicLibrary() {
  if (libraryRequest) {
    return libraryRequest;
  }

  libraryRequest = fetchMusicResponse("/api/music", { priority: "high" })
    .then((payload) => {
      if (payload.sections.length > 0) {
        applyLibrary(payload.sections, {
          deferred: cachedSections !== null,
          partial: payload.partial !== false,
          totalTracks: payload.totalTracks,
        });
        return payload.sections;
      }

      if (cachedSections === null && !syncRequest) {
        applyLibrary([], { partial: false });
      }

      return cachedSections;
    })
    .catch(() => {
      libraryRequest = null;

      if (cachedSections === null && !syncRequest) {
        applyLibrary([], { partial: false });
      }

      return cachedSections;
    });

  return libraryRequest;
}

export function prefetchFullMusicLibrary() {
  if (fullLibraryRequest || hasFullLibrary) {
    return fullLibraryRequest ?? Promise.resolve();
  }

  fullLibraryRequest = fetchMusicResponse("/api/music?full=1")
    .then((payload) => {
      if (payload.sections.length === 0) {
        return;
      }

      applyLibrary(payload.sections, {
        deferred: true,
        partial: false,
        totalTracks: payload.totalTracks ?? trackCount(payload.sections),
      });
    })
    .catch(() => {
      fullLibraryRequest = null;
    });

  return fullLibraryRequest;
}

export function syncMusicLibrary() {
  if (syncRequest) {
    return syncRequest;
  }

  syncRequest = fetchMusicResponse("/api/music/sync")
    .then((payload) => {
      applyLibrary(payload.sections, {
        deferred: true,
        partial: payload.partial === true,
        totalTracks: payload.totalTracks,
      });
    })
    .catch(() => {
      syncRequest = null;

      if (cachedSections === null) {
        applyLibrary([], { partial: false });
      }
    });

  return syncRequest;
}

export function warmMusicLibrary() {
  void prefetchMusicLibrary().then(() => {
    scheduleIdle(() => {
      void prefetchFullMusicLibrary();
      void syncMusicLibrary();
    });
  });
}

async function loadNowPlaying() {
  if (nowPlayingInFlight) {
    return nowPlayingInFlight;
  }

  nowPlayingInFlight = (async () => {
    try {
      const response = await fetch("/api/now-playing", { cache: "no-store" });

      if (!response.ok) {
        return;
      }

      const payload: unknown = await response.json();

      if (!isNowPlaying(payload)) {
        return;
      }

      const next = payload.nowPlaying ? nowPlayingToTrack(payload) : null;

      if (nowPlayingEquals(cachedNowPlaying, next)) {
        return;
      }

      cachedNowPlaying = next;
      emit();
    } catch {
      // Keep the last known overlay if Last.fm is unreachable.
    }
  })().finally(() => {
    nowPlayingInFlight = null;
  });

  return nowPlayingInFlight;
}

function refreshNowPlayingIfVisible() {
  if (typeof document !== "undefined" && document.hidden) {
    return;
  }

  void loadNowPlaying();
}

export function watchNowPlaying() {
  void loadNowPlaying();

  if (typeof window === "undefined") {
    return;
  }

  if (nowPlayingTimer === null) {
    nowPlayingTimer = window.setInterval(
      refreshNowPlayingIfVisible,
      NOW_PLAYING_POLL_MS,
    );
  }

  if (!nowPlayingListenersBound) {
    nowPlayingListenersBound = true;
    document.addEventListener("visibilitychange", refreshNowPlayingIfVisible);
    window.addEventListener("focus", refreshNowPlayingIfVisible);
  }
}

export function prefetchNowPlaying() {
  watchNowPlaying();
}

export function useMusicCache() {
  return useSyncExternalStore(
    subscribeMusicCache,
    getMusicCacheSnapshot,
    getServerMusicCacheSnapshot,
  );
}
