"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ProjectExperimentalLayoutSwitcher,
  type ProjectExperimentalLayout,
} from "@/components/project-experimental/project-experimental-layout-switcher";
import { ProjectExperimentalSplit } from "@/components/project-experimental/project-experimental-split";
import { ProjectExperimentalStack } from "@/components/project-experimental/project-experimental-stack";

function layoutFromParam(value: string | null): ProjectExperimentalLayout {
  return value === "stack" ? "stack" : "split";
}

export function ProjectExperimentalPage() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const layout = layoutFromParam(searchParams.get("layout"));

  const setLayout = useCallback(
    (next: ProjectExperimentalLayout) => {
      if (next === layout) return;

      const params = new URLSearchParams(searchParams.toString());
      params.set("layout", next);
      const query = params.toString();
      const hash = window.location.hash;
      router.replace(`${pathname}?${query}${hash}`, { scroll: false });
    },
    [layout, pathname, router, searchParams],
  );

  return (
    <>
      {layout === "stack" ? (
        <ProjectExperimentalStack />
      ) : (
        <ProjectExperimentalSplit />
      )}
      <ProjectExperimentalLayoutSwitcher
        layout={layout}
        onLayoutChange={setLayout}
      />
    </>
  );
}
