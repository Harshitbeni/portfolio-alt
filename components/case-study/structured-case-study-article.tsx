import type { CaseStudy } from "@/lib/case-studies/types";
import { CaseStudyBuildingInPublic, CaseStudyProcess } from "@/components/case-study/case-study-process";
import { CaseStudyDetails } from "@/components/case-study/case-study-details";
import { CaseStudyGoals } from "@/components/case-study/case-study-goals";
import { CaseStudyResearch } from "@/components/case-study/case-study-research";
import { CaseStudyResults } from "@/components/case-study/case-study-results";
import { CaseStudySolution } from "@/components/case-study/case-study-solution";
import { CaseStudyShell } from "@/components/case-study/case-study-shell";

export function StructuredCaseStudyArticle({ study }: { study: CaseStudy }) {
  return (
    <CaseStudyShell study={study}>
      <CaseStudyDetails study={study} />
      <CaseStudyGoals study={study} />
      <CaseStudyResearch study={study} />
      <CaseStudyProcess study={study} />
      <CaseStudyBuildingInPublic study={study} />
      <CaseStudySolution study={study} />
      <CaseStudyResults study={study} />
    </CaseStudyShell>
  );
}
