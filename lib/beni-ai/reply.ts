import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

import { getBeniMusicKnowledge } from "./music-knowledge";
import {
  BENI_FALLBACK_REPLY,
  splitBeniBubbles,
  type BeniChatTurn,
} from "./messages";
import { getBeniInstructions } from "./prompt";

export function formatBeniReply(text: string) {
  const bubbles = splitBeniBubbles(
    text.replace(/\u2014|\u2013/g, ",").replace(/<\|[^|]+\|>/g, ""),
  )
    .map((line) => line.replace(/\.+$/, ""))
    .filter(Boolean);

  return bubbles.join("\n\n") || BENI_FALLBACK_REPLY;
}

export async function generateBeniReply(messages: BeniChatTurn[]) {
  const latestUser = [...messages]
    .reverse()
    .find((message) => message.role === "user");
  const musicKnowledge = await getBeniMusicKnowledge(latestUser?.text ?? "");

  const { text } = await generateText({
    model: openai("gpt-5.6-luna"),
    instructions: getBeniInstructions(musicKnowledge),
    messages: messages.map((message) => ({
      role: message.role === "beni" ? "assistant" : "user",
      content: message.text,
    })),
    maxOutputTokens: 120,
    reasoning: "low",
  });

  return formatBeniReply(text);
}
