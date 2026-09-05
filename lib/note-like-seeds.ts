/** Bear toast counts from notes.harshitbeni.com, captured 2026-09-04. */
export const NOTE_LIKE_SEEDS: Record<string, number> = {
  "finding-flow": 10,
  "i-have-a-dream": 14,
  "hallucinations-might-be-a-feature-not-a-bug": 15,
  "why-i-dont-use-native-apps": 10,
};

export function noteLikeSeed(slug: string) {
  return NOTE_LIKE_SEEDS[slug] ?? 0;
}
