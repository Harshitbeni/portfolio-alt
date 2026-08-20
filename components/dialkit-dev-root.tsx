"use client";

import { DialRoot } from "dialkit";
import "dialkit/styles.css";

export function DialKitDevRoot() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <DialRoot position="top-right" />;
}
