import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  clampPosition,
  completeRevealState,
  DEFAULT_REVEAL_SETTINGS,
  dockRevealState,
  getInitialPosition,
  getRevealDurationMs,
  getViewportBounds,
  isRevealSettings,
  nextRevealState,
  type Position,
  type ProfileRecord,
  REQUEST_REVEAL_SETTINGS_EVENT,
  REVEAL_SETTINGS_EVENT,
  type RevealSettings,
  type RevealState,
} from "./reveal-core";

type ProfileStyle = CSSStyleDeclaration & {
  setProperty(property: string, value: string): void;
};

export function writeRevealSettings(
  records: ProfileRecord[],
  settings: RevealSettings,
) {
  for (const { link } of records) {
    const style = link.style as ProfileStyle;
    style.setProperty(
      "--mini-beni-profile-fade-ms",
      `${settings.profileFadeMs}ms`,
    );
    style.setProperty("--mini-beni-pet-fade-ms", `${settings.petFadeMs}ms`);
    style.setProperty("--mini-beni-fade-gap-ms", `${settings.fadeGapMs}ms`);
    style.setProperty("--mini-beni-text-move-ms", `${settings.textMoveMs}ms`);
  }
}

export function markProfileRecords(
  records: ProfileRecord[],
  settings: RevealSettings,
) {
  for (const { circle, link, text } of records) {
    circle.setAttribute("data-mini-beni-profile-circle", "");
    link.setAttribute("data-mini-beni-profile-link", "");
    text.setAttribute("data-mini-beni-profile-text", "");
    link.setAttribute("data-mini-beni-reveal", "docked");
  }

  writeRevealSettings(records, settings);
}

export function setProfileRecordState(
  records: ProfileRecord[],
  state: RevealState,
) {
  for (const { circle, link } of records) {
    link.setAttribute("data-mini-beni-reveal", state);

    if (state === "docked") {
      circle.removeAttribute("aria-disabled");
      circle.removeAttribute("tabindex");
    } else {
      circle.setAttribute("aria-disabled", "true");
      circle.setAttribute("tabindex", "-1");
    }
  }
}

function hasVisibleRect(element: HTMLElement): boolean {
  return element.getClientRects().length > 0;
}

function isModifiedClick(event: MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function shouldIgnoreRevealClick(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return false;
  }

  return Boolean(
    target.closest("[data-nav-card-panel]") ||
      target.closest("[data-nav-card-expand]"),
  );
}

export type ProfileRevealBridgeOptions = {
  petRef: { readonly current: HTMLElement | null };
  petWidth: number;
  reducedMotion: boolean;
  setPosition: Dispatch<SetStateAction<Position>>;
  listenForDialkit?: boolean;
};

export type ProfileRevealResult = {
  revealState: RevealState;
  revealSettings: RevealSettings;
  dockPet: () => void;
};

