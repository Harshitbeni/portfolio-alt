import {
  CaseStudySection,
  caseStudyBodyClassName,
} from "@/components/case-study/case-study-shell";
import type { CaseStudy } from "@/lib/case-studies/types";

export function CaseStudyGoals({ study }: { study: CaseStudy }) {
  return (
    <CaseStudySection label="Goals">
      <ol className="flex flex-col gap-5">
        {study.goals.map((goal) => (
          <li key={goal.number} className="flex gap-3">
            <span
              aria-hidden
              className="w-5 shrink-0 text-md-medium text-gray-a12"
            >
              {goal.number}
            </span>
            <p className={caseStudyBodyClassName}>{goal.question}</p>
          </li>
        ))}
      </ol>
    </CaseStudySection>
  );
}
