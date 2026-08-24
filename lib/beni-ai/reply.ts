import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

import {
  BENI_FALLBACK_REPLY,
  splitBeniBubbles,
  type BeniChatTurn,
} from "./messages";
import { BENI_INSTRUCTIONS } from "./prompt";

export function formatBeniReply(text: string) {
  const bubbles = splitBeniBubbles(text.replace(/\u2014|\u2013/g, ","))
    .map((line) => line.replace(/\.+$/, ""))
    .filter(Boolean);

  return bubbles.join("\n\n") || BENI_FALLBACK_REPLY;
}

export async function generateBeniReply(messages: BeniChatTurn[]) {
  const { text } = await generateText({
    model: openai("gpt-5.6-luna"),
    instructions: BENI_INSTRUCTIONS,
    messages: messages.map((message) => ({
      role: message.role === "beni" ? "assistant" : "user",
      content: message.text,
    })),
    maxOutputTokens: 120,
    reasoning: "low",
  });

  return formatBeniReply(text);
}
