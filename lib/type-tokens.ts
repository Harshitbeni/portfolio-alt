export const TYPE_TOKEN_NAMES = ["md", "sm", "xs", "xxs"] as const;

export type TypeTokenName = (typeof TYPE_TOKEN_NAMES)[number];

export const TYPE_TOKENS: Record<TypeTokenName, number> = {
  md: 16,
  sm: 14,
  xs: 13,
  xxs: 12,
};

export const TYPE_WEIGHT_NAMES = ["medium", "semibold"] as const;

export type TypeWeightName = (typeof TYPE_WEIGHT_NAMES)[number];

export const TYPE_WEIGHTS: Record<TypeWeightName, number> = {
  medium: 500,
  semibold: 600,
};

export const TYPE_MD_STYLE_NAMES = ["md-medium", "md-semibold"] as const;

export type TypeMdStyleName = (typeof TYPE_MD_STYLE_NAMES)[number];

export const TYPE_STYLE_NAMES = [
  "md",
  "md-medium",
  "md-semibold",
  "sm",
  "xs",
  "xxs",
] as const;

export type TypeStyleName = (typeof TYPE_STYLE_NAMES)[number];

export const TYPE_STYLE_WEIGHTS: Partial<
  Record<TypeStyleName, TypeWeightName>
> = {
  "md-medium": "medium",
  "md-semibold": "semibold",
};

export function typeStyleToken(name: TypeStyleName): TypeTokenName {
  if (name === "md-medium" || name === "md-semibold") return "md";
  return name;
}
