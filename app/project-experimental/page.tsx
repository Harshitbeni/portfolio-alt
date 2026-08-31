import { Suspense } from "react";
import type { Metadata } from "next";
import { ProjectExperimentalPage } from "@/components/project-experimental/project-experimental-page";

export const metadata: Metadata = {
  title: "Project experimental",
  description: "Experimental project template",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ProjectExperimentalPage />
    </Suspense>
  );
}
