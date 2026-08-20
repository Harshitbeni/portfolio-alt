import type { Position } from "./reveal-core";

export const IDLE_LOOPS_BEFORE_WAVE = 5;
export const CURSOR_SETTLE_MS = 600;

export type LookFrame = {
  row: 9 | 10;
  frame: number;
  directionDegrees: number;
};

export function getLookFrame(
  petPosition: Position,
  petWidth: number,
  petHeight: number,
  cursor: Position,
): LookFrame | null {
  const centerX = petPosition.x + petWidth / 2;
  const centerY = petPosition.y + petHeight / 2;
  const deltaX = cursor.x - centerX;
  const deltaY = cursor.y - centerY;

  if (deltaX === 0 && deltaY === 0) {
    return null;
  }

  const clockwiseFromUp = (Math.atan2(deltaX, -deltaY) * 180) / Math.PI;
  const normalized = (clockwiseFromUp + 360) % 360;
  const directionIndex = Math.round(normalized / 22.5) % 16;

  return {
    row: directionIndex < 8 ? 9 : 10,
    frame: directionIndex % 8,
    directionDegrees: directionIndex * 22.5,
  };
}

export function shouldWaveAfterIdleLoop(completedIdleLoops: number): boolean {
  return completedIdleLoops >= IDLE_LOOPS_BEFORE_WAVE;
}

export function getRestingAnimationState({
  hovering,
  gazeActive,
}: {
  hovering: boolean;
  gazeActive: boolean;
}): "reviewing" | "looking" | "idle" {
  if (hovering) {
    return "reviewing";
  }

  return gazeActive ? "looking" : "idle";
}
