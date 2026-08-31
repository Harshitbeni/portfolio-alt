import { CaseStudyImageMedia } from "@/components/case-study/case-study-media";
import {
  CaseStudySection,
  caseStudyBodyClassName,
  caseStudyMutedClassName,
} from "@/components/case-study/case-study-shell";
import type { CaseStudy, CaseStudyImage } from "@/lib/case-studies/types";
import { cn } from "@/lib/utils";

const STAT_COLORS = ["text-green-11", "text-blue-11"] as const;

export function CaseStudyResults({ study }: { study: CaseStudy }) {
  const { results } = study;

  return (
    <CaseStudySection label="Result" title={results.heading}>
      <div className="flex flex-col gap-10">
        <h3 className="text-md-medium text-gray-a12">{results.awardHeading}</h3>

        <div className="flex flex-col gap-6">
          <p className="text-xs text-gray-a10">Numbers</p>
          <div className="grid gap-6 sm:grid-cols-2">
            {results.stats.map((stat, index) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span
                  className={cn(
                    "text-md-semibold",
                    STAT_COLORS[index % STAT_COLORS.length],
                  )}
                >
                  {stat.value}
                </span>
                <span className="text-xxs text-gray-a10">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6 border-t border-gray-a6 pt-6">
          <p className="text-xs text-gray-a10">Recognition</p>
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-a10">Ratings</span>
            <span className="text-md-semibold text-gray-a12">
              {results.rating}
            </span>
          </div>
        </div>

        <p className={caseStudyBodyClassName}>{results.summary}</p>

        <CaseStudyImageMedia
          image={results.productHuntBadge}
          className="w-auto max-w-[250px] border-0"
        />

        <figure className="flex flex-col gap-4">
          <blockquote className="sr-only">
            &ldquo;{results.testimonial.quote}&rdquo; — {results.testimonial.name},{" "}
            {results.testimonial.role}, {results.testimonial.company}
          </blockquote>
          <CaseStudyImageMedia
            image={results.testimonial.image}
            className="border-0"
          />
        </figure>

        <div className="flex flex-col gap-4 border-t border-gray-a6 pt-8">
          <h3 className="text-md-medium text-gray-a12">
            {results.creditsHeading}
          </h3>
          <div className="flex flex-col gap-1">
            {results.creditsSubheading.map((line) => (
              <p key={line} className="text-md-medium text-purple-11">
                {line}
              </p>
            ))}
          </div>

          <CreditsCollage images={results.collage} />

          <CaseStudyImageMedia
            image={results.teamPhoto}
            className="mx-auto max-w-[280px]"
          />
        </div>
      </div>
    </CaseStudySection>
  );
}

function CreditsCollage({ images }: { images: CaseStudyImage[] }) {
  return (
    <div className="columns-2 gap-3 sm:columns-3">
      {images.map((image) => (
        <div key={image.src} className="mb-3 break-inside-avoid">
          <CaseStudyImageMedia image={image} className="border-0" />
        </div>
      ))}
    </div>
  );
}
