export const BENI_MAX_TURNS = 8;
export const BENI_MAX_USER_CHARS = 280;
export const BENI_BUBBLE_STAGGER_MIN_MS = 1000;
export const BENI_BUBBLE_STAGGER_MAX_MS = 2000;
const BENI_BUBBLE_STAGGER_REF_CHARS = 72;

export function beniBubbleStaggerMs(text: string) {
  const span = BENI_BUBBLE_STAGGER_MAX_MS - BENI_BUBBLE_STAGGER_MIN_MS;
  const t = Math.min(1, text.trim().length / BENI_BUBBLE_STAGGER_REF_CHARS);
  const base = BENI_BUBBLE_STAGGER_MIN_MS + t * span;
  const jitter = (Math.random() - 0.5) * 300;

  return Math.round(
    Math.min(
      BENI_BUBBLE_STAGGER_MAX_MS,
      Math.max(BENI_BUBBLE_STAGGER_MIN_MS, base + jitter),
    ),
  );
}

export const BENI_FALLBACK_REPLY =
  "couldn't get that\n\ntry again in a sec";

export const BENI_RATE_LIMIT_REPLY =
  "slow down a sec\n\ni'm getting a lot of questions";

export type BeniChatRole = "user" | "beni";

export type BeniChatTurn = {
  role: BeniChatRole;
  text: string;
};

export type BeniChatRequest = {
  messages: BeniChatTurn[];
};

export function splitBeniBubbles(text: string) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function compactBeniChatTurns(messages: BeniChatTurn[]) {
  const compacted: BeniChatTurn[] = [];

  for (const message of messages) {
    const last = compacted.at(-1);

    if (last && last.role === "beni" && message.role === "beni") {
      last.text = `${last.text}\n\n${message.text}`;
      continue;
    }

    compacted.push({ role: message.role, text: message.text });
  }

  return compacted;
}

export function isBeniChatRole(value: unknown): value is BeniChatRole {
  return value === "user" || value === "beni";
}

export function parseBeniChatRequest(body: unknown): BeniChatRequest | null {
  if (!body || typeof body !== "object" || !("messages" in body)) {
    return null;
  }

  const rawMessages = (body as { messages: unknown }).messages;

  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return null;
  }

  const messages: BeniChatTurn[] = [];

  for (const item of rawMessages) {
    if (!item || typeof item !== "object") {
      return null;
    }

    const role = "role" in item ? item.role : null;
    const text = "text" in item ? item.text : null;

    if (!isBeniChatRole(role) || typeof text !== "string") {
      return null;
    }

    const trimmed = text.trim();

    if (!trimmed) {
      return null;
    }

    messages.push({
      role,
      text:
        role === "user" ? trimmed.slice(0, BENI_MAX_USER_CHARS) : trimmed,
    });
  }

  const last = messages.at(-1);

  if (last?.role !== "user") {
    return null;
  }

  return { messages: messages.slice(-BENI_MAX_TURNS) };
}
