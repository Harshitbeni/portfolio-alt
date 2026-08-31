"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useIcon } from "@/lib/icon-context";

export function CaseStudyHomeButton() {
  const ArrowLeft = useIcon("arrow-left");

  return (
    <Button variant="ghost" asChild className="-ms-2.5 self-start font-normal">
      <Link href="/?tab=work">
        <ArrowLeft />
        Home
      </Link>
    </Button>
  );
}
