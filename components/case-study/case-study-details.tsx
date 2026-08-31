import type { ReactNode } from "react";
import {
  CaseStudySection,
  caseStudyBodyClassName,
  caseStudyLinkClassName,
  caseStudyMutedClassName,
} from "@/components/case-study/case-study-shell";
import type { CaseStudy } from "@/lib/case-studies/types";

function MetaField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs text-gray-a10">{label}</p>
      {children}
    </div>
  );
}

export function CaseStudyDetails({ study }: { study: CaseStudy }) {
  return (
    <CaseStudySection label="Details">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-md-medium text-gray-a12">{study.gap.heading}</h3>
          {study.gap.paragraphs.map((paragraph) => (
            <p key={paragraph} className={caseStudyBodyClassName}>
              {paragraph}
            </p>
          ))}
        </div>

        <MetaField label="What was my role?">
          <p className={caseStudyBodyClassName}>{study.role}</p>
        </MetaField>

        <MetaField label="Team">
          <ul className="flex flex-col gap-3">
            {study.team.map((member) => (
              <li key={member.name} className="flex flex-wrap items-baseline gap-x-1">
                <span className="text-md-medium text-gray-a12">{member.name}</span>
                <span className={caseStudyMutedClassName}>, {member.role}</span>
              </li>
            ))}
          </ul>
        </MetaField>

        {study.links && study.links.length > 0 ? (
          <MetaField label="Links">
            <div className="flex flex-col gap-2">
              {study.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={caseStudyLinkClassName}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </MetaField>
        ) : null}

        <MetaField label="Timeline">
          <p className="text-sm text-gray-a12">{study.timeline}</p>
        </MetaField>

        <MetaField label="Goals">
          <p className={caseStudyBodyClassName}>{study.goalsStatement}</p>
        </MetaField>
      </div>
    </CaseStudySection>
  );
}
