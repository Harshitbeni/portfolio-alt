"use client";

import { VoiceOrb } from "@/components/voice-orb/voice-orb";
import type { OrbActivity, OrbRecipe } from "@/components/voice-orb/tuning";

export function PlaygroundVoiceOrb({
  recipe,
  activity,
  onActivityChange,
}: {
  recipe: OrbRecipe;
  activity: OrbActivity;
  onActivityChange: (activity: OrbActivity) => void;
}) {
  return (
    <VoiceOrb
      recipe={recipe}
      activity={activity}
      onActivityChange={onActivityChange}
    />
  );
}
