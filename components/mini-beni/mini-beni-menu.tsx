"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from "react";

import { CentralIcon } from "@central-icons-react/all";

import {
  playMiniBeniReplyCue,
  resetMiniBeniReplyCues,
} from "./play-mini-beni-reply-cue";
import { MiniBeniTypingIndicator } from "./mini-beni-typing-indicator";
import {
  getMiniBeniChatBubbleEnterStyle,
  type MiniBeniChatBubbleEnterStyle,
} from "./use-mini-beni-chat-bubble-enter-dials";
import {
  getMiniBeniTypingIndicatorStyle,
  MINI_BENI_TYPING_REPLY_DELAY_MS,
  type MiniBeniTypingIndicatorStyle,
} from "./use-mini-beni-typing-indicator-dials";
import { requestBeniReply } from "@/lib/beni-ai/client";
import {
  BENI_FALLBACK_REPLY,
  BENI_MAX_USER_CHARS,
  beniBubbleStaggerMs,
  splitBeniBubbles,
  type BeniChatTurn,
} from "@/lib/beni-ai/messages";
import {
  readMiniBeniChatSession,
  writeMiniBeniChatSession,
} from "@/lib/beni-ai/session";
import { Bubble, BubbleContent, BubbleGroup } from "@/components/ui/bubble";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuItemWithIcon } from "@/components/ui/dropdown-menu-item-icon";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";

export {
  DropdownMenuItemWithIcon as MiniBeniMenuItem,
  type DropdownMenuItemWithIconProps as MiniBeniMenuItemProps,
} from "@/components/ui/dropdown-menu-item-icon";

type MenuAnchor = {
  x: number;
  y: number;
};

type MiniBeniMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchor: MenuAnchor;
  chatOpen: boolean;
  onClosePet: () => void;
  onChat: () => void;
  onCloseAutoFocus?: (event: Event) => void;
};

export function MiniBeniMenu({
  open,
  onOpenChange,
  anchor,
  chatOpen,
  onClosePet,
  onChat,
  onCloseAutoFocus,
}: MiniBeniMenuProps) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        aria-hidden="true"
        className="pointer-events-none fixed z-[110] size-px appearance-none border-0 bg-transparent p-0 opacity-0"
        style={{ left: anchor.x, top: anchor.y }}
        tabIndex={-1}
      />
      <DropdownMenuContent
        align="start"
        className="z-[120] w-max min-w-36"
        collisionPadding={8}
        data-mini-beni-menu=""
        onCloseAutoFocus={onCloseAutoFocus}
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuItemWithIcon
          icon="raising-hand-4-finger"
          iconClassName="-rotate-45"
          onSelect={onClosePet}
        >
          Bye Bye
        </DropdownMenuItemWithIcon>
        <DropdownMenuItemWithIcon icon="message-circle" onSelect={onChat}>
          {chatOpen ? "Close Chat" : "Chat with Beni"}
        </DropdownMenuItemWithIcon>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type PopoverSide = "top" | "bottom" | "left" | "right";

const CHAT_COLLISION_PADDING = 8;
const CHAT_SIDE_OFFSET = 8;
const CHAT_FULL_HEIGHT = 320;
const CHAT_INPUT_HEIGHT = 28;
const CHAT_INPUT_WIDTH = 224;
const CHAT_COLUMN_GAP = 8;
const CHAT_TRANSCRIPT_HEIGHT =
  CHAT_FULL_HEIGHT - CHAT_INPUT_HEIGHT - CHAT_COLUMN_GAP;
const CHAT_TRANSCRIPT_SHELL_HEIGHT = CHAT_TRANSCRIPT_HEIGHT + CHAT_COLUMN_GAP;
/** Matches `--resize-dur` in `app/globals.css`. */
const CHAT_BUBBLE_ENTER_MS = 300;

type ChatMessage = BeniChatTurn & {
  id: string;
};

function abortReply(controller: { current: AbortController | null }) {
  controller.current?.abort();
  controller.current = null;
}

function waitWithSignal(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const onAbort = () => {
      window.clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };

    const timer = window.setTimeout(() => {
      signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    signal.addEventListener("abort", onAbort, { once: true });
  });
}

function isAbortError(error: unknown) {
  return error instanceof Error && error.name === "AbortError";
}

async function appendStaggeredBeniBubbles({
  text,
  signal,
  nextMessageId,
  setMessages,
}: {
  text: string;
  signal: AbortSignal;
  nextMessageId: () => string;
  setMessages: (update: (current: ChatMessage[]) => ChatMessage[]) => void;
}) {
  const bubbles = splitBeniBubbles(text);

  for (const [index, bubble] of bubbles.entries()) {
    if (index > 0) {
      await waitWithSignal(beniBubbleStaggerMs(bubble), signal);
    }

    if (signal.aborted) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: nextMessageId(),
        role: "beni",
        text: bubble,
      },
    ]);
  }
}

