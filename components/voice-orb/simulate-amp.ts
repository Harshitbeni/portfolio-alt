import type { MutableRefObject } from "react";

import type { OrbActivity } from "./tuning";

export function lerpToward(current: number, target: number, attack: number, release: number) {
  const rate = target > current ? attack : release;
  return current + (target - current) * rate;
}

export function bandEnergy(analyser: AnalyserNode, buffer: Uint8Array) {
  analyser.getByteFrequencyData(
    buffer as Parameters<AnalyserNode["getByteFrequencyData"]>[0],
  );
  const count = Math.min(28, buffer.length);
  if (count <= 1) {
    return 0;
  }

  let sum = 0;
  for (let i = 1; i < count; i += 1) {
    sum += buffer[i] ?? 0;
  }

  return sum / (count - 1) / 255;
}

/** Bland hero fallback when no AudioContext graph is attached. */
export function simulatedAmpTarget(activity: OrbActivity, timeSec: number) {
  if (activity === "speaking") {
    const talk =
      0.65 * (0.5 + 0.5 * Math.sin(1.85 * timeSec)) +
      0.35 * (0.5 + 0.5 * Math.sin(6.4 * timeSec + 1.2));
    return Math.min(1, 0.3 + talk * 0.7);
  }

  if (activity === "listening") {
    const wait =
      0.62 * (0.5 + 0.5 * Math.sin(1.55 * timeSec)) +
      0.38 * (0.5 + 0.5 * Math.sin(4.8 * timeSec + 1.1));
    return 0.22 + wait * 0.32;
  }

  return 0;
}

export function speakingScale(
  ttsAmp: number,
  speakingSize: number,
  speakingBlend: number,
) {
  return 1 + ttsAmp * speakingSize * speakingBlend;
}

export type VoiceAmpRefs = {
  ampRef: MutableRefObject<number>;
  ttsAmpRef: MutableRefObject<number>;
  micAmpRef: MutableRefObject<number>;
};
