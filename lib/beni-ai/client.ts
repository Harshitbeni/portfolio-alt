import {
  BENI_FALLBACK_REPLY,
  BENI_MAX_TURNS,
  compactBeniChatTurns,
  type BeniChatTurn,
} from "./messages";

export async function requestBeniReply(
  messages: BeniChatTurn[],
  signal: AbortSignal,
) {
  const response = await fetch("/api/beni", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      messages: compactBeniChatTurns(messages).slice(-BENI_MAX_TURNS),
    }),
    signal,
  });

  let data: unknown;

  try {
    data = await response.json();
  } catch {
    return BENI_FALLBACK_REPLY;
  }

  if (
    data &&
    typeof data === "object" &&
    "text" in data &&
    typeof data.text === "string" &&
    data.text.trim()
  ) {
    return data.text;
  }

  return BENI_FALLBACK_REPLY;
}
