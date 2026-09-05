import { cn } from "@/lib/utils";

export function MusicWaveform({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("music-waveform", className)}>
      <span className="music-waveform-bar music-waveform-bar--1" />
      <span className="music-waveform-bar music-waveform-bar--2" />
      <span className="music-waveform-bar music-waveform-bar--3" />
      <span className="music-waveform-bar music-waveform-bar--4" />
    </span>
  );
}
