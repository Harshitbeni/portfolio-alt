"use client";

import {
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import "./mini-beni.css";
import {
  CURSOR_SETTLE_MS,
  getLookFrame,
  getRestingAnimationState,
  type LookFrame,
  shouldWaveAfterIdleLoop,
} from "./animation-core";
import { MiniBeniChatInput, MiniBeniMenu } from "./mini-beni-menu";
import {
  clampPosition,
  DEFAULT_REVEAL_SETTINGS,
  type Position,
} from "./reveal-core";
import {
  useMiniBeniProfileReveal,
  type EmbeddedProfileRefs,
} from "./use-mini-beni-profile-reveal";

const ATLAS_COLUMNS = 8;
const ATLAS_ROWS = 11;
const CELL_WIDTH = 192;
const CELL_HEIGHT = 208;
const DIRECTION_THRESHOLD = 3;
const CLICK_MOVE_THRESHOLD = 5;

type AnimationState =
  | "idle"
  | "running-left"
  | "running-right"
  | "waving"
  | "reviewing"
  | "looking";

type DragAnimationState = "running-left" | "running-right";

type DragState = {
  pointerId: number;
  grabOffsetX: number;
  grabOffsetY: number;
  lastClientX: number;
  startClientX: number;
  startClientY: number;
  direction: DragAnimationState | null;
  moved: boolean;
};

type MiniBeniStyle = CSSProperties & {
  "--mini-beni-height": string;
  "--mini-beni-width": string;
  "--mini-beni-x": string;
  "--mini-beni-y": string;
  "--mini-beni-frame-x": string;
  "--mini-beni-frame-y": string;
  "--mini-beni-sprite": string;
  "--mini-beni-profile-fade-ms": string;
  "--mini-beni-pet-fade-ms": string;
  "--mini-beni-fade-gap-ms": string;
  "--mini-beni-text-move-ms": string;
};

export type { EmbeddedProfileRefs } from "./use-mini-beni-profile-reveal";

export type MiniBeniProps = {
  spriteSrc?: string;
  embeddedProfile?: EmbeddedProfileRefs;
};

const ANIMATIONS: Record<
  Exclude<AnimationState, "looking">,
  { row: number; frameCount: number; frameDuration: number }
> = {
  idle: { row: 0, frameCount: 6, frameDuration: 180 },
  "running-right": { row: 1, frameCount: 8, frameDuration: 130 },
  "running-left": { row: 2, frameCount: 8, frameDuration: 130 },
  waving: { row: 3, frameCount: 4, frameDuration: 160 },
  reviewing: { row: 8, frameCount: 6, frameDuration: 180 },
};

const DEFAULT_LOOK_FRAME: LookFrame = {
  row: 9,
  frame: 0,
  directionDegrees: 0,
};

function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(query.matches);

    updatePreference();
    query.addEventListener("change", updatePreference);

    return () => query.removeEventListener("change", updatePreference);
  }, []);

  return reducedMotion;
}