export function useProfileRevealBridge(
  records: ProfileRecord[],
  {
    petRef,
    petWidth,
    reducedMotion,
    setPosition,
    listenForDialkit = false,
  }: ProfileRevealBridgeOptions,
): ProfileRevealResult {
  const [revealState, setRevealState] = useState<RevealState>("docked");
  const [revealSettings, setRevealSettings] = useState<RevealSettings>(
    DEFAULT_REVEAL_SETTINGS,
  );
  const recordsRef = useRef<ProfileRecord[]>(records);
  const activeCircleRef = useRef<HTMLElement | null>(null);
  const activatedByKeyboardRef = useRef(false);
  const completionTimerRef = useRef<number | null>(null);
  const stateRef = useRef<RevealState>("docked");
  const settingsRef = useRef<RevealSettings>(DEFAULT_REVEAL_SETTINGS);
  const reducedMotionRef = useRef(reducedMotion);

  useEffect(() => {
    recordsRef.current = records;
  }, [records]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  const getCurrentPetWidth = useCallback(
    (settings: RevealSettings) =>
      (petWidth * settings.petHeight) / DEFAULT_REVEAL_SETTINGS.petHeight,
    [petWidth],
  );

  const placeAtCircle = useCallback(
    (circle: HTMLElement, settings: RevealSettings) => {
      if (!hasVisibleRect(circle)) {
        return false;
      }

      const rect = circle.getBoundingClientRect();
      const width = getCurrentPetWidth(settings);
      setPosition(
        getInitialPosition(
          rect,
          width,
          settings.petHeight,
          {
            x: settings.initialOffsetX,
            y: settings.initialOffsetY,
          },
        ),
      );
      return true;
    },
    [getCurrentPetWidth, setPosition],
  );

  const finishReveal = useCallback(() => {
    if (stateRef.current !== "revealing") {
      return;
    }

    if (completionTimerRef.current !== null) {
      window.clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }

    stateRef.current = completeRevealState(stateRef.current);
    setProfileRecordState(recordsRef.current, stateRef.current);
    setRevealState(stateRef.current);

    if (activatedByKeyboardRef.current) {
      window.requestAnimationFrame(() => petRef.current?.focus());
    }
  }, [petRef]);

  useEffect(() => {
    if (records.length === 0) {
      return;
    }

    markProfileRecords(records, settingsRef.current);

    const activate = (event: MouseEvent) => {
      const current = event.currentTarget as HTMLElement;
      const record = recordsRef.current.find((item) => item.link === current);

      if (!record || shouldIgnoreRevealClick(event.target)) {
        return;
      }

      if (stateRef.current !== "docked") {
        if (event.target instanceof Node && record.circle.contains(event.target)) {
          event.preventDefault();
        }
        return;
      }

      if (isModifiedClick(event) || !hasVisibleRect(record.circle)) {
        return;
      }

      event.preventDefault();
      const nextState = nextRevealState(stateRef.current, true);

      if (nextState !== "revealing") {
        return;
      }

      activeCircleRef.current = record.circle;
      activatedByKeyboardRef.current = event.detail === 0;
      placeAtCircle(record.circle, settingsRef.current);
      stateRef.current = nextState;
      setProfileRecordState(recordsRef.current, nextState);
      setRevealState(nextState);

      if (reducedMotionRef.current) {
        window.requestAnimationFrame(finishReveal);
        return;
      }

      completionTimerRef.current = window.setTimeout(
        finishReveal,
        getRevealDurationMs(settingsRef.current),
      );
    };

    for (const { link } of records) {
      link.addEventListener("click", activate);
    }

    return () => {
      for (const { link } of records) {
        link.removeEventListener("click", activate);
      }

      if (completionTimerRef.current !== null) {
        window.clearTimeout(completionTimerRef.current);
      }
    };
  }, [finishReveal, placeAtCircle, records]);

  useEffect(() => {
    if (!listenForDialkit) {
      return;
    }

    const receiveSettings = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;

      if (!isRevealSettings(detail)) {
        return;
      }

      settingsRef.current = detail;
      setRevealSettings(detail);
      writeRevealSettings(recordsRef.current, detail);

      if (
        stateRef.current === "revealing" &&
        activeCircleRef.current &&
        placeAtCircle(activeCircleRef.current, detail)
      ) {
        return;
      }

      setPosition((currentPosition) =>
        clampPosition(
          currentPosition,
          getCurrentPetWidth(detail),
          detail.petHeight,
        ),
      );
    };

    window.addEventListener(REVEAL_SETTINGS_EVENT, receiveSettings);
    window.dispatchEvent(new Event(REQUEST_REVEAL_SETTINGS_EVENT));

    return () =>
      window.removeEventListener(REVEAL_SETTINGS_EVENT, receiveSettings);
  }, [getCurrentPetWidth, listenForDialkit, placeAtCircle, setPosition]);

  useEffect(() => {
    if (reducedMotion && stateRef.current === "revealing") {
      finishReveal();
    }
  }, [finishReveal, reducedMotion]);

  useEffect(() => {
    const keepInsideViewport = () => {
      const settings = settingsRef.current;

      if (
        stateRef.current === "revealing" &&
        activeCircleRef.current &&
        placeAtCircle(activeCircleRef.current, settings)
      ) {
        return;
      }

      if (stateRef.current !== "docked") {
        setPosition((currentPosition) =>
          clampPosition(
            currentPosition,
            getCurrentPetWidth(settings),
            settings.petHeight,
            getViewportBounds(),
          ),
        );
      }
    };

    window.addEventListener("resize", keepInsideViewport);
    window.visualViewport?.addEventListener("resize", keepInsideViewport);
    window.visualViewport?.addEventListener("scroll", keepInsideViewport);

    return () => {
      window.removeEventListener("resize", keepInsideViewport);
      window.visualViewport?.removeEventListener("resize", keepInsideViewport);
      window.visualViewport?.removeEventListener("scroll", keepInsideViewport);
    };
  }, [getCurrentPetWidth, placeAtCircle, setPosition]);

  const dockPet = useCallback(() => {
    const nextState = dockRevealState(stateRef.current);

    if (nextState === stateRef.current) {
      return;
    }

    if (completionTimerRef.current !== null) {
      window.clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }

    activeCircleRef.current = null;
    activatedByKeyboardRef.current = false;
    stateRef.current = nextState;
    setProfileRecordState(recordsRef.current, nextState);
    setRevealState(nextState);
  }, []);

  return { revealState, revealSettings, dockPet };
}
