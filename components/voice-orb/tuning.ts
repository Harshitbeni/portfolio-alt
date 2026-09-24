export const ORB_ACTIVITIES = ["idle", "listening", "speaking"] as const;
export const ORB_RECIPES = [
  "concierge",
  "healthcare",
  "insurance",
  "banking",
] as const;

export type OrbActivity = (typeof ORB_ACTIVITIES)[number];
export type OrbRecipe = (typeof ORB_RECIPES)[number];

export type OrbPalette = {
  bg: string;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  c5: string;
  halo: string;
};

export type OrbCommon = {
  brightness: number;
  halo: number;
  motion: number;
  opacity: number;
  saturation: number;
};

export type OrbWaveform = {
  amplitude: number;
  audioAmplitude: number;
  audioIntensity: number;
  audioSpeed: number;
  count: number;
  dispersion: number;
  dropC2C3: boolean;
  glass: boolean;
  glassSize: number;
  glow: number;
  hueShift: number;
  intensity: number;
  opacity: number;
  refraction: number;
  saturation: number;
  scale: number;
  speakingSize: number;
  speed: number;
  spread: number;
  taper: number;
  thickness: number;
  variation: number;
  waviness: number;
};

export type OrbTuning = {
  common: OrbCommon;
  palette: OrbPalette;
  waveform: OrbWaveform;
};

export const RECIPE_PALETTES: Record<OrbRecipe, OrbPalette> = {
  concierge: {
    bg: "#DA9518",
    c1: "#7E4410",
    c2: "#FFEEBE",
    c3: "#A4661C",
    c4: "#F26E5E",
    c5: "#FFD168",
    halo: "#DCA427",
  },
  healthcare: {
    bg: "#4A6B3E",
    c1: "#2E5C2B",
    c2: "#D4E6A5",
    c3: "#41782E",
    c4: "#FFCB68",
    c5: "#9CCB74",
    halo: "#5F8549",
  },
  insurance: {
    bg: "#2A4C7A",
    c1: "#1E4068",
    c2: "#D6E8F5",
    c3: "#2A5E96",
    c4: "#FFB955",
    c5: "#7FB6DF",
    halo: "#2E5490",
  },
  banking: {
    bg: "#C22F35",
    c1: "#7A1525",
    c2: "#FFC9C2",
    c3: "#9E1F32",
    c4: "#E2557B",
    c5: "#F2A268",
    halo: "#C73E4A",
  },
};

export const DEFAULT_COMMON: OrbCommon = {
  brightness: 0.9,
  halo: 0.79,
  motion: 0.02,
  opacity: 1,
  saturation: 1.8,
};

export const DEFAULT_WAVEFORM: OrbWaveform = {
  amplitude: 3,
  audioAmplitude: 0,
  audioIntensity: 2,
  audioSpeed: 0.07,
  count: 8,
  dispersion: 4,
  dropC2C3: false,
  glass: true,
  glassSize: 1,
  glow: 2,
  hueShift: 0,
  intensity: 0.25,
  opacity: 1,
  refraction: 3,
  saturation: 2,
  scale: 3,
  speakingSize: 0.15,
  speed: 1.5,
  spread: 1.5,
  taper: 6,
  thickness: 1.75,
  variation: 2,
  waviness: 0.2,
};

export const DEFAULT_ORB_SIZE = 164;

/** Live Bland activity gains applied to waveform speed / amplitude / intensity. */
export const ACTIVITY_WAVE_GAIN: Record<
  OrbActivity,
  { amplitude: number; intensity: number; speed: number }
> = {
  idle: { amplitude: 0.56, intensity: 0.72, speed: 0.5 },
  listening: { amplitude: 0.98, intensity: 0.94, speed: 0.86 },
  speaking: { amplitude: 1.24, intensity: 1.12, speed: 1.18 },
};

export function waveformPaletteStops(palette: OrbPalette, dropC2C3: boolean) {
  if (dropC2C3) {
    return [palette.c4, palette.c5, palette.c1, palette.halo];
  }

  return [palette.c4, palette.c2, palette.c5, palette.c3, palette.c1, palette.halo];
}

export type VoiceOrbFrame = {
  size: number;
  activity: OrbActivity;
  tuning: OrbTuning;
  simulateAudio: boolean;
  manualInput: number;
  manualOutput: number;
  reducedMotion: boolean;
};
