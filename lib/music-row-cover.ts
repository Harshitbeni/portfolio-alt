export const MUSIC_ROW_DEFAULT_COVER_SIZE = 56;
export const MUSIC_ROW_DEFAULT_HOLE_SIZE = 12;
export const MUSIC_ROW_DEFAULT_STROKE_TOKEN = "gray-a6";

export const MUSIC_ROW_STROKE_TOKENS = [
  "gray-a1",
  "gray-a2",
  "gray-a3",
  "gray-a4",
  "gray-a5",
  "gray-a6",
  "gray-a7",
  "gray-a8",
  "gray-a9",
  "gray-a10",
  "gray-a11",
  "gray-a12",
] as const;

export type MusicRowStrokeToken = (typeof MUSIC_ROW_STROKE_TOKENS)[number];
