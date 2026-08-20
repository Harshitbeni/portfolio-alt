import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <h1 className="text-sm font-medium">about</h1>
    </div>
  );
}
