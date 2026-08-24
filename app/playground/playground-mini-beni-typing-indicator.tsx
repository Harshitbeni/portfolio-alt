"use client";

import "@/components/mini-beni/mini-beni.css";
import { MiniBeniTypingIndicator } from "@/components/mini-beni/mini-beni-typing-indicator";
import { getMiniBeniChatBubbleEnterStyle } from "@/components/mini-beni/use-mini-beni-chat-bubble-enter-dials";
import { getMiniBeniTypingIndicatorStyle } from "@/components/mini-beni/use-mini-beni-typing-indicator-dials";

export function PlaygroundMiniBeniTypingIndicator() {
  const style = {
    ...getMiniBeniChatBubbleEnterStyle(),
    ...getMiniBeniTypingIndicatorStyle(),
  };

  return (
    <div className="flex w-full max-w-md flex-col">
      <MiniBeniTypingIndicator style={style} />
    </div>
  );
}
