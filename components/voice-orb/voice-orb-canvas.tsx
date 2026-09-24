"use client";

import { Color, Mesh, Program, Renderer, RenderTarget, Triangle, Vec2 } from "ogl";
import { useEffect, useRef, type MutableRefObject } from "react";

import {
  ACTIVITY_WAVE_GAIN,
  waveformPaletteStops,
  type VoiceOrbFrame,
} from "./tuning";
import { speakingScale } from "./simulate-amp";
import {
  GLASS_FRAGMENT,
  GLSL300_VERT,
  WAVEFORM_FRAGMENT,
} from "./shaders";

function num(value: number) {
  return { value };
}

function hexRgb(hex: string): [number, number, number] {
  const parsed = new Color(hex);
  return [parsed.r, parsed.g, parsed.b];
}

function paddedStops(hexes: string[]) {
  const rgb = hexes.map(hexRgb);
  while (rgb.length < 6) {
    rgb.push(rgb[rgb.length - 1] ?? [1, 1, 1]);
  }
  return rgb.slice(0, 6);
}

export function VoiceOrbCanvas({
  frame,
  ampRef,
  ttsAmpRef,
  syncAmpsRef,
  className,
}: {
  frame: VoiceOrbFrame;
  ampRef: MutableRefObject<number>;
  ttsAmpRef: MutableRefObject<number>;
  syncAmpsRef: MutableRefObject<(timeSec: number) => void>;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(frame);

  useEffect(() => {
    frameRef.current = frame;
  }, [frame]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) {
      return;
    }
    wrap.dataset.boot = "1";

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      depth: false,
      premultipliedAlpha: true,
      webgl: 2,
    });
    const { gl } = renderer;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.display = "block";
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    gl.canvas.style.backgroundColor = "transparent";
    wrap.style.width = "100%";
    wrap.style.height = "100%";
    wrap.style.overflow = "hidden";
    wrap.style.borderRadius = "50%";
    wrap.style.background = "transparent";
    wrap.style.transformOrigin = "center center";
    wrap.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const waveform = new Program(gl, {
      vertex: GLSL300_VERT,
      fragment: WAVEFORM_FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: num(0),
        uResolution: { value: new Vec2(1, 1) },
        uStop0: { value: new Color("#F26E5E") },
        uStop1: { value: new Color("#FFEEBE") },
        uStop2: { value: new Color("#FFD168") },
        uStop3: { value: new Color("#A4661C") },
        uStop4: { value: new Color("#7E4410") },
        uStop5: { value: new Color("#DCA427") },
        uStopCount: num(6),
        uCount: num(8),
        uSpeed: num(1.5),
        uAmplitude: num(3),
        uWaviness: num(0.2),
        uThickness: num(1.75),
        uGlow: num(2),
        uTaper: num(6),
        uSpread: num(1.5),
        uHueShift: num(0),
        uIntensity: num(0.25),
        uOpacity: num(1),
        uScale: num(3),
        uSaturation: num(2),
      },
    });
    const glass = new Program(gl, {
      vertex: GLSL300_VERT,
      fragment: GLASS_FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uScene: { value: null },
        uResolution: { value: new Vec2(1, 1) },
        uRadius: num(0.46),
        uRefraction: num(3),
        uDispersion: num(4),
      },
    });

    const waveMesh = new Mesh(gl, { geometry, program: waveform });
    const glassMesh = new Mesh(gl, { geometry, program: glass });
    const target = new RenderTarget(gl, {
      width: 1,
      height: 1,
      depth: false,
    });
    glass.uniforms.uScene.value = target.texture;

    const resize = () => {
      const size = frameRef.current.size;
      renderer.setSize(size, size);
      const px = size * renderer.dpr;
      waveform.uniforms.uResolution.value.set(px, px);
      glass.uniforms.uResolution.value.set(px, px);
      target.setSize(px, px);
    };
    resize();

    let raf = 0;
    let last = 0;
    let elapsedMs = 0;
    let lastSpeak = Number.NEGATIVE_INFINITY;
    let speakBlend = 0;

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      try {
        const current = frameRef.current;
        if (current.size !== renderer.width) {
          resize();
        }

        const dt = last === 0 ? 16 : Math.min(now - last, 64);
        last = now;
        if (!current.reducedMotion) {
          elapsedMs += dt;
        }
        const timeSec = elapsedMs / 1000;
        syncAmpsRef.current(timeSec);
        const liveAmp = ampRef.current;
        const ttsAmp = ttsAmpRef.current;
        if (ttsAmp > 0.045) {
          lastSpeak = now;
        }
        const wantSpeak =
          current.activity === "speaking" || now - lastSpeak < 450 ? 1 : 0;
        speakBlend += (wantSpeak - speakBlend) * 0.14;
        const shaderAmp =
          current.activity === "speaking" ? liveAmp * (1 - speakBlend) : liveAmp;
        const speakScale = speakingScale(
          ttsAmp,
          current.tuning.waveform.speakingSize,
          current.reducedMotion ? 0 : speakBlend,
        );
        const listenScale =
          current.activity === "listening" && !current.reducedMotion
            ? 1 + liveAmp * 0.1
            : 1;
        wrap.style.transform = `scale(${speakScale * listenScale})`;
        wrap.style.filter = `brightness(${current.tuning.common.brightness}) saturate(${current.tuning.common.saturation})`;
        wrap.style.opacity = String(current.tuning.common.opacity);
        wrap.dataset.amp = liveAmp.toFixed(3);
        wrap.dataset.tts = ttsAmp.toFixed(3);
        wrap.dataset.shaderAmp = shaderAmp.toFixed(3);
        wrap.dataset.activity = current.activity;

        const wave = current.tuning.waveform;
        const gain =
          current.activity === "speaking" || speakBlend > 0.01
            ? ACTIVITY_WAVE_GAIN.listening
            : ACTIVITY_WAVE_GAIN[current.activity];
        const ampMul = 1 + shaderAmp * wave.audioAmplitude;
        const motion = current.reducedMotion ? 0 : current.tuning.common.motion;
        const hexes = waveformPaletteStops(current.tuning.palette, wave.dropC2C3);
        const stops = paddedStops(hexes);
        const writeStop = (uniform: { value: Color }, rgb: [number, number, number]) => {
          uniform.value[0] = rgb[0];
          uniform.value[1] = rgb[1];
          uniform.value[2] = rgb[2];
        };

        waveform.uniforms.uTime.value = timeSec;
        writeStop(waveform.uniforms.uStop0, stops[0]);
        writeStop(waveform.uniforms.uStop1, stops[1]);
        writeStop(waveform.uniforms.uStop2, stops[2]);
        writeStop(waveform.uniforms.uStop3, stops[3]);
        writeStop(waveform.uniforms.uStop4, stops[4]);
        writeStop(waveform.uniforms.uStop5, stops[5]);
        waveform.uniforms.uStopCount.value = Math.min(hexes.length, 6);
        waveform.uniforms.uCount.value = Math.min(Math.max(Math.round(wave.count), 1), 12);
        waveform.uniforms.uSpeed.value =
          wave.speed * motion * gain.speed * (1 + shaderAmp * wave.audioSpeed);
        waveform.uniforms.uAmplitude.value = wave.amplitude * gain.amplitude * ampMul;
        waveform.uniforms.uWaviness.value = wave.waviness;
        waveform.uniforms.uThickness.value = wave.thickness;
        waveform.uniforms.uGlow.value = wave.glow;
        waveform.uniforms.uTaper.value = wave.taper;
        waveform.uniforms.uSpread.value = wave.spread;
        waveform.uniforms.uHueShift.value = wave.hueShift;
        waveform.uniforms.uIntensity.value = Math.min(
          1,
          wave.intensity * gain.intensity * (1 + shaderAmp * wave.audioIntensity),
        );
        waveform.uniforms.uOpacity.value = wave.opacity;
        waveform.uniforms.uScale.value = wave.scale;
        waveform.uniforms.uSaturation.value = wave.saturation;

        if (wave.glass) {
          glass.uniforms.uRefraction.value = wave.refraction;
          glass.uniforms.uDispersion.value = wave.dispersion;
          glass.uniforms.uRadius.value = 0.46 * wave.glassSize;
          renderer.render({ scene: waveMesh, target });
          glass.uniforms.uScene.value = target.texture;
          renderer.render({ scene: glassMesh });
        } else {
          renderer.render({ scene: waveMesh });
        }
      } catch (error) {
        wrap.dataset.error = error instanceof Error ? error.message : "tick failed";
      }
    };
    raf = requestAnimationFrame(tick);

    const onLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(raf);
    };
    gl.canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      gl.canvas.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      if (gl.canvas.parentNode === wrap) {
        wrap.removeChild(gl.canvas);
      }
    };
  }, [ampRef, syncAmpsRef, ttsAmpRef]);

  return (
    <div
      style={{
        width: frame.size,
        height: frame.size,
      }}
    >
      <div ref={wrapRef} aria-hidden="true" className={className} />
    </div>
  );
}
