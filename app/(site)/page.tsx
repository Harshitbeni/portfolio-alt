import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <div className="flex min-h-[70vh] flex-1 items-center justify-center p-8">
        <Button asChild variant="outline">
          <Link href="/playground">Playground</Link>
        </Button>
      </div>
      <section id="work" className="min-h-screen scroll-mt-20 bg-muted px-8 py-16">
        <h1 className="text-sm font-medium">work</h1>
        <Button asChild variant="ghost" rounded={9999} className="mt-4 font-normal">
          <Link href="/things-4">Things 4</Link>
        </Button>
      </section>
    </>
  );
}
