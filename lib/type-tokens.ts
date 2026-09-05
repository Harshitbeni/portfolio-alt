export const TYPE_TOKEN_NAMES = ["xl", "lg", "md", "sm", "xs", "xxs"] as const;

export type TypeTokenName = (typeof TYPE_TOKEN_NAMES)[number];

export const TYPE_TOKENS: Record<TypeTokenName, number> = {
  xl: 24,
  lg: 20,
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
  "xl",
  "xl-medium",
  "xl-semibold",
  "lg",
  "lg-medium",
  "lg-semibold",
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
  "xl-medium": "medium",
  "xl-semibold": "semibold",
  "lg-medium": "medium",
  "lg-semibold": "semibold",
  "md-medium": "medium",
  "md-semibold": "semibold",
};

export function typeStyleToken(name: TypeStyleName): TypeTokenName {
  const dash = name.lastIndexOf("-");
  if (dash === -1) return name as TypeTokenName;
  return name.slice(0, dash) as TypeTokenName;
}

export function typeTokenStyles(token: TypeTokenName): TypeStyleName[] {
  return TYPE_STYLE_NAMES.filter((name) => typeStyleToken(name) === token);
}
