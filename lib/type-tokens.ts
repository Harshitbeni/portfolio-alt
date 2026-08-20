export const TYPE_TOKEN_NAMES = ["sm", "xs", "xxs"] as const;

export type TypeTokenName = (typeof TYPE_TOKEN_NAMES)[number];

export const TYPE_TOKENS: Record<TypeTokenName, number> = {
  sm: 14,
  xs: 13,
  xxs: 12,
};