function getTranscriptFades(node: HTMLElement) {
  const overflow = node.scrollHeight - node.clientHeight > 1;

  return {
    top: overflow && node.scrollTop > 1,
    bottom:
      overflow && node.scrollTop + node.clientHeight < node.scrollHeight - 1,
  };
}

const OPPOSITE_SIDE: Record<PopoverSide, PopoverSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

function getChatPopoverSide(rect: DOMRect, hasTranscript: boolean): PopoverSide {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const columnHeight =
    CHAT_INPUT_HEIGHT +
    (hasTranscript ? CHAT_TRANSCRIPT_SHELL_HEIGHT : 0);
  const space: Record<PopoverSide, number> = {
    top: rect.top - CHAT_COLLISION_PADDING,
    bottom: viewportHeight - rect.bottom - CHAT_COLLISION_PADDING,
    left: rect.left - CHAT_COLLISION_PADDING,
    right: viewportWidth - rect.right - CHAT_COLLISION_PADDING,
  };
  const required: Record<PopoverSide, number> = {
    top: columnHeight + CHAT_SIDE_OFFSET,
    bottom: columnHeight + CHAT_SIDE_OFFSET,
    left: CHAT_INPUT_WIDTH + CHAT_SIDE_OFFSET,
    right: CHAT_INPUT_WIDTH + CHAT_SIDE_OFFSET,
  };

  const petCenterX = rect.left + rect.width / 2;
  const petCenterY = rect.top + rect.height / 2;
  const towardCenter: PopoverSide =
    Math.abs(viewportWidth / 2 - petCenterX) >
    Math.abs(viewportHeight / 2 - petCenterY)
      ? petCenterX < viewportWidth / 2
        ? "right"
        : "left"
      : petCenterY < viewportHeight / 2
        ? "bottom"
        : "top";
  const fallbackAxis: PopoverSide =
    towardCenter === "top" || towardCenter === "bottom"
      ? petCenterX < viewportWidth / 2
        ? "right"
        : "left"
      : petCenterY < viewportHeight / 2
        ? "bottom"
        : "top";
  const order: PopoverSide[] = [
    towardCenter,
    OPPOSITE_SIDE[towardCenter],
    fallbackAxis,
    OPPOSITE_SIDE[fallbackAxis],
  ];

  return order.find((side) => space[side] >= required[side]) ?? towardCenter;
}

function isEventOnAnchor(
  event: { target: EventTarget | null },
  anchor: HTMLElement | null,
) {
  return event.target instanceof Node && Boolean(anchor?.contains(event.target));
}

function eventTargetElement(event: { target: EventTarget | null }) {
  const target = event.target;

  if (target instanceof Element) {
    return target;
  }

  if (target instanceof Node) {
    return target.parentElement;
  }

  return null;
}

function isProtectedChatDismissTarget(
  event: { target: EventTarget | null },
  anchor: HTMLElement | null,
) {
  if (isEventOnAnchor(event, anchor)) {
    return true;
  }

  return Boolean(eventTargetElement(event)?.closest("[data-mini-beni-menu]"));
}

function MiniBeniSendIcon() {
  return (
    <CentralIcon
      name="IconArrowUp"
      join="round"
      fill="outlined"
      radius="2"
      stroke="1.5"
      size={12}
      color="currentColor"
      className="text-current [&_mask]:![color:#fff] [&_mask_*]:![color:#fff]"
    />
  );
}

type MiniBeniChatInputProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  anchorRef: RefObject<HTMLElement | null>;
  onCloseAutoFocus?: (event: Event) => void;
};

type TranscriptFades = {
  top: boolean;
  bottom: boolean;
};

