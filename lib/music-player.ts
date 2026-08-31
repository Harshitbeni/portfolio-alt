"use client";

import { useSyncExternalStore } from "react";
import type { MusicTrack } from "@/lib/music";

export type MusicPlayerSnapshot = {
  playingId: string | null;
  loadingId: string | null;
};

export type MusicClipStatus = "unknown" | "available" | "none";

const SERVER_SNAPSHOT: MusicPlayerSnapshot = {
  playingId: null,
  loadingId: null,
};

const listeners = new Set<() => void>();
const clipListeners = new Set<() => void>();
const clipCache = new Map<string, string | null>();
const inflight = new Map<string, Promise<string | null>>();

let snapshot: MusicPlayerSnapshot = SERVER_SNAPSHOT;
let audio: HTMLAudioElement | null = null;
let playGeneration = 0;

function emit(next: MusicPlayerSnapshot) {
  snapshot = next;
  for (const listener of listeners) {
    listener();
  }
}

function getAudio() {
  if (!audio) {
    audio = new Audio();
    audio.preload = "auto";
    audio.addEventListener("ended", () => {
      if (snapshot.playingId) {
        emit({ ...snapshot, playingId: null });
      }
    });
  }

  return audio;
}

function emitClip() {
  for (const listener of clipListeners) {
    listener();
  }
}

function getClipStatus(id: string): MusicClipStatus {
  if (!clipCache.has(id)) {
    return "unknown";
  }

  return clipCache.get(id) ? "available" : "none";
}

async function fetchClip(track: MusicTrack, refresh = false) {
  if (!refresh && clipCache.has(track.id)) {
    return clipCache.get(track.id) ?? null;
  }

  const pending = inflight.get(track.id);

  if (pending && !refresh) {
    return pending;
  }

  const request = (async () => {
    const params = new URLSearchParams({
      artist: track.artist,
      name: track.name,
    });

    if (refresh) {
      params.set("refresh", "1");
    }

    const response = await fetch(`/api/music/clip?${params}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return refresh ? null : (clipCache.get(track.id) ?? null);
    }

    const data = (await response.json()) as { previewUrl?: string | null };
    const previewUrl = data.previewUrl ?? null;
    clipCache.set(track.id, previewUrl);
    emitClip();
    return previewUrl;
  })();

  inflight.set(track.id, request);

  try {
    return await request;
  } finally {
    if (inflight.get(track.id) === request) {
      inflight.delete(track.id);
    }
  }
}

function loadAndPlay(element: HTMLAudioElement, url: string) {
  return new Promise<void>((resolve, reject) => {
    const onReady = () => {
      cleanup();
      element.play().then(() => resolve()).catch(reject);
    };
    const onError = () => {
      cleanup();
      reject(new Error("audio error"));
    };
    const cleanup = () => {
      element.removeEventListener("canplay", onReady);
      element.removeEventListener("error", onError);
    };

    element.addEventListener("canplay", onReady);
    element.addEventListener("error", onError);
    element.src = url;
    element.load();
  });
}

async function playPreview(
  track: MusicTrack,
  url: string,
  generation: number,
  allowRefresh: boolean,
) {
  const element = getAudio();
  element.pause();

  try {
    await loadAndPlay(element, url);

    if (generation !== playGeneration) {
      element.pause();
      return;
    }

    emit({ playingId: track.id, loadingId: null });
  } catch {
    if (generation !== playGeneration) {
      return;
    }

    if (allowRefresh) {
      const nextUrl = await fetchClip(track, true);

      if (generation !== playGeneration) {
        return;
      }

      if (nextUrl && nextUrl !== url) {
        await playPreview(track, nextUrl, generation, false);
        return;
      }
    }

    emit({ playingId: null, loadingId: null });
  }
}

export async function toggleMusicTrack(track: MusicTrack) {
  if (snapshot.playingId === track.id) {
    getAudio().pause();
    emit({ playingId: null, loadingId: snapshot.loadingId });
    return;
  }

  if (snapshot.loadingId === track.id) {
    return;
  }

  const generation = ++playGeneration;
  getAudio().pause();
  emit({ playingId: null, loadingId: track.id });

  if (clipCache.get(track.id) === null) {
    emit({ playingId: null, loadingId: null });
    return;
  }

  try {
    const previewUrl = await fetchClip(track);

    if (generation !== playGeneration) {
      return;
    }

    if (!previewUrl) {
      emit({ playingId: null, loadingId: null });
      return;
    }

    await playPreview(track, previewUrl, generation, true);
  } catch {
    if (generation !== playGeneration) {
      return;
    }

    emit({ playingId: null, loadingId: null });
  }
}

export function prefetchMusicClip(track: MusicTrack) {
  void fetchClip(track);
}

export function useMusicClipStatus(trackId: string) {
  return useSyncExternalStore(
    (onStoreChange) => {
      clipListeners.add(onStoreChange);
      return () => {
        clipListeners.delete(onStoreChange);
      };
    },
    () => getClipStatus(trackId),
    () => "unknown" as const,
  );
}

export function useMusicPlayer() {
  return useSyncExternalStore(
    (onStoreChange) => {
      listeners.add(onStoreChange);
      return () => {
        listeners.delete(onStoreChange);
      };
    },
    () => snapshot,
    () => SERVER_SNAPSHOT,
  );
}
