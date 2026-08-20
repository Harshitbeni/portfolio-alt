export const GRAY_STEPS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export type GrayStep = (typeof GRAY_STEPS)[number];
export type ColorMode = "light" | "dark";
export const COLOR_FAMILIES = [
  "gray",
  "red",
  "green",
  "yellow",
  "blue",
  "purple",
  "alpha",
] as const;
export type ColorFamily = (typeof COLOR_FAMILIES)[number];

type StepHex = Record<GrayStep, string>;
type ModeHex = Record<ColorMode, StepHex>;

export const grayHex: ModeHex = {
  light: {
    1: "#fcfcfc",
    2: "#f9f9f9",
    3: "#f0f0f0",
    4: "#e8e8e8",
    5: "#e0e0e0",
    6: "#d9d9d9",
    7: "#cecece",
    8: "#bbbbbb",
    9: "#8d8d8d",
    10: "#838383",
    11: "#646464",
    12: "#202020",
  },
  dark: {
    1: "#111111",
    2: "#191919",
    3: "#222222",
    4: "#2a2a2a",
    5: "#313131",
    6: "#3a3a3a",
    7: "#484848",
    8: "#606060",
    9: "#6e6e6e",
    10: "#7b7b7b",
    11: "#b4b4b4",
    12: "#eeeeee",
  },
};

export const grayAlphaHex: ModeHex = {
  light: {
    1: "#00000003",
    2: "#00000006",
    3: "#0000000f",
    4: "#00000017",
    5: "#0000001f",
    6: "#00000026",
    7: "#00000031",
    8: "#00000044",
    9: "#00000072",
    10: "#0000007c",
    11: "#0000009b",
    12: "#000000df",
  },
  dark: {
    1: "#00000000",
    2: "#ffffff09",
    3: "#ffffff12",
    4: "#ffffff1b",
    5: "#ffffff22",
    6: "#ffffff2c",
    7: "#ffffff3b",
    8: "#ffffff55",
    9: "#ffffff64",
    10: "#ffffff72",
    11: "#ffffffaf",
    12: "#ffffffed",
  },
};

export const redHex: ModeHex = {
  light: {
    1: "#fffcfc",
    2: "#fff7f7",
    3: "#feebec",
    4: "#ffdbdc",
    5: "#ffcdce",
    6: "#fdbdbe",
    7: "#f4a9aa",
    8: "#eb8e90",
    9: "#e5484d",
    10: "#dc3e42",
    11: "#ce2c31",
    12: "#641723",
  },
  dark: {
    1: "#191111",
    2: "#201314",
    3: "#3b1219",
    4: "#500f1c",
    5: "#611623",
    6: "#72232d",
    7: "#8c333a",
    8: "#b54548",
    9: "#e5484d",
    10: "#ec5d5e",
    11: "#ff9592",
    12: "#ffd1d9",
  },
};

export const greenHex: ModeHex = {
  light: {
    1: "#fbfefc",
    2: "#f4fbf6",
    3: "#e6f6eb",
    4: "#d6f1df",
    5: "#c4e8d1",
    6: "#adddc0",
    7: "#8eceaa",
    8: "#5bb98b",
    9: "#30a46c",
    10: "#2b9a66",
    11: "#218358",
    12: "#193b2d",
  },
  dark: {
    1: "#0e1512",
    2: "#121b17",
    3: "#132d21",
    4: "#113b29",
    5: "#174933",
    6: "#20573e",
    7: "#28684a",
    8: "#2f7c57",
    9: "#30a46c",
    10: "#33b074",
    11: "#3dd68c",
    12: "#b1f1cb",
  },
};

export const yellowHex: ModeHex = {
  light: {
    1: "#fdfdf9",
    2: "#fefce9",
    3: "#fffab8",
    4: "#fff394",
    5: "#ffe770",
    6: "#f3d768",
    7: "#e4c767",
    8: "#d5ae39",
    9: "#ffe629",
    10: "#ffdc00",
    11: "#9e6c00",
    12: "#473b1f",
  },
  dark: {
    1: "#14120b",
    2: "#1b180f",
    3: "#2d2305",
    4: "#362b00",
    5: "#433500",
    6: "#524202",
    7: "#665417",
    8: "#836a21",
    9: "#ffe629",
    10: "#ffff57",
    11: "#f5e147",
    12: "#f6eeb4",
  },
};