function getTranscriptShellHeight() {
  return CHAT_TRANSCRIPT_SHELL_HEIGHT;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function MiniBeniChatBubble({
  animateEnter,
  message,
}: {
  animateEnter: boolean;
  message: ChatMessage;
}) {
  useLayoutEffect(() => {
    if (!animateEnter || message.role !== "beni") {
      return;
    }

    playMiniBeniReplyCue(message.id);
  }, [animateEnter, message.id, message.role]);

  return (
    <Bubble
      align={message.role === "user" ? "end" : "start"}
      className={
        animateEnter
          ? "mini-beni-chat-bubble-enter *:data-[slot=bubble-content]:h-auto *:data-[slot=bubble-content]:min-h-7 *:data-[slot=bubble-content]:overflow-visible"
          : "*:data-[slot=bubble-content]:h-auto *:data-[slot=bubble-content]:min-h-7 *:data-[slot=bubble-content]:overflow-visible"
      }
      pill
      size="sm"
      variant={message.role === "user" ? "blue" : "secondary"}
    >
      <BubbleContent className="block h-auto min-h-7 max-w-full overflow-visible py-1 whitespace-normal wrap-break-word text-left">
        {message.text}
      </BubbleContent>
    </Bubble>
  );
}

function MiniBeniChatTranscript({
  messages,
  isTyping,
  logRef,
  fades,
  enterStyle,
  typingStyle,
  skipEnterIds,
  onScroll,
}: {
  messages: ChatMessage[];
  isTyping: boolean;
  logRef: RefObject<HTMLDivElement | null>;
  fades: TranscriptFades;
  enterStyle: MiniBeniChatBubbleEnterStyle;
  typingStyle: MiniBeniTypingIndicatorStyle;
  skipEnterIds: Set<string>;
  onScroll: () => void;
}) {
  const [shellHeight, setShellHeight] = useState(0);
  const showTop = fades.top;
  const showBottom = fades.bottom;

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      setShellHeight(getTranscriptShellHeight());
    }
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    setShellHeight(getTranscriptShellHeight());
  }, []);

  return (
    <div
      className="t-resize relative w-full overflow-hidden"
      style={{ height: shellHeight, ...enterStyle }}
    >
      <div
        className="mini-beni-chat-transcript-fades relative"
        style={{ height: CHAT_TRANSCRIPT_HEIGHT }}
      >
        <div
          aria-label="Chat with Beni"
          aria-live="polite"
          className="h-full overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={onScroll}
          ref={logRef}
          role="log"
        >
          <div className="mini-beni-chat-bubble-clip" style={typingStyle}>
            <BubbleGroup className="w-full">
              {messages.map((message) => (
                <MiniBeniChatBubble
                  animateEnter={!skipEnterIds.has(message.id)}
                  key={message.id}
                  message={message}
                />
              ))}
              {isTyping ? (
                <MiniBeniTypingIndicator style={typingStyle} />
              ) : null}
            </BubbleGroup>
          </div>
        </div>
        <div
          aria-hidden
          className="mini-beni-chat-transcript-fade pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: "var(--mini-beni-chat-fade-height)",
            opacity: showTop ? "var(--mini-beni-chat-fade-opacity)" : 0,
            backgroundImage:
              "linear-gradient(to bottom, var(--mini-beni-chat-fade-color), transparent)",
          }}
        />
        <div
          aria-hidden
          className="mini-beni-chat-transcript-fade pointer-events-none absolute inset-x-0 bottom-0"
          style={{
            height: "var(--mini-beni-chat-fade-height)",
            opacity: showBottom ? "var(--mini-beni-chat-fade-opacity)" : 0,
            backgroundImage:
              "linear-gradient(to top, var(--mini-beni-chat-fade-color), transparent)",
          }}
        />
      </div>
    </div>
  );
}