export function MiniBeni({
  spriteSrc = "/mini-beni/spritesheet.webp",
  embeddedProfile,
}: MiniBeniProps) {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [animationState, setAnimationState] =
    useState<AnimationState>("idle");
  const [lastDragDirection, setLastDragDirection] = useState<
    DragAnimationState | "none"
  >("none");
  const [lookFrame, setLookFrame] =
    useState<LookFrame>(DEFAULT_LOOK_FRAME);
  const [frame, setFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 });
  const [chatOpen, setChatOpen] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const dragState = useRef<DragState | null>(null);
  const petElement = useRef<HTMLButtonElement | null>(null);
  const animationStateRef = useRef<AnimationState>("idle");
  const frameRef = useRef(0);
  const completedIdleLoopsRef = useRef(0);
  const hasBootWavedRef = useRef(false);
  const gazeActiveRef = useRef(false);
  const hoveringRef = useRef(false);
  const cursorSettleTimerRef = useRef<number | null>(null);
  const suppressClickRef = useRef(false);
  const skipPetFocusRef = useRef(false);
  const pendingChatOpenTimerRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const defaultPetWidth =
    (DEFAULT_REVEAL_SETTINGS.petHeight * CELL_WIDTH) / CELL_HEIGHT;
  const { revealState, revealSettings, dockPet } = useMiniBeniProfileReveal({
    petRef: petElement,
    petWidth: defaultPetWidth,
    reducedMotion,
    setPosition,
    embeddedProfile,
  });
  const revealStateRef = useRef(revealState);
  const chatOpenRef = useRef(chatOpen);

  useEffect(() => {
    setContainer(document.body);
  }, []);

  useEffect(() => {
    revealStateRef.current = revealState;
  }, [revealState]);

  useEffect(() => {
    chatOpenRef.current = chatOpen;
  }, [chatOpen]);

  useEffect(() => {
    return () => {
      if (pendingChatOpenTimerRef.current !== null) {
        window.clearTimeout(pendingChatOpenTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (revealState !== "docked") {
      return;
    }

    hasBootWavedRef.current = false;
    if (pendingChatOpenTimerRef.current !== null) {
      window.clearTimeout(pendingChatOpenTimerRef.current);
      pendingChatOpenTimerRef.current = null;
    }
    setMenuOpen(false);
    setChatOpen(false);
  }, [revealState]);

  const height = revealSettings.petHeight;
  const width = (height * CELL_WIDTH) / CELL_HEIGHT;
  const animation =
    animationState === "looking"
      ? { row: lookFrame.row, frameCount: 1, frameDuration: 0 }
      : ANIMATIONS[animationState];
  const displayedFrame = animationState === "looking" ? lookFrame.frame : frame;

  useEffect(() => {
    animationStateRef.current = animationState;
  }, [animationState]);

  const changeAnimation = useCallback((nextState: AnimationState) => {
    if (animationStateRef.current === nextState) {
      return;
    }

    animationStateRef.current = nextState;
    frameRef.current = 0;
    setFrame(0);
    setAnimationState(nextState);
  }, []);

  const clearCursorSettleTimer = useCallback(() => {
    if (cursorSettleTimerRef.current !== null) {
      window.clearTimeout(cursorSettleTimerRef.current);
      cursorSettleTimerRef.current = null;
    }
  }, []);

  const finishWave = useCallback(() => {
    if (dragState.current) {
      return;
    }

    changeAnimation(
      getRestingAnimationState({
        hovering: hoveringRef.current,
        gazeActive: gazeActiveRef.current,
      }),
    );
  }, [changeAnimation]);

  useEffect(() => {
    if (revealState !== "free" || animationState === "looking") {
      return;
    }

    if (reducedMotion) {
      if (animationState === "waving") {
        const waveTimer = window.setTimeout(
          finishWave,
          ANIMATIONS.waving.frameCount * ANIMATIONS.waving.frameDuration,
        );
        return () => window.clearTimeout(waveTimer);
      }

      return;
    }

    const interval = window.setInterval(() => {
      const nextFrame = frameRef.current + 1;

      if (animationState === "waving" && nextFrame >= animation.frameCount) {
        window.clearInterval(interval);
        finishWave();
        return;
      }

      const wrappedFrame = nextFrame % animation.frameCount;
      frameRef.current = wrappedFrame;
      setFrame(wrappedFrame);

      if (animationState === "idle" && wrappedFrame === 0) {
        completedIdleLoopsRef.current += 1;

        if (shouldWaveAfterIdleLoop(completedIdleLoopsRef.current)) {
          completedIdleLoopsRef.current = 0;
          changeAnimation("waving");
        }
      }
    }, animation.frameDuration);

    return () => window.clearInterval(interval);
  }, [animation.frameCount, animation.frameDuration, animationState, changeAnimation, finishWave, reducedMotion, revealState]);

  useEffect(() => {
    if (revealState !== "free" || hasBootWavedRef.current) {
      return;
    }

    hasBootWavedRef.current = true;
    completedIdleLoopsRef.current = 0;
    changeAnimation("waving");
  }, [changeAnimation, revealState]);

  useEffect(() => {
    if (revealState !== "free") {
      return;
    }

    const followCursor = (event: PointerEvent) => {
      if (dragState.current) {
        return;
      }

      if (hoveringRef.current) {
        gazeActiveRef.current = false;
        clearCursorSettleTimer();

        if (animationStateRef.current !== "waving") {
          changeAnimation("reviewing");
        }
        return;
      }

      const nextLookFrame = getLookFrame(position, width, height, {
        x: event.clientX,
        y: event.clientY,
      });

      if (!nextLookFrame) {
        return;
      }

      gazeActiveRef.current = true;
      setLookFrame(nextLookFrame);

      if (animationStateRef.current !== "waving") {
        changeAnimation("looking");
      }

      clearCursorSettleTimer();
      cursorSettleTimerRef.current = window.setTimeout(() => {
        cursorSettleTimerRef.current = null;
        gazeActiveRef.current = false;

        if (!dragState.current && animationStateRef.current === "looking") {
          changeAnimation("idle");
        }
      }, CURSOR_SETTLE_MS);
    };

    window.addEventListener("pointermove", followCursor, { passive: true });

    return () => {
      window.removeEventListener("pointermove", followCursor);
      gazeActiveRef.current = false;
      clearCursorSettleTimer();
    };
  }, [changeAnimation, clearCursorSettleTimer, height, position, revealState, width]);

  const openMenuAt = useCallback((x: number, y: number) => {
    if (revealStateRef.current !== "free") {
      return;
    }

    setMenuAnchor({ x, y });
    setMenuOpen(true);
  }, []);

  const finishDrag = useCallback((
    event: { pointerId: number; clientX: number; clientY: number },
    allowClick = false,
  ) => {
    const drag = dragState.current;

    if (drag?.pointerId !== event.pointerId) {
      return;
    }

    const wasClick = !drag.moved;
    dragState.current = null;
    gazeActiveRef.current = false;
    clearCursorSettleTimer();
    setIsDragging(false);
    changeAnimation(
      getRestingAnimationState({
        hovering: hoveringRef.current,
        gazeActive: false,
      }),
    );

    if (petElement.current?.hasPointerCapture(event.pointerId)) {
      petElement.current.releasePointerCapture(event.pointerId);
    }

    suppressClickRef.current = true;
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);

    if (wasClick && allowClick) {
      openMenuAt(event.clientX, event.clientY);
    }
  }, [changeAnimation, clearCursorSettleTimer, openMenuAt]);

  useEffect(() => {
    const moveDrag = (event: PointerEvent) => {
      const drag = dragState.current;

      if (!drag || drag.pointerId !== event.pointerId) {
        return;
      }

      if (!drag.moved) {
        const distance = Math.hypot(
          event.clientX - drag.startClientX,
          event.clientY - drag.startClientY,
        );

        if (distance < CLICK_MOVE_THRESHOLD) {
          return;
        }

        drag.moved = true;
        setIsDragging(true);
      }

      event.preventDefault();
      const horizontalMovement = event.clientX - drag.lastClientX;
      drag.lastClientX = event.clientX;

      if (Math.abs(horizontalMovement) >= DIRECTION_THRESHOLD) {
        const nextDirection =
          horizontalMovement > 0 ? "running-right" : "running-left";

        if (drag.direction !== nextDirection) {
          drag.direction = nextDirection;
          setLastDragDirection(nextDirection);
          changeAnimation(nextDirection);
        }
      }

      setPosition(
        clampPosition(
          {
            x: event.clientX - drag.grabOffsetX,
            y: event.clientY - drag.grabOffsetY,
          },
          width,
          height,
        ),
      );
    };

    const stopDrag = (event: PointerEvent) => {
      finishDrag(event, event.type === "pointerup");
    };

    window.addEventListener("pointermove", moveDrag, { passive: false });
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("pointercancel", stopDrag);

    return () => {
      window.removeEventListener("pointermove", moveDrag);
      window.removeEventListener("pointerup", stopDrag);
      window.removeEventListener("pointercancel", stopDrag);
    };
  }, [changeAnimation, finishDrag, height, width]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (revealState !== "free" || dragState.current) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    gazeActiveRef.current = false;
    clearCursorSettleTimer();
    changeAnimation("idle");
    event.currentTarget.setPointerCapture(event.pointerId);
    dragState.current = {
      pointerId: event.pointerId,
      grabOffsetX: event.clientX - position.x,
      grabOffsetY: event.clientY - position.y,
      lastClientX: event.clientX,
      startClientX: event.clientX,
      startClientY: event.clientY,
      direction: null,
      moved: false,
    };
  };

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      event.preventDefault();
      return;
    }

    if (revealState !== "free") {
      return;
    }

    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    openMenuAt(rect.left + rect.width / 2, rect.bottom);
  };

  const handleContextMenu = (event: ReactMouseEvent<HTMLButtonElement>) => {
    if (revealState !== "free") {
      return;
    }

    event.preventDefault();
    openMenuAt(event.clientX, event.clientY);
  };

  const handleMenuCloseAutoFocus = (event: Event) => {
    event.preventDefault();

    if (skipPetFocusRef.current) {
      skipPetFocusRef.current = false;
      return;
    }

    petElement.current?.focus();
  };

  const handleClosePet = () => {
    skipPetFocusRef.current = true;
    setMenuOpen(false);
    petElement.current?.blur();
    dockPet();
  };

  const handleChat = () => {
    skipPetFocusRef.current = true;
    setMenuOpen(false);

    if (chatOpenRef.current) {
      if (pendingChatOpenTimerRef.current !== null) {
        window.clearTimeout(pendingChatOpenTimerRef.current);
        pendingChatOpenTimerRef.current = null;
      }
      setChatOpen(false);
      return;
    }

    if (pendingChatOpenTimerRef.current !== null) {
      window.clearTimeout(pendingChatOpenTimerRef.current);
    }

    // Open after the menu's pointer event finishes so the popover isn't
    // dismissed as an outside click.
    pendingChatOpenTimerRef.current = window.setTimeout(() => {
      pendingChatOpenTimerRef.current = null;
      if (revealStateRef.current === "free") {
        setChatOpen(true);
      }
    }, 0);
  };

  const handleChatCloseAutoFocus = (event: Event) => {
    event.preventDefault();

    if (revealStateRef.current === "free") {
      petElement.current?.focus();
    }
  };

  const handlePointerEnter = () => {
    hoveringRef.current = true;

    if (revealState !== "free" || dragState.current) {
      return;
    }

    gazeActiveRef.current = false;
    clearCursorSettleTimer();

    if (animationStateRef.current !== "waving") {
      changeAnimation("reviewing");
    }
  };

  const handlePointerLeave = () => {
    hoveringRef.current = false;

    if (revealState !== "free" || dragState.current) {
      return;
    }

    changeAnimation(
      getRestingAnimationState({
        hovering: false,
        gazeActive: gazeActiveRef.current,
      }),
    );
  };

  const style = useMemo<MiniBeniStyle>(
    () => ({
      "--mini-beni-height": `${height}px`,
      "--mini-beni-width": `${width}px`,
      "--mini-beni-x": `${position.x}px`,
      "--mini-beni-y": `${position.y}px`,
      "--mini-beni-frame-x": `${(displayedFrame / (ATLAS_COLUMNS - 1)) * 100}%`,
      "--mini-beni-frame-y": `${(animation.row / (ATLAS_ROWS - 1)) * 100}%`,
      "--mini-beni-sprite": `url("${spriteSrc}")`,
      "--mini-beni-profile-fade-ms": `${revealSettings.profileFadeMs}ms`,
      "--mini-beni-pet-fade-ms": `${revealSettings.petFadeMs}ms`,
      "--mini-beni-fade-gap-ms": `${revealSettings.fadeGapMs}ms`,
      "--mini-beni-text-move-ms": `${revealSettings.textMoveMs}ms`,
    }),
    [animation.row, displayedFrame, height, position.x, position.y, revealSettings, spriteSrc, width],
  );

  if (!container) {
    return null;
  }

  return createPortal(
    <>
      <button
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-hidden={revealState !== "free"}
        aria-label="Mini Beni. Drag to move, or open the menu."
        className="mini-beni"
        data-dragging={isDragging ? "true" : "false"}
        data-frame={displayedFrame}
        data-last-direction={lastDragDirection}
        data-look-direction={animationState === "looking" ? lookFrame.directionDegrees : undefined}
        data-reveal-state={revealState}
        data-state={animationState}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onLostPointerCapture={finishDrag}
        onPointerDown={handlePointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        ref={petElement}
        style={style}
        tabIndex={revealState === "free" ? 0 : -1}
        type="button"
      />
      <MiniBeniMenu
        anchor={menuAnchor}
        chatOpen={chatOpen}
        onChat={handleChat}
        onCloseAutoFocus={handleMenuCloseAutoFocus}
        onClosePet={handleClosePet}
        onOpenChange={setMenuOpen}
        open={menuOpen}
      />
      <MiniBeniChatInput
        anchorRef={petElement}
        onCloseAutoFocus={handleChatCloseAutoFocus}
        onOpenChange={setChatOpen}
        open={chatOpen}
      />
    </>,
    container
  );
}
