import {
  getMusicKnowledgeSource,
  type MusicSection,
  type MusicTrack,
} from "@/lib/music";

const MUSIC_KNOWLEDGE_CACHE_MS = 30_000;
const MUSIC_MATCH_LIMIT = 20;

const QUERY_STOPWORDS = new Set([
  "about",
  "album",
  "albums",
  "also",
  "and",
  "any",
  "are",
  "artist",
  "artists",
  "been",
  "currently",
  "did",
  "do",
  "does",
  "ever",
  "favorite",
  "favourite",
  "for",
  "from",
  "had",
  "has",
  "have",
  "hear",
  "heard",
  "how",
  "into",
  "just",
  "know",
  "lately",
  "like",
  "likes",
  "listen",
  "listening",
  "music",
  "now",
  "play",
  "played",
  "playing",
  "recently",
  "some",
  "song",
  "songs",
  "still",
  "that",
  "the",
  "these",
  "this",
  "those",
  "to",
  "track",
  "tracks",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "with",
  "you",
  "your",
]);

type MusicKnowledgeSource = Awaited<
  ReturnType<typeof getMusicKnowledgeSource>
>;

let cached: { at: number; source: MusicKnowledgeSource } | null = null;

function formatTrack(track: MusicTrack) {
  return `${track.name} by ${track.artist}`;
}

function queryTokens(text: string) {
  return (
    text
      .toLowerCase()
      .match(/[a-z0-9]+/g)
      ?.filter((token) => token.length >= 3 && !QUERY_STOPWORDS.has(token)) ??
    []
  );
}

function matchLibraryTracks(tracks: MusicTrack[], query: string) {
  const tokens = queryTokens(query);

  if (!tokens.length) {
    return [];
  }

  return tracks
    .map((track) => {
      const haystack = `${track.name} ${track.artist}`.toLowerCase();
      const score = tokens.filter((token) => haystack.includes(token)).length;

      return { track, score };
    })
    .filter((item) => item.score > 0)
    .sort(
      (first, second) =>
        second.score - first.score ||
        (second.track.playedAt ?? 0) - (first.track.playedAt ?? 0),
    )
    .slice(0, MUSIC_MATCH_LIMIT)
    .map((item) => item.track);
}

function formatSection(section: MusicSection) {
  if (!section.tracks.length) {
    return "";
  }

  return `${section.label}:
${section.tracks.map((track) => `- ${formatTrack(track)}`).join("\n")}`;
}

async function getCachedMusicKnowledgeSource() {
  if (cached && Date.now() - cached.at < MUSIC_KNOWLEDGE_CACHE_MS) {
    return cached.source;
  }

  const source = await getMusicKnowledgeSource();
  cached = { at: Date.now(), source };
  return source;
}

export async function getBeniMusicKnowledge(query: string) {
  try {
    const source = await getCachedMusicKnowledgeSource();

    if (!source) {
      return "";
    }

    const nowPlaying = source.nowPlaying
      ? `Now playing: ${formatTrack(source.nowPlaying)}`
      : "Nothing playing right now. Do not invent a song.";
    const recents = source.sections
      .map(formatSection)
      .filter(Boolean)
      .join("\n\n");
    const matches = matchLibraryTracks(source.tracks, query);
    const matchBlock = matches.length
      ? `Matches for this question:
${matches.map((track) => `- ${formatTrack(track)}`).join("\n")}`
      : "";

    return `## Music right now

${nowPlaying}
Library size: ${source.totalTracks} unique tracks.
Recent tracks (same first tracks as the Music tab):
${recents || "(none)"}
${matchBlock}`.trim();
  } catch {
    return "";
  }
}