/** Follows Mini Beni while dragging; Escape and outside clicks dismiss. */
export function MiniBeniChatInput({
  open,
  onOpenChange,
  anchorRef,
  onCloseAutoFocus,
}: MiniBeniChatInputProps) {
  const [side, setSide] = useState<PopoverSide>("top");
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(
    () => readMiniBeniChatSession().messages,
  );
  const [isTyping, setIsTyping] = useState(false);
  const [fades, setFades] = useState<TranscriptFades>({
    top: false,
    bottom: false,
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(readMiniBeniChatSession().nextId);
  const replyAbortRef = useRef<AbortController | null>(null);
  const fadesLockedRef = useRef(false);
  const fadesUnlockTimerRef = useRef(0);
  const wasOpenRef = useRef(open);
  const skipEnterIdsRef = useRef<Set<string>>(new Set());
  const hasTranscript = messages.length > 0;

  if (open && !wasOpenRef.current) {
    skipEnterIdsRef.current = new Set(messages.map((message) => message.id));
  }
  const enterStyle = getMiniBeniChatBubbleEnterStyle();
  const typingStyle = getMiniBeniTypingIndicatorStyle();

  const nextMessageId = () => {
    messageIdRef.current += 1;
    return `mini-beni-msg-${messageIdRef.current}`;
  };

  const updateFades = () => {
    if (fadesLockedRef.current) {
      return;
    }

    const node = logRef.current;

    if (!node) {
      setFades({ top: false, bottom: false });
      return;
    }

    setFades(getTranscriptFades(node));
  };

  useLayoutEffect(() => {
    if (!open) {
      return;
    }

    const node = anchorRef.current;

    if (!node) {
      return;
    }

    setSide(getChatPopoverSide(node.getBoundingClientRect(), hasTranscript));
  }, [anchorRef, hasTranscript, open]);

  useLayoutEffect(() => {
    const node = logRef.current;

    if (!node) {
      return;
    }

    node.scrollTop = node.scrollHeight;
    setFades(getTranscriptFades(node));
    fadesLockedRef.current = true;
    window.clearTimeout(fadesUnlockTimerRef.current);
    fadesUnlockTimerRef.current = window.setTimeout(() => {
      fadesLockedRef.current = false;
      const log = logRef.current;

      if (log) {
        setFades(getTranscriptFades(log));
      }
    }, CHAT_BUBBLE_ENTER_MS);

    return () => {
      window.clearTimeout(fadesUnlockTimerRef.current);
      fadesLockedRef.current = false;
    };
  }, [isTyping, messages]);

  useEffect(() => {
    writeMiniBeniChatSession({
      messages,
      nextId: messageIdRef.current,
    });
  }, [messages]);

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      return;
    }

    if (!wasOpenRef.current) {
      return;
    }

    wasOpenRef.current = false;
    abortReply(replyAbortRef);
    window.clearTimeout(fadesUnlockTimerRef.current);
    fadesLockedRef.current = false;
    resetMiniBeniReplyCues();
    setIsTyping(false);
    setValue("");
    setFades({ top: false, bottom: false });
  }, [open]);

  useEffect(() => {
    return () => {
      abortReply(replyAbortRef);
      window.clearTimeout(fadesUnlockTimerRef.current);
      resetMiniBeniReplyCues();
    };
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = value.trim().slice(0, BENI_MAX_USER_CHARS);

    if (!text) {
      return;
    }

    const userMessage: ChatMessage = {
      id: nextMessageId(),
      role: "user",
      text,
    };
    const nextMessages = [...messages, userMessage];

    abortReply(replyAbortRef);
    const controller = new AbortController();
    replyAbortRef.current = controller;

    setMessages(nextMessages);
    setIsTyping(true);
    setValue("");
    inputRef.current?.focus();

    const startedAt = Date.now();

    void (async () => {
      try {
        const reply = await requestBeniReply(nextMessages, controller.signal);
        const remaining = MINI_BENI_TYPING_REPLY_DELAY_MS - (Date.now() - startedAt);

        if (remaining > 0) {
          await waitWithSignal(remaining, controller.signal);
        }

        if (controller.signal.aborted) {
          return;
        }

        setIsTyping(false);
        await appendStaggeredBeniBubbles({
          text: reply,
          signal: controller.signal,
          nextMessageId,
          setMessages,
        });
      } catch (error) {
        if (isAbortError(error) || controller.signal.aborted) {
          return;
        }

        setIsTyping(false);
        await appendStaggeredBeniBubbles({
          text: BENI_FALLBACK_REPLY,
          signal: controller.signal,
          nextMessageId,
          setMessages,
        });
      } finally {
        if (replyAbortRef.current === controller) {
          replyAbortRef.current = null;
        }
      }
    })();
  };

  return (
    <Popover modal={false} onOpenChange={onOpenChange} open={open}>
      <PopoverAnchor virtualRef={anchorRef} />
      <PopoverContent
        align="center"
        aria-label="Ask Beni"
        avoidCollisions
        className="z-[110] w-56 gap-0 rounded-none border-0 bg-transparent p-0 shadow-none ring-0"
        collisionPadding={CHAT_COLLISION_PADDING}
        onCloseAutoFocus={onCloseAutoFocus}
        onFocusOutside={(event) => {
          if (isProtectedChatDismissTarget(event, anchorRef.current)) {
            event.preventDefault();
          }
        }}
        onInteractOutside={(event) => {
          if (isProtectedChatDismissTarget(event, anchorRef.current)) {
            event.preventDefault();
          }
        }}
        onPointerDownOutside={(event) => {
          if (isProtectedChatDismissTarget(event, anchorRef.current)) {
            event.preventDefault();
          }
        }}
        side={side}
        sideOffset={CHAT_SIDE_OFFSET}
        updatePositionStrategy="always"
      >
        {hasTranscript ? (
          <MiniBeniChatTranscript
            enterStyle={enterStyle}
            fades={fades}
            isTyping={isTyping}
            logRef={logRef}
            messages={messages}
            onScroll={updateFades}
            skipEnterIds={skipEnterIdsRef.current}
            typingStyle={typingStyle}
          />
        ) : null}
        <form onSubmit={handleSubmit}>
          <Input
            aria-label="Ask Beni"
            autoComplete="off"
            autoFocus
            button={<MiniBeniSendIcon />}
            buttonLabel="Send"
            buttonType="submit"
            className="border-border bg-popover text-foreground focus-visible:outline-focus-ring"
            id="mini-beni-chat-input"
            maxLength={BENI_MAX_USER_CHARS}
            name="mini-beni-chat"
            onChange={(event) => setValue(event.target.value)}
            placeholder="Ask Beni.."
            ref={inputRef}
            size="sm"
            type="text"
            value={value}
          />
        </form>
      </PopoverContent>
    </Popover>
  );
}
