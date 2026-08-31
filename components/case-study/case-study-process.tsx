import {
  CaseStudyImageMedia,
  CaseStudyVideoMedia,
} from "@/components/case-study/case-study-media";
import {
  CaseStudySection,
  caseStudyBodyClassName,
  caseStudyMutedClassName,
} from "@/components/case-study/case-study-shell";
import type { CaseStudy } from "@/lib/case-studies/types";

export function CaseStudyProcess({ study }: { study: CaseStudy }) {
  const { process } = study;

  return (
    <CaseStudySection label="Process" title={process.heading}>
      <div className="flex flex-col gap-10">
        <p className={caseStudyBodyClassName}>{process.intro}</p>

        <div className="flex flex-col gap-10">
          {process.pillars.map((pillar) => (
            <div key={pillar.title} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-md-medium text-gray-a12">{pillar.title}</h3>
                <p className={caseStudyBodyClassName}>{pillar.description}</p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-3">
                {pillar.features.map((feature) => (
                  <li key={feature.title} className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-a12">
                      {feature.title}
                    </span>
                    <span className={caseStudyMutedClassName}>
                      – {feature.description}
                    </span>
                  </li>
                ))}
              </ul>
              {pillar.images?.map((image) => (
                <CaseStudyImageMedia key={image.src} image={image} />
              ))}
            </div>
          ))}
        </div>

        <p className={caseStudyBodyClassName}>{process.prototypeNote}</p>
        <p className="text-md-medium text-gray-a12">{process.betaNote}</p>

        <div className="flex flex-col gap-4">
          {process.images.map((image) => (
            <CaseStudyImageMedia key={image.src} image={image} />
          ))}
        </div>
      </div>
    </CaseStudySection>
  );
}

export function CaseStudyBuildingInPublic({ study }: { study: CaseStudy }) {
  const { buildingInPublic } = study;

  return (
    <CaseStudySection label="Building in Public" title={buildingInPublic.heading}>
      <div className="flex flex-col gap-6">
        {buildingInPublic.paragraphs.map((paragraph) => (
          <p key={paragraph} className={caseStudyBodyClassName}>
            {paragraph}
          </p>
        ))}
        <CaseStudyVideoMedia video={buildingInPublic.video} />
      </div>
    </CaseStudySection>
  );
}
