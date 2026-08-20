import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play",
};

export default function PlayPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <h1 className="text-sm font-medium">play</h1>
    </div>
  );
}
