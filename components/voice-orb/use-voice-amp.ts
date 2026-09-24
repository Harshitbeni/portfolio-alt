"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  bandEnergy,
  lerpToward,
  simulatedAmpTarget,
} from "./simulate-amp";
import type { OrbActivity } from "./tuning";

type MicGraph = {
  context: AudioContext;
  stream: MediaStream;
  source: MediaStreamAudioSourceNode;
  analyser: AnalyserNode;
  buffer: Uint8Array;
};

export function useVoiceAmp({
  activity,
  simulateAudio,
  manualInput,
  manualOutput,
  reducedMotion,
}: {
  activity: OrbActivity;
  simulateAudio: boolean;
  manualInput: number;
  manualOutput: number;
  reducedMotion: boolean;
}) {
  const ampRef = useRef(0);
  const ttsAmpRef = useRef(0);
  const micAmpRef = useRef(0);
  const activityRef = useRef(activity);
  const simulateRef = useRef(simulateAudio);
  const manualInputRef = useRef(manualInput);
  const manualOutputRef = useRef(manualOutput);
  const [micLive, setMicLive] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);
  const graphRef = useRef<MicGraph | null>(null);
  const startingRef = useRef(false);

  const stopMic = useCallback(() => {
    const graph = graphRef.current;
    graphRef.current = null;
    startingRef.current = false;
    if (!graph) {
      setMicLive(false);
      return;
    }
    graph.source.disconnect();
    graph.stream.getTracks().forEach((track) => track.stop());
    void graph.context.close();
    setMicLive(false);
  }, []);

  const startMic = useCallback(async () => {
    if (reducedMotion || graphRef.current || startingRef.current) {
      return graphRef.current !== null;
    }

    startingRef.current = true;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: false,
      });
      const context = new AudioContext();
      if (context.state === "suspended") {
        await context.resume();
      }
      const source = context.createMediaStreamSource(stream);
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.55;
      source.connect(analyser);
      const buffer = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
      graphRef.current = { context, stream, source, analyser, buffer };
      setMicError(null);
      setMicLive(true);
      startingRef.current = false;
      return true;
    } catch (error) {
      startingRef.current = false;
      setMicError(error instanceof Error ? error.message : "Microphone unavailable");
      setMicLive(false);
      return false;
    }
  }, [reducedMotion]);

  useEffect(() => {
    activityRef.current = activity;
    simulateRef.current = simulateAudio;
    manualInputRef.current = manualInput;
    manualOutputRef.current = manualOutput;
  }, [activity, manualInput, manualOutput, simulateAudio]);

  const syncAmps = useCallback((timeSec: number) => {
    if (reducedMotion) {
      ampRef.current = 0;
      ttsAmpRef.current = 0;
      micAmpRef.current = 0;
      return;
    }

    const currentActivity = activityRef.current;

    const graph = graphRef.current;
    if (!simulateRef.current) {
      ampRef.current = manualInputRef.current;
      ttsAmpRef.current =
        currentActivity === "speaking" ? manualOutputRef.current : 0;
      micAmpRef.current = manualInputRef.current;
      return;
    }

    let mic = 0;
    if (graph && currentActivity === "listening") {
      if (graph.context.state === "suspended") {
        void graph.context.resume();
      }
      mic = bandEnergy(graph.analyser, graph.buffer);
    }

    const simulated = simulatedAmpTarget(currentActivity, timeSec);
    const ttsTarget = currentActivity === "speaking" ? simulated : 0;
    const inputTarget =
      currentActivity === "listening" && graph
        ? Math.max(mic, 0.16)
        : simulated;
    const liveTarget = Math.max(inputTarget, ttsTarget);
    const attack = graph ? 0.45 : 0.3;

    ampRef.current = lerpToward(ampRef.current, liveTarget, attack, 0.1);
    ttsAmpRef.current = lerpToward(ttsAmpRef.current, ttsTarget, attack, 0.1);
    micAmpRef.current = lerpToward(micAmpRef.current, mic, attack, 0.1);
  }, [reducedMotion]);

  const syncAmpsRef = useRef(syncAmps);

  useEffect(() => {
    syncAmpsRef.current = syncAmps;
  }, [syncAmps]);

  useEffect(() => {
    return () => {
      stopMic();
    };
  }, [stopMic]);

  useEffect(() => {
    if (activity !== "listening") {
      stopMic();
    }
  }, [activity, stopMic]);

  return {
    ampRef,
    ttsAmpRef,
    micAmpRef,
    micLive,
    micError,
    startMic,
    stopMic,
    syncAmpsRef,
  };
}
