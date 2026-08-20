import {
  type Dispatch,
  type RefObject,
  type SetStateAction,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";

import {
  findProfileRecords,
  type Position,
  type ProfileRecord,
} from "./reveal-core";
import {
  type ProfileRevealResult,
  useProfileRevealBridge,
} from "./profile-reveal-bridge";

export type EmbeddedProfileRefs = {
  circleRef: RefObject<HTMLElement | null>;
  linkRef: RefObject<HTMLElement | null>;
  textRef: RefObject<HTMLElement | null>;
  imageRef?: RefObject<HTMLImageElement | null>;
};

type UseMiniBeniProfileRevealOptions = {
  petRef: { readonly current: HTMLElement | null };
  petWidth: number;
  reducedMotion: boolean;
  setPosition: Dispatch<SetStateAction<Position>>;
  embeddedProfile?: EmbeddedProfileRefs;
};

function buildEmbeddedRecord(refs: EmbeddedProfileRefs): ProfileRecord | null {
  const circle = refs.circleRef.current;
  const link = refs.linkRef.current;
  const text = refs.textRef.current;

  if (!circle || !link || !text) {
    return null;
  }

  const image =
    refs.imageRef?.current ?? circle.querySelector("img") ?? circle;

  return { image, circle, link, text };
}

export function useMiniBeniProfileReveal({
  petRef,
  petWidth,
  reducedMotion,
  setPosition,
  embeddedProfile,
}: UseMiniBeniProfileRevealOptions): ProfileRevealResult {
  const globalRecords = useMemo(
    () => (embeddedProfile ? [] : findProfileRecords()),
    [embeddedProfile],
  );
  const [embeddedRecords, setEmbeddedRecords] = useState<ProfileRecord[]>([]);

  useLayoutEffect(() => {
    if (!embeddedProfile) {
      setEmbeddedRecords([]);
      return;
    }

    const record = buildEmbeddedRecord(embeddedProfile);
    setEmbeddedRecords(record ? [record] : []);
  }, [embeddedProfile]);

  const records = embeddedProfile ? embeddedRecords : globalRecords;

  return useProfileRevealBridge(records, {
    petRef,
    petWidth,
    reducedMotion,
    setPosition,
    listenForDialkit: false,
  });
}
