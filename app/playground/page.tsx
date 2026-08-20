import type { Metadata } from "next";
import { Playground } from "./playground-client";

export const metadata: Metadata = {
  title: "Playground",
  description: "Live token and component playground",
};

export default function PlaygroundPage() {
  return <Playground />;
}
