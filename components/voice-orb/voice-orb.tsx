"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  RECIPE_PALETTES,
  type OrbActivity,
  type OrbRecipe,
  type OrbTuning,
  type VoiceOrbFrame,
} from "./tuning";
import { useVoiceAmp } from "./use-voice-amp";
import { useVoiceOrbDials } from "./use-voice-orb-dials";

const VoiceOrbCanvas = dynamic(
  () => import("./voice-orb-canvas").then((module) => module.VoiceOrbCanvas),
  { ssr: false },
);

export function VoiceOrb({
  recipe,
  activity,
  onActivityChange,
}: {
  recipe: OrbRecipe;
  activity: OrbActivity;
  onActivityChange?: (activity: OrbActivity) => void;
}) {
  const { values } = useVoiceOrbDials();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const frame = useMemo<VoiceOrbFrame>(() => {
    const tuning: OrbTuning = {
      common: {
        brightness: values.common.brightness,
        halo: values.common.halo,
        motion: values.common.motion,
        opacity: values.common.opacity,
        saturation: values.common.saturation,
      },
      palette: RECIPE_PALETTES[recipe],
      waveform: {
        amplitude: values.waveform.amplitude,
        audioAmplitude: values.waveform.audioAmplitude,
        audioIntensity: values.waveform.audioIntensity,
        audioSpeed: values.waveform.audioSpeed,
        count: values.waveform.count,
        dispersion: values.waveform.dispersion,
        dropC2C3: values.waveform.dropC2C3,
        glass: values.waveform.glass,
        glassSize: values.waveform.glassSize,
        glow: values.waveform.glow,
        hueShift: values.waveform.hueShift,
        intensity: values.waveform.intensity,
        opacity: values.waveform.opacity,
        refraction: values.waveform.refraction,
        saturation: values.waveform.saturation,
        scale: values.waveform.scale,
        speakingSize: values.waveform.speakingSize,
        speed: values.waveform.speed,
        spread: values.waveform.spread,
        taper: values.waveform.taper,
        thickness: values.waveform.thickness,
        variation: values.waveform.variation,
        waviness: values.waveform.waviness,
      },
    };

    return {
      size: values.session.size,
      activity,
      tuning,
      simulateAudio: values.session.simulateAudio,
      manualInput: values.session.inputAmp,
      manualOutput: values.session.outputAmp,
      reducedMotion,
    };
  }, [activity, recipe, reducedMotion, values]);

  const {
    ampRef,
    micLive,
    startMic,
    stopMic,
    syncAmpsRef,
    ttsAmpRef,
  } = useVoiceAmp({
    activity: frame.activity,
    simulateAudio: frame.simulateAudio,
    manualInput: frame.manualInput,
    manualOutput: frame.manualOutput,
    reducedMotion,
  });
  const autoStartActivityRef = useRef<OrbActivity | null>(null);

  useEffect(() => {
    if (frame.activity !== "listening") {
      autoStartActivityRef.current = null;
      return;
    }

    if (autoStartActivityRef.current !== "listening" && !micLive) {
      autoStartActivityRef.current = "listening";
      void startMic();
    }
  }, [frame.activity, micLive, startMic]);

  const toggleListen = async () => {
    if (frame.activity === "listening" && micLive) {
      stopMic();
      onActivityChange?.("idle");
      return;
    }

    onActivityChange?.("listening");
    await startMic();
  };

  const liveLabel = micLive ? "listening to microphone" : frame.activity;

  return (
    <button
      type="button"
      aria-pressed={micLive}
      aria-label={`Voice orb, ${liveLabel}, ${recipe}. Click to ${micLive ? "stop listening" : "listen with microphone"}`}
      className="flex items-center justify-center rounded-full outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
      style={{ width: frame.size + 48, height: frame.size + 48 }}
      onClick={() => {
        void toggleListen();
      }}
    >
      <VoiceOrbCanvas
        key="voice-orb-canvas-audio-v4"
        frame={frame}
        ampRef={ampRef}
        ttsAmpRef={ttsAmpRef}
        syncAmpsRef={syncAmpsRef}
      />
    </button>
  );
}
