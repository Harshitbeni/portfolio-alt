import "server-only";

import type { BlockCaseStudy } from "@/lib/case-studies/block-types";
import { privadoAssessments } from "@/lib/case-studies/privado-assessments";
import { privadoMobileAppScan } from "@/lib/case-studies/privado-mobile-app-scan";
import type { CaseStudy } from "@/lib/case-studies/types";
import { thursdayCaseStudy } from "@/lib/case-studies/thursday";

type StructuredCaseStudyEntry = {
  format: "structured";
  study: CaseStudy;
};

type BlockCaseStudyEntry = {
  format: "blocks";
  study: BlockCaseStudy;
};

export type CaseStudyEntry = StructuredCaseStudyEntry | BlockCaseStudyEntry;

const CASE_STUDIES: Record<string, CaseStudyEntry> = {
  thursday: { format: "structured", study: thursdayCaseStudy },
  "privado-mobile-app-scan": { format: "blocks", study: privadoMobileAppScan },
  "privado-assessments": { format: "blocks", study: privadoAssessments },
};

export function getCaseStudySlugs(): string[] {
  return Object.keys(CASE_STUDIES);
}

export function getCaseStudy(slug: string): CaseStudyEntry | undefined {
  return CASE_STUDIES[slug];
}

export { thursdayCaseStudy, privadoAssessments, privadoMobileAppScan };