export const blueHex: ModeHex = {
  light: {
    1: "#fbfdff",
    2: "#f4faff",
    3: "#e6f4fe",
    4: "#d5efff",
    5: "#c2e5ff",
    6: "#acd8fc",
    7: "#8ec8f6",
    8: "#5eb1ef",
    9: "#0090ff",
    10: "#0588f0",
    11: "#0d74ce",
    12: "#113264",
  },
  dark: {
    1: "#0d1520",
    2: "#111927",
    3: "#0d2847",
    4: "#003362",
    5: "#004074",
    6: "#104d87",
    7: "#205d9e",
    8: "#2870bd",
    9: "#0090ff",
    10: "#3b9eff",
    11: "#70b8ff",
    12: "#c2e6ff",
  },
};

export const purpleHex: ModeHex = {
  light: {
    1: "#fefcfe",
    2: "#fbf7fe",
    3: "#f7edfe",
    4: "#f2e2fc",
    5: "#ead5f9",
    6: "#e0c4f4",
    7: "#d1afec",
    8: "#be93e4",
    9: "#8e4ec6",
    10: "#8347b9",
    11: "#8145b5",
    12: "#402060",
  },
  dark: {
    1: "#18111b",
    2: "#1e1523",
    3: "#301c3b",
    4: "#3d224e",
    5: "#48295c",
    6: "#54346b",
    7: "#664282",
    8: "#8457aa",
    9: "#8e4ec6",
    10: "#9a5cd0",
    11: "#d19dff",
    12: "#ecd9fa",
  },
};

export const semanticMidHex: Record<
  ColorMode,
  { red: string; green: string; yellow: string }
> = {
  light: { red: redHex.light[9], green: greenHex.light[9], yellow: yellowHex.light[9] },
  dark: { red: redHex.dark[9], green: greenHex.dark[9], yellow: yellowHex.dark[9] },
};

export const SEMANTIC_TOKENS = [
  "background",
  "foreground",
  "card",
  "muted",
  "muted-foreground",
  "accent",
  "border",
  "hover",
  "active",
  "destructive",
  "success",
  "warning",
] as const;

export type SemanticToken = (typeof SEMANTIC_TOKENS)[number];

const semanticGrayMap: Partial<Record<SemanticToken, GrayStep>> = {
  background: 1,
  foreground: 12,
  card: 2,
  muted: 3,
  "muted-foreground": 11,
  accent: 3,
  border: 6,
  hover: 4,
  active: 5,
};

export function defaultSemanticHex(
  token: SemanticToken,
  mode: ColorMode
): string {
  const grayStep = semanticGrayMap[token];
  if (grayStep) return grayHex[mode][grayStep];
  if (token === "destructive") return semanticMidHex[mode].red;
  if (token === "success") return semanticMidHex[mode].green;
  return semanticMidHex[mode].yellow;
}

export type PaletteToken =
  | `gray-${GrayStep}`
  | `red-${GrayStep}`
  | `green-${GrayStep}`
  | `yellow-${GrayStep}`
  | `blue-${GrayStep}`
  | `purple-${GrayStep}`
  | `gray-a${GrayStep}`;

function stepsOf<P extends string>(prefix: P): Array<`${P}${GrayStep}`> {
  return GRAY_STEPS.map((step) => `${prefix}${step}` as `${P}${GrayStep}`);
}

export const FAMILY_TOKENS: Record<ColorFamily, PaletteToken[]> = {
  gray: stepsOf("gray-"),
  red: stepsOf("red-"),
  green: stepsOf("green-"),
  yellow: stepsOf("yellow-"),
  blue: stepsOf("blue-"),
  purple: stepsOf("purple-"),
  alpha: stepsOf("gray-a"),
};

export const PALETTE_TOKENS: PaletteToken[] = COLOR_FAMILIES.flatMap(
  (family) => FAMILY_TOKENS[family]
);

export const TOKEN_COPY_NAMES = [
  ...PALETTE_TOKENS.map((token) => `--${token}`),
  ...SEMANTIC_TOKENS.map((token) => `--${token}`),
] as const;

export function isAlphaToken(token: PaletteToken): boolean {
  return token.startsWith("gray-a");
}

export function defaultPaletteHex(
  token: PaletteToken,
  mode: ColorMode
): string {
  if (token.startsWith("gray-a")) {
    const step = Number(token.slice(6)) as GrayStep;
    return grayAlphaHex[mode][step];
  }
  const step = Number(token.split("-")[1]) as GrayStep;
  if (token.startsWith("gray-")) return grayHex[mode][step];
  if (token.startsWith("red-")) return redHex[mode][step];
  if (token.startsWith("green-")) return greenHex[mode][step];
  if (token.startsWith("blue-")) return blueHex[mode][step];
  if (token.startsWith("purple-")) return purpleHex[mode][step];
  return yellowHex[mode][step];
}
