export const SHADOW_TOKEN_NAMES = ["1", "2", "3", "4", "5", "6"] as const;

export type ShadowTokenName = (typeof SHADOW_TOKEN_NAMES)[number];

export const SHADOW_TOKEN_ROLES: Record<ShadowTokenName, string> = {
  1: "Inset",
  2: "Rest",
  3: "Raised",
  4: "Overlay",
  5: "Overlay large",
  6: "Dialog",
};
