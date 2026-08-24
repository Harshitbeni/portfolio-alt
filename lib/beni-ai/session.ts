import { isBeniChatRole, type BeniChatTurn } from "./messages";

const STORAGE_KEY = "mini-beni-chat";

export type MiniBeniStoredMessage = BeniChatTurn & {
  id: string;
};

export type MiniBeniChatSession = {
  messages: MiniBeniStoredMessage[];
  nextId: number;
};

const EMPTY_SESSION: MiniBeniChatSession = {
  messages: [],
  nextId: 0,
};

function parseNextId(value: unknown, messages: MiniBeniStoredMessage[]) {
  const fromMessages = messages.reduce((max, message) => {
    const match = /^mini-beni-msg-(\d+)$/.exec(message.id);
    const id = match ? Number(match[1]) : 0;
    return id > max ? id : max;
  }, 0);

  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    return Math.max(Math.floor(value), fromMessages);
  }

  return fromMessages;
}

function parseStoredMessages(value: unknown): MiniBeniStoredMessage[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const messages: MiniBeniStoredMessage[] = [];

  for (const item of value) {
    if (!item || typeof item !== "object") {
      return null;
    }

    const id = "id" in item ? item.id : null;
    const role = "role" in item ? item.role : null;
    const text = "text" in item ? item.text : null;

    if (
      typeof id !== "string" ||
      !id ||
      !isBeniChatRole(role) ||
      typeof text !== "string"
    ) {
      return null;
    }

    const trimmed = text.trim();

    if (!trimmed) {
      return null;
    }

    messages.push({ id, role, text: trimmed });
  }

  return messages;
}

export function readMiniBeniChatSession(): MiniBeniChatSession {
  if (typeof window === "undefined") {
    return EMPTY_SESSION;
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return EMPTY_SESSION;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object") {
      return EMPTY_SESSION;
    }

    const messages = parseStoredMessages(
      "messages" in parsed ? parsed.messages : null,
    );

    if (!messages) {
      return EMPTY_SESSION;
    }

    return {
      messages,
      nextId: parseNextId("nextId" in parsed ? parsed.nextId : null, messages),
    };
  } catch {
    return EMPTY_SESSION;
  }
}

export function writeMiniBeniChatSession(session: MiniBeniChatSession) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Quota or private mode — chat still works in memory.
  }
}
