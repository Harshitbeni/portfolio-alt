import { useDialKitController } from "dialkit";
import { DEFAULT_COMMON, DEFAULT_ORB_SIZE, DEFAULT_WAVEFORM } from "./tuning";

export function useVoiceOrbDials() {
  return useDialKitController(
    "Voice Orb",
    {
      session: {
        size: [DEFAULT_ORB_SIZE, 64, 360, 1],
        simulateAudio: true,
        inputAmp: [0, 0, 1, 0.01],
        outputAmp: [0, 0, 1, 0.01],
      },
      common: {
        brightness: [DEFAULT_COMMON.brightness, 0, 2, 0.01],
        halo: [DEFAULT_COMMON.halo, 0, 2, 0.01],
        motion: [DEFAULT_COMMON.motion, 0, 0.2, 0.001],
        opacity: [DEFAULT_COMMON.opacity, 0, 1, 0.01],
        saturation: [DEFAULT_COMMON.saturation, 0, 3, 0.01],
      },
      waveform: {
        count: [DEFAULT_WAVEFORM.count, 1, 12, 1],
        speed: [DEFAULT_WAVEFORM.speed, 0, 4, 0.05],
        amplitude: [DEFAULT_WAVEFORM.amplitude, 0, 8, 0.05],
        waviness: [DEFAULT_WAVEFORM.waviness, 0, 2, 0.01],
        thickness: [DEFAULT_WAVEFORM.thickness, 0.1, 6, 0.05],
        glow: [DEFAULT_WAVEFORM.glow, 0, 8, 0.05],
        taper: [DEFAULT_WAVEFORM.taper, 0, 12, 0.1],
        spread: [DEFAULT_WAVEFORM.spread, 0.2, 4, 0.05],
        hueShift: [DEFAULT_WAVEFORM.hueShift, -180, 180, 1],
        intensity: [DEFAULT_WAVEFORM.intensity, 0, 2, 0.01],
        saturation: [DEFAULT_WAVEFORM.saturation, 0, 4, 0.05],
        opacity: [DEFAULT_WAVEFORM.opacity, 0, 1, 0.01],
        scale: [DEFAULT_WAVEFORM.scale, 0.4, 6, 0.05],
        glass: DEFAULT_WAVEFORM.glass,
        refraction: [DEFAULT_WAVEFORM.refraction, 0, 8, 0.05],
        dispersion: [DEFAULT_WAVEFORM.dispersion, 0, 8, 0.05],
        glassSize: [DEFAULT_WAVEFORM.glassSize, 0.2, 3, 0.05],
        audioAmplitude: [DEFAULT_WAVEFORM.audioAmplitude, 0, 2, 0.01],
        audioIntensity: [DEFAULT_WAVEFORM.audioIntensity, 0, 6, 0.05],
        audioSpeed: [DEFAULT_WAVEFORM.audioSpeed, 0, 0.4, 0.005],
        speakingSize: [DEFAULT_WAVEFORM.speakingSize, 0, 0.8, 0.01],
        variation: [DEFAULT_WAVEFORM.variation, 0, 8, 0.05],
        dropC2C3: DEFAULT_WAVEFORM.dropC2C3,
      },
    },
    {
      id: "voice-orb-v3",
      persist: true,
    },
  );
}
