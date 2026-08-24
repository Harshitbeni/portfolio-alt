import type { MiniBeniTypingIndicatorStyle } from "./use-mini-beni-typing-indicator-dials";

type MiniBeniTypingIndicatorProps = {
  style: MiniBeniTypingIndicatorStyle;
};

export function MiniBeniTypingIndicator({ style }: MiniBeniTypingIndicatorProps) {
  return (
    <div
      aria-label="Beni is typing"
      className="mini-beni-typing-indicator mini-beni-chat-bubble-enter"
      role="status"
      style={style}
    >
      <div aria-hidden className="mini-beni-typing-indicator-body">
        <div className="mini-beni-typing-indicator-bubble">
          <span className="mini-beni-typing-indicator-dot" />
          <span className="mini-beni-typing-indicator-dot" />
          <span className="mini-beni-typing-indicator-dot" />
        </div>
        <span className="mini-beni-typing-indicator-tail mini-beni-typing-indicator-tail-large" />
        <span className="mini-beni-typing-indicator-tail mini-beni-typing-indicator-tail-small" />
      </div>
    </div>
  );
}
