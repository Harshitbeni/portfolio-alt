import type { ReactNode } from "react";
import Image from "next/image";
import {
  CaseStudyImageMedia,
  CaseStudyVideoMedia,
  CaseStudyYouTubeEmbed,
} from "@/components/case-study/case-study-media";
import {
  CaseStudySection,
  caseStudyBodyClassName,
  caseStudyMutedClassName,
} from "@/components/case-study/case-study-shell";
import type { CaseStudy, ComparisonProduct } from "@/lib/case-studies/types";
import { cn } from "@/lib/utils";

const COMPARISON_AXES = [
  { key: "spatial" as const, label: "Spatial" },
  { key: "simple" as const, label: "Simple" },
  { key: "speed" as const, label: "Speed" },
];

export function CaseStudySolution({ study }: { study: CaseStudy }) {
  const { solution } = study;

  return (
    <CaseStudySection label="Solution" title={solution.heading}>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <h3 className="text-md-medium text-gray-a12">
            {solution.thesisHeading}
          </h3>
          <p className={caseStudyBodyClassName}>{solution.thesis}</p>
          <SocializingComparison />
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-md-medium text-gray-a12">
            {solution.comparisonHeading}
          </h3>
          <p className={caseStudyBodyClassName}>{solution.comparisonIntro}</p>
          <ComparisonGrid products={solution.comparisonProducts} />
        </div>

        <FeatureBlock
          title={solution.usercard.heading}
          description={solution.usercard.description}
        >
          <CaseStudyImageMedia image={solution.usercard.image} />
        </FeatureBlock>

        <FeatureBlock
          title={solution.lounge.heading}
          description={solution.lounge.description}
        >
          <CaseStudyImageMedia image={solution.lounge.image} />
        </FeatureBlock>

        <FeatureBlock
          title={solution.participation.heading}
          description={solution.participation.description}
        >
          <ul className="flex flex-wrap gap-2">
            {solution.participation.modes.map((mode) => (
              <li
                key={mode}
                className="rounded-full bg-gray-a2 px-3 py-1.5 text-sm leading-5 text-gray-a11"
              >
                {mode}
              </li>
            ))}
          </ul>
          <CaseStudyImageMedia image={solution.participation.image} />
        </FeatureBlock>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-md-medium text-gray-a12">
              {solution.mixers.heading}
            </h3>
            <p className={caseStudyBodyClassName}>{solution.mixers.description}</p>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-medium text-gray-a12">
              {solution.mixers.wyr.heading}
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <figure className="flex flex-col gap-2">
                <CaseStudyImageMedia image={solution.mixers.wyr.beforeImage} />
                <figcaption className={caseStudyMutedClassName}>
                  Normal would you rather
                </figcaption>
              </figure>
              <figure className="flex flex-col gap-2">
                <CaseStudyImageMedia image={solution.mixers.wyr.afterImage} />
                <figcaption className={caseStudyMutedClassName}>
                  Would you rather in Thursday
                </figcaption>
              </figure>
            </div>
            <p className={caseStudyBodyClassName}>
              {solution.mixers.wyr.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {solution.mixers.gallery.map((image) => (
              <CaseStudyImageMedia key={image.src} image={image} />
            ))}
          </div>
          <p className={`${caseStudyMutedClassName} text-center`}>
            {solution.mixers.galleryCaption}
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-md-medium text-gray-a12">
            {solution.hosting.heading}
          </h3>
          <p className={caseStudyBodyClassName}>{solution.hosting.description}</p>
          <figure className="flex flex-col gap-2">
            <CaseStudyImageMedia image={solution.hosting.dashboardImage} />
            <figcaption className={caseStudyMutedClassName}>
              {solution.hosting.dashboardCaption}
            </figcaption>
          </figure>
          <figure className="flex flex-col gap-2">
            <CaseStudyImageMedia image={solution.hosting.slackbotImage} />
            <figcaption className={caseStudyMutedClassName}>
              {solution.hosting.slackbotCaption}
            </figcaption>
          </figure>
        </div>

        <p className={caseStudyBodyClassName}>{solution.closing}</p>

        <div className="flex flex-col gap-4">
          <h3 className="text-md-medium text-gray-a12">
            {solution.youtube.heading}
          </h3>
          <CaseStudyYouTubeEmbed
            videoId={solution.youtube.videoId}
            title={solution.youtube.heading}
          />
        </div>

        <CaseStudyVideoMedia video={solution.demoVideo} />
      </div>
    </CaseStudySection>
  );
}

function FeatureBlock({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-md-medium text-gray-a12">{title}</h3>
      <p className={caseStudyBodyClassName}>{description}</p>
      {children}
    </div>
  );
}

function SocializingComparison() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="flex flex-col gap-3 rounded-md border border-gray-a6 bg-gray-a2 p-4">
        <p className="text-center text-sm font-medium text-gray-a12">
          Real-life socializing
        </p>
        <div className="relative mx-auto aspect-[4/3] w-full max-w-[240px]">
          <div className="absolute inset-0 rounded-md bg-gray-a3" />
          {[
            { top: "18%", left: "22%" },
            { top: "28%", left: "58%" },
            { top: "42%", left: "35%" },
            { top: "55%", left: "62%" },
            { top: "68%", left: "28%" },
            { top: "72%", left: "52%" },
          ].map((pos, index) => (
            <span
              key={index}
              className="absolute size-7 rounded-full border-2 border-white bg-purple-9 shadow-sm"
              style={{ top: pos.top, left: pos.left }}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-md border border-gray-a6 bg-gray-a2 p-4">
        <p className="text-center text-sm font-medium text-gray-a12">
          Online socializing
        </p>
        <div className="relative mx-auto aspect-[4/3] w-full max-w-[240px]">
          <div className="absolute inset-0 rounded-md bg-gray-a3" />
          {[
            { top: "12%", left: "12%" },
            { top: "14%", left: "72%" },
            { top: "78%", left: "18%" },
            { top: "80%", left: "70%" },
          ].map((pos, index) => (
            <span
              key={index}
              className="absolute size-7 rounded-full border-2 border-white bg-gray-a8 shadow-sm"
              style={{ top: pos.top, left: pos.left }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ComparisonGrid({ products }: { products: ComparisonProduct[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {products.map((product) => (
        <div
          key={product.name}
          className={cn(
            "flex flex-col items-center gap-3 rounded-md border border-gray-a6 p-4",
            product.name === "Thursday" && "border-purple-a6 bg-purple-a2",
          )}
        >
          <div className="relative size-8 overflow-hidden rounded-sm">
            <Image
              src={product.logo.src}
              alt={product.logo.alt}
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <p
            className={cn(
              "text-sm font-medium",
              product.name === "Thursday" ? "text-purple-11" : "text-gray-a12",
            )}
          >
            {product.name}
          </p>
          <RadarChart
            scores={product.scores}
            highlight={product.name === "Thursday"}
          />
        </div>
      ))}
    </div>
  );
}

function RadarChart({
  scores,
  highlight,
}: {
  scores: ComparisonProduct["scores"];
  highlight?: boolean;
}) {
  const size = 120;
  const center = size / 2;
  const radius = 42;
  const angles = [-90, 30, 150];

  const points = COMPARISON_AXES.map((axis, index) => {
    const angle = (angles[index] * Math.PI) / 180;
    const value = scores[axis.key] / 5;
    const x = center + Math.cos(angle) * radius * value;
    const y = center + Math.sin(angle) * radius * value;
    return `${x},${y}`;
  }).join(" ");

  const gridLevels = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
        className="overflow-visible"
      >
        {gridLevels.map((level) => {
          const gridPoints = angles
            .map((angleDeg) => {
              const angle = (angleDeg * Math.PI) / 180;
              const value = level / 5;
              const x = center + Math.cos(angle) * radius * value;
              const y = center + Math.sin(angle) * radius * value;
              return `${x},${y}`;
            })
            .join(" ");
          return (
            <polygon
              key={level}
              points={gridPoints}
              fill="none"
              stroke="var(--gray-a6)"
              strokeWidth="1"
            />
          );
        })}
        {angles.map((angleDeg, index) => {
          const angle = (angleDeg * Math.PI) / 180;
          const x = center + Math.cos(angle) * radius;
          const y = center + Math.sin(angle) * radius;
          return (
            <line
              key={angleDeg}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="var(--gray-a6)"
              strokeWidth="1"
            />
          );
        })}
        <polygon
          points={points}
          fill={highlight ? "var(--purple-a4)" : "var(--gray-a4)"}
          stroke={highlight ? "var(--purple-9)" : "var(--gray-a9)"}
          strokeWidth="1.5"
        />
        {COMPARISON_AXES.map((axis, index) => {
          const angle = (angles[index] * Math.PI) / 180;
          const labelRadius = radius + 14;
          const x = center + Math.cos(angle) * labelRadius;
          const y = center + Math.sin(angle) * labelRadius;
          return (
            <text
              key={axis.key}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-gray-a10 text-[9px] font-medium uppercase"
            >
              {axis.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
