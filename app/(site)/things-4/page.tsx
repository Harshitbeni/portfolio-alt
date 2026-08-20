import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Things 4",
};

export default function Things4Page() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      <h1 className="text-sm font-medium">Things 4</h1>
    </div>
  );
}
