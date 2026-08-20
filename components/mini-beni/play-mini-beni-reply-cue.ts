import { play } from "cuelume";

const cuedBeniMessageIds = new Set<string>();

function prefersReducedSound() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.matchMedia("(prefers-reduced-sound: reduce)").matches
  );
}

export function resetMiniBeniReplyCues() {
  cuedBeniMessageIds.clear();
}

/** Pulse once when a Mini Beni reply bubble enters. */
export function playMiniBeniReplyCue(messageId: string) {
  if (cuedBeniMessageIds.has(messageId)) {
    return;
  }

  cuedBeniMessageIds.add(messageId);

  if (prefersReducedSound()) {
    return;
  }

  play("pulse");
}
