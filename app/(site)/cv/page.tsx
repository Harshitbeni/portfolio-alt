import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
};

export default function CvPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <h1 className="text-sm font-medium">resume</h1>
    </div>
  );
}
