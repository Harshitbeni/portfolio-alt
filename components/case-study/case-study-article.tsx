import type { ReactNode } from "react";
import Image from "next/image";
import type {
  BlockCaseStudy,
  BlockCaseStudyBlock,
  BlockCaseStudyMedia,
  BlockCaseStudySection,
} from "@/lib/case-studies/block-types";
import { CaseStudyBackButton } from "@/components/case-study/case-study-back-button";
import { CaseStudyAnnotatedImage } from "@/components/case-study/case-study-annotated-image";
import {
  CaseStudyBeforeAfter,
  CaseStudySingleStat,
} from "@/components/case-study/case-study-before-after";
import { CaseStudySectionNav } from "@/components/case-study/case-study-section-nav";
import {
  CaseStudyLegacyClosing,
  CaseStudyLegacyHero,
  CaseStudyLegacySiteNav,
} from "@/components/case-study/case-study-legacy-shell";
import { CaseStudyWebMobileScanDiagram } from "@/components/case-study/case-study-web-mobile-scan-diagram";
import { AvatarGroup, AvatarRow } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/ui/video-player";
import { cn } from "@/lib/utils";

const linkClassName =
  "text-gray-a12 underline decoration-gray-a8 [text-decoration-skip-ink:none] [text-decoration-thickness:10%] outline-none transition-[text-decoration-color] duration-200 ease-out hover:decoration-gray-a11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

const accentLinkClassName =
  "text-purple-9 underline decoration-purple-a6 [text-decoration-skip-ink:none] [text-decoration-thickness:10%] outline-none transition-[text-decoration-color] duration-200 ease-out hover:decoration-purple-9 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring";

const CASE_STUDY_IMAGE_SIZE: Record<string, { width: number; height: number }> =
  {
    "/work/privado-mobile-app-scan/ethindia-flowchart-03.png": {
      width: 2672,
      height: 1640,
    },
    "/work/privado-mobile-app-scan/dashboard-screenshot-03.png": {
      width: 2672,
      height: 1640,
    },
    "/work/privado-mobile-app-scan/mobile-finance-screen.png": {
      width: 2672,
      height: 1600,
    },
    "/work/privado-mobile-app-scan/mobile-app-screenshot-02.png": {
      width: 2672,
      height: 1600,
    },
    "/work/privado-mobile-app-scan/portrait-black-and-white.png": {
      width: 192,
      height: 192,
    },
    "/work/privado-mobile-app-scan/privado-team-photo.jpg": {
      width: 512,
      height: 512,
    },
    "/work/privado-mobile-app-scan/code-icon.png": { width: 72, height: 72 },
    "/work/privado-mobile-app-scan/figma-app-icon.png": {
      width: 412,
      height: 412,
    },
    "/work/privado-assessments/dashboard-screenshot.png": {
      width: 3366,
      height: 2790,
    },
    "/work/privado-assessments/privado-dashboard-screenshot-03.png": {
      width: 3366,
      height: 2790,
    },
    "/work/privado-assessments/privado-assessment-screenshot-01.png": {
      width: 2672,
      height: 1600,
    },
    "/work/privado-assessments/privado-assessment-screenshot-03.png": {
      width: 2672,
      height: 1600,
    },
    "/work/privado-assessments/ia-before.png": { width: 2672, height: 1600 },
    "/work/privado-assessments/ia-after.png": { width: 2672, height: 1600 },
    "/work/privado-assessments/ia-wireframe-before.png": {
      width: 520,
      height: 166,
    },
    "/work/privado-assessments/ia-wireframe-after.png": {
      width: 520,
      height: 225,
    },
    "/work/privado-assessments/templates-icon.png": { width: 24, height: 24 },
    "/work/privado-assessments/integrations-icon.png": { width: 24, height: 24 },
    "/work/privado-assessments/agentic-icon.png": { width: 24, height: 24 },
    "/work/privado-assessments/design-iterations.gif": {
      width: 1920,
      height: 1366,
    },
    "/work/privado-assessments/hero-dashboard.png": {
      width: 2676,
      height: 1600,
    },
    "/work/privado-assessments/harshit.webp": { width: 740, height: 688 },
    "/work/privado-assessments/nitin.png": { width: 192, height: 192 },
    "/work/privado-assessments/code-icon.png": { width: 72, height: 72 },
    "/work/privado-assessments/figma-icon.png": { width: 412, height: 412 },
    "/work/privado-assessments/status-illustration-1.svg": {
      width: 336,
      height: 200,
    },
    "/work/privado-assessments/status-illustration-2.svg": {
      width: 336,
      height: 200,
    },
  };

function CaseStudyFramedImage({
  media,
  className,
}: {
  media: BlockCaseStudyMedia;
  className?: string;
}) {
  const size = CASE_STUDY_IMAGE_SIZE[media.src] ?? {
    width: media.width ?? 1200,
    height: media.height ?? 725,
  };

  return (
    <figure className={cn("w-full", className)}>
      <div className="relative isolate w-full overflow-hidden rounded-[var(--radius)]">
        <Image
          src={media.src}
          alt={media.alt ?? ""}
          width={size.width}
          height={size.height}
          className="block h-auto w-full object-cover"
          sizes="(max-width: 600px) calc(100vw - 2rem), 568px"
          unoptimized={media.src.endsWith(".gif") || media.src.endsWith(".svg")}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_0_0_1px_var(--gray-a4)]"
        />
      </div>
      {media.caption ? (
        <figcaption className="mt-1.5 text-center text-xxs leading-4 text-gray-a10">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function CaseStudyImageBlock({
  media,
  className,
}: {
  media: BlockCaseStudyMedia;
  className?: string;
}) {
  if (media.framed) {
    return <CaseStudyFramedImage media={media} className={className} />;
  }

  const size = CASE_STUDY_IMAGE_SIZE[media.src] ?? {
    width: media.width ?? 1200,
    height: media.height ?? 725,
  };

  return (
    <figure>
      <Image
        src={media.src}
        alt={media.alt ?? ""}
        width={size.width}
        height={size.height}
        className={cn(
          "h-auto w-full rounded-md border border-gray-a6",
          className,
        )}
        sizes="(max-width: 600px) calc(100vw - 2rem), 568px"
        unoptimized={media.src.endsWith(".gif") || media.src.endsWith(".svg")}
      />
      {media.caption ? (
        <figcaption className="mt-1.5 text-center text-xxs leading-4 text-gray-a10">
          {media.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function CaseStudyMediaBlock({
  media,
  className,
}: {
  media: BlockCaseStudyMedia;
  className?: string;
}) {
  if (media.type === "video") {
    if (media.usePlayer) {
      return (
        <VideoPlayer
          src={media.src}
          autoplay
          loop
          playsInline
          caption={media.caption}
          aria-label={media.alt}
        />
      );
    }

    const isLegacyCompactVideo = media.src.endsWith("/recording-journey.mp4");
    const isLegacyMobileCompactVideo = [
      "/toolbar-recording.mp4",
      "/overview-dashboard.mp4",
    ].some((suffix) => media.src.endsWith(suffix));

    return (
      <figure>
        <video
          src={media.src}
          autoPlay={media.autoplay}
          controls={media.controls ?? true}
          playsInline
          loop={media.loop}
          muted={media.muted}
          className={cn(
            "w-full rounded-md border border-gray-a6",
            isLegacyCompactVideo
              ? "h-[150px] object-cover"
              : isLegacyMobileCompactVideo
                ? "h-[150px] object-cover sm:h-auto"
              : "h-auto",
            className,
          )}
          aria-label={media.alt}
        />
        {media.caption ? (
          <figcaption className="mt-2 text-sm leading-5 text-gray-a10">
            {media.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return <CaseStudyImageBlock media={media} className={className} />;
}

function needsDetailsSeparator(
  block: BlockCaseStudyBlock,
  index: number,
  blocks: BlockCaseStudyBlock[],
) {
  if (!["team", "links", "timeline"].includes(block.type)) return false;
  if (index === 0) return false;
  const previous = blocks[index - 1];
  return previous?.type !== block.type;
}

function CaseStudyBlockRenderer({
  block,
  sectionId,
  blockIndex,
  blocks,
  usesOldLayout,
}: {
  block: BlockCaseStudyBlock;
  sectionId: string;
  blockIndex: number;
  blocks: BlockCaseStudyBlock[];
  usesOldLayout: boolean;
}) {
  const separatorClassName = needsDetailsSeparator(block, blockIndex, blocks)
    ? usesOldLayout
      ? undefined
      : "border-t border-gray-a6 pt-6"
    : undefined;

  switch (block.type) {
    case "paragraph":
      return (
        <p
          className={cn(
            "text-pretty text-md leading-6",
            block.tone === "primary" ? "text-gray-a12" : "text-gray-a11",
            usesOldLayout &&
              sectionId === "solution" &&
              block.text.startsWith("Versioning is handled") &&
              "mb-[34px]",
            usesOldLayout &&
              sectionId === "solution" &&
              block.text.startsWith("Testing mobile apps in Privado") &&
              "mb-[84px] sm:mb-[60px]",
            usesOldLayout &&
              sectionId === "solution" &&
              block.text.startsWith("The biggest challenge here was the toolbar") &&
              "mb-8 sm:mb-[31px]",
            usesOldLayout &&
              sectionId === "solution" &&
              block.text.startsWith("Each mobile app has layers") &&
              "mb-8",
            usesOldLayout &&
              sectionId === "solution" &&
              block.text.startsWith("We added notes") &&
              "mb-[53px] sm:mb-[43px]",
          )}
        >
          {block.text}
        </p>
      );
    case "heading":
      if (block.level === 2) {
        return (
          <h2
            className={cn(
              "text-gray-a12",
              usesOldLayout
                ? "text-xl-medium"
                : sectionId === "process"
                  ? "text-md-medium"
                  : "text-md-semibold",
            )}
          >
            {block.text}
          </h2>
        );
      }
      return (
        <h3
          className={cn(
            "text-gray-a12",
            usesOldLayout ? "text-xl-medium" : "text-md-medium",
          )}
        >
          {block.text}
        </h3>
      );
    case "media":
      if (sectionId === "goals") {
        return (
          <div className="rounded-md border border-gray-a6 bg-gray-a2 p-3">
            <CaseStudyMediaBlock media={block.media} className="border-0" />
          </div>
        );
      }
      if (usesOldLayout && sectionId === "process") {
        return (
          <div className="mb-[11px] sm:mb-[26px]">
            <CaseStudyMediaBlock media={block.media} />
          </div>
        );
      }
      if (
        usesOldLayout &&
        sectionId === "solution" &&
        block.media.src.endsWith("/hero-mobile-scan-demo.mp4")
      ) {
        return (
          <div className="mb-[51px]">
            <CaseStudyMediaBlock media={block.media} />
          </div>
        );
      }
      return <CaseStudyMediaBlock media={block.media} />;
    case "cards":
      if (sectionId === "next") {
        return (
          <div className="flex flex-col">
            {block.cards.map((card, index) => (
              <div
                key={card.title}
                className={cn(
                  "flex flex-col gap-2 py-4",
                  index > 0 && "border-t border-gray-a6",
                )}
              >
                {card.icon ? (
                  <Image
                    src={card.icon}
                    alt=""
                    width={24}
                    height={24}
                    className="size-6"
                    unoptimized
                  />
                ) : null}
                <p className="text-sm font-medium text-gray-a12">{card.title}</p>
                <p className="text-xs leading-5 text-gray-a11">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        );
      }

      if (usesOldLayout && sectionId === "context") {
        return (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-8">
            {block.cards.map((card, index) => (
              <div
                key={card.title}
                className="flex min-h-[126px] flex-col gap-2 sm:min-h-0"
              >
                <div className="flex items-center gap-2">
                  <span aria-hidden className="text-md text-gray-a9">
                    {index === 0 ? "▥" : "⚖"}
                  </span>
                  <p className="text-md-medium text-gray-a12">{card.title}</p>
                </div>
                <p className="text-md leading-6 text-gray-a11">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        );
      }

      return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {block.cards.map((card, index) => (
            <div
              key={card.title}
              className={cn(
                "flex flex-col gap-1.5 rounded-md border border-gray-a6 bg-gray-a2 p-3",
                block.cards.length === 3 &&
                  index === block.cards.length - 1 &&
                  "sm:col-span-2",
              )}
            >
              <p className="text-sm font-medium text-gray-a12">{card.title}</p>
              <p className="text-xs leading-5 text-gray-a11">{card.description}</p>
            </div>
          ))}
        </div>
      );
    case "problem-cards":
      return (
        <div className="flex flex-col gap-4">
          {block.cards.map((card) => {
            const imageSize = card.image
              ? CASE_STUDY_IMAGE_SIZE[card.image] ?? { width: 1200, height: 725 }
              : null;

            return (
              <div key={card.title} className="flex flex-col gap-3">
                <p className="text-sm font-medium text-gray-a12">{card.title}</p>
                {card.image && imageSize ? (
                  card.annotations?.length ? (
                    <CaseStudyAnnotatedImage
                      src={card.image}
                      width={imageSize.width}
                      height={imageSize.height}
                      annotations={card.annotations}
                    />
                  ) : (
                    <Image
                      src={card.image}
                      alt=""
                      width={imageSize.width}
                      height={imageSize.height}
                      className="h-auto w-full rounded-sm border border-gray-a6"
                      sizes="(max-width: 600px) calc(100vw - 2rem), 568px"
                      unoptimized={card.image.endsWith(".svg")}
                    />
                  )
                ) : null}
                <p className="text-sm leading-5 text-gray-a11">{card.description}</p>
              </div>
            );
          })}
        </div>
      );
    case "quote":
      if (sectionId === "context") {
        return (
          <blockquote
            className={cn(
              "text-center",
              usesOldLayout && "flex min-h-[152px] items-center justify-center sm:min-h-0",
            )}
          >
            <p
              className={cn(
                "mx-auto max-w-[720px] text-pretty text-gray-a11 italic",
                usesOldLayout
                  ? "text-2xl-semibold leading-[44px] sm:text-3xl-semibold sm:leading-[48px]"
                  : "text-lg-semibold",
              )}
            >
              &ldquo;{block.text}&rdquo;
            </p>
            {block.attribution ? (
              <footer className="mt-2 text-sm text-gray-a10 not-italic">
                {block.attribution}
              </footer>
            ) : null}
          </blockquote>
        );
      }

      return (
        <blockquote className="border-l-2 border-purple-a6 py-0.5 pl-4">
          <p className="text-pretty text-md leading-6 text-gray-a11 italic">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.attribution ? (
            <footer className="mt-2 text-sm text-gray-a10 not-italic">
              {block.attribution}
            </footer>
          ) : null}
        </blockquote>
      );
    case "comparison":
      if (usesOldLayout) {
        return (
          <div className="flex flex-col gap-4">
            {block.heading ? (
              <h3 className="text-xl-medium text-gray-a12">
                {block.heading}
              </h3>
            ) : null}
            {block.intro ? (
              <p className="text-pretty text-md leading-6 text-gray-a11">
                {block.intro}
              </p>
            ) : null}
            <div className="mt-4 grid grid-cols-1 gap-8 sm:h-[420px] sm:grid-cols-2">
              {[block.left, block.right].map((column, columnIndex) => (
                <div
                  key={column.title}
                  className="flex min-w-0 flex-col gap-2"
                >
                  <div className="flex h-60 flex-col overflow-hidden rounded-[16px] bg-gray-4 p-2 pb-0">
                    <div className="flex gap-1.5 px-1 pb-1">
                      <span className="size-2 rounded-full bg-gray-7" />
                      <span className="size-2 rounded-full bg-gray-7" />
                      <span className="size-2 rounded-full bg-gray-7" />
                    </div>
                    <div className="relative min-h-0 flex-1 overflow-hidden rounded-[12px] border-2 border-gray-4 bg-gray-1">
                      {columnIndex === 0 ? (
                        <div className="absolute inset-4 rounded-sm bg-gray-3">
                          <div className="absolute left-[18%] top-[42%] h-px w-[64%] bg-gray-7" />
                          <div className="absolute left-[28%] top-[29%] h-[46%] w-[32%] rounded-full border border-gray-7" />
                          {[
                            "left-[12%] top-[40%] bg-gray-8",
                            "left-[34%] top-[27%] bg-gray-6",
                            "left-[34%] top-[40%] bg-gray-6",
                            "left-[34%] top-[54%] bg-gray-8",
                            "left-[56%] top-[27%] bg-gray-8",
                            "left-[56%] top-[40%] bg-gray-6",
                            "left-[56%] top-[54%] bg-gray-6",
                            "left-[78%] top-[40%] bg-gray-6",
                          ].map((className) => (
                            <span
                              key={className}
                              className={cn(
                                "absolute h-6 w-12 rounded-[10px]",
                                className,
                              )}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="absolute inset-4 flex gap-3 rounded-sm bg-gray-3 p-3">
                          <div className="relative flex-1 rounded-sm bg-gray-1">
                            <div className="absolute left-1/2 top-1/2 h-[72%] w-[43%] -translate-x-1/2 -translate-y-1/2 rounded-[18px] border-[3px] border-gray-12">
                              <span className="absolute left-1/2 top-0 h-2 w-12 -translate-x-1/2 rounded-b-md bg-gray-12" />
                              <span className="absolute bottom-2 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-full bg-gray-12" />
                            </div>
                          </div>
                          <div className="flex w-[32%] flex-col justify-between rounded-sm bg-gray-1 p-2">
                            {[8, 6, 8, 6, 6, 7, 8].map((tone, index) => (
                              <span
                                key={`${tone}-${index}`}
                                className={cn(
                                  "h-5 rounded-sm",
                                  tone === 8 ? "bg-gray-8" : tone === 7 ? "bg-gray-7" : "bg-gray-6",
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-center text-sm font-medium leading-5 text-gray-a12">
                    {column.title}
                  </p>
                  <ul className="flex flex-col gap-2 py-2">
                    {column.items.map((item, itemIndex) => (
                      <li
                        key={item}
                        className="flex gap-3 text-sm leading-5 text-gray-a11"
                      >
                        <span
                          aria-hidden
                          className={itemIndex === 0 ? "text-green-9" : "text-red-9"}
                        >
                          {itemIndex === 0 ? "✓" : "×"}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      }
      return (
        <div className="flex flex-col gap-4">
          {block.heading ? (
            <h3
              className={cn(
                "text-gray-a12",
                usesOldLayout ? "text-xl-medium" : "text-md-medium",
              )}
            >
              {block.heading}
            </h3>
          ) : null}
          {block.intro ? (
            <p className="text-pretty text-md leading-6 text-gray-a11">
              {block.intro}
            </p>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            {[block.left, block.right].map((column) => (
              <div
                key={column.title}
                className="flex flex-col gap-2.5 rounded-md border border-gray-a6 bg-gray-a2 p-3"
              >
                <p className="text-sm font-medium text-gray-a12">
                  {column.title}
                </p>
                <ul className="flex flex-col gap-2">
                  {column.items.map((item) => (
                    <li
                      key={item}
                      className="text-xs leading-5 text-gray-a11 before:me-1.5 before:text-gray-a10 before:content-['•']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      );
    case "feature": {
      const isProcess = sectionId === "process";
      const isSolution = sectionId === "solution";
      const mediaFirst = block.mediaFirst ?? (isSolution && !block.description);
      const processFeatureNumber =
        blocks.filter((candidate) => candidate.type === "feature").indexOf(block) + 1;

      const titleBlock = (
        <div className="flex flex-col gap-2">
          <h3 className="text-md-medium text-gray-a12">{block.title}</h3>
          {block.description ? (
            <p className="text-sm leading-5 text-gray-a11">{block.description}</p>
          ) : null}
        </div>
      );

      const mediaBlock = block.media ? (
        <CaseStudyMediaBlock
          media={block.media}
          className={isProcess ? "border-0" : undefined}
        />
      ) : null;

      if (usesOldLayout && isProcess) {
        return (
          <div className="grid grid-cols-1 items-start gap-6 sm:mb-4 sm:grid-cols-[57%_1fr]">
            {mediaBlock}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-md-medium text-gray-a12">
                  {processFeatureNumber}. {block.title}
                </h3>
                {block.description ? (
                  <p className="text-md leading-6 text-gray-a11">
                    {block.description}
                  </p>
                ) : null}
              </div>
              {block.items?.length ? (
                <ul className="flex flex-col gap-2.5">
                  {block.items.map((item) => (
                    <li key={item.text} className="flex gap-2.5 text-md leading-6 text-gray-a11">
                      <span
                        aria-hidden
                        className={
                          item.tone === "positive"
                            ? "text-green-9"
                            : "text-red-9"
                        }
                      >
                        {item.tone === "positive" ? "✓" : "×"}
                      </span>
                      <span>{item.text}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        );
      }

      if (block.media?.usePlayer && isSolution) {
        return mediaBlock;
      }

      if (block.media?.usePlayer) {
        return (
          <div className="flex flex-col gap-4">
            {mediaBlock}
            {titleBlock}
          </div>
        );
      }

      if (isProcess) {
        return (
          <div className="flex flex-col overflow-hidden rounded-md border border-gray-a6 bg-gray-a2">
            <div className="flex flex-col gap-2 p-4">
              <h3 className="text-md-medium text-gray-a12">{block.title}</h3>
              {block.description ? (
                <p className="text-sm leading-5 text-gray-a11">
                  {block.description}
                </p>
              ) : null}
            </div>
            {mediaBlock ? (
              <div className="border-t border-gray-a6 p-3">{mediaBlock}</div>
            ) : null}
          </div>
        );
      }

      if (mediaFirst) {
        return (
          <div className="flex flex-col gap-4">
            {mediaBlock}
            {titleBlock}
          </div>
        );
      }

      return (
        <div className="flex flex-col gap-4">
          {titleBlock}
          {mediaBlock}
        </div>
      );
    }
    case "team":
      return (
        <div className={cn("flex flex-col gap-4", separatorClassName)}>
          <p className="text-xs font-medium text-gray-a10">Team</p>
          <AvatarGroup className="gap-3">
            {block.members.map((member) => (
              <AvatarRow
                key={member.name}
                name={member.name}
                role={member.role}
                src={member.image}
                size="xs"
                className={cn(
                  usesOldLayout &&
                    "items-center gap-2 [&>div]:flex-row [&>div]:gap-1 [&>div>p:first-child]:after:content-[','] sm:items-start sm:gap-3 sm:[&>div]:flex-col sm:[&>div]:gap-0 sm:[&>div>p:first-child]:after:content-none",
                )}
              />
            ))}
          </AvatarGroup>
        </div>
      );
    case "links":
      return (
        <div className={cn("flex flex-col gap-3", separatorClassName)}>
          <p className="text-xs font-medium text-gray-a10">Links</p>
          <div className="flex flex-col gap-2">
            {block.links.map((link) => (
              <Button
                key={link.href}
                variant="inline"
                size="inline"
                asChild
                className={link.accent ? "text-purple-11" : "text-gray-a12"}
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon ? (
                    <Image
                      src={link.icon}
                      alt=""
                      width={20}
                      height={20}
                      className="size-5 shrink-0 rounded-sm"
                    />
                  ) : null}
                  {link.label}
                </a>
              </Button>
            ))}
          </div>
        </div>
      );
    case "list":
      if (sectionId === "process") {
        return (
          <ul className={cn("flex flex-col gap-4", usesOldLayout && "py-1")}>
            {block.items.map((item) => (
              <li
                key={item}
                className={cn(
                  "flex gap-2.5 text-gray-a11",
                  usesOldLayout ? "text-md leading-6" : "text-sm leading-5",
                )}
              >
                <span
                  className={cn(
                    "shrink-0 font-medium text-purple-9",
                    usesOldLayout && "flex size-5 items-center justify-center rounded-full bg-gray-a3 text-gray-a9",
                  )}
                  aria-hidden
                >
                  +
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
      }

      return (
        <ul className="list-disc space-y-2 pl-5 text-md leading-6 text-gray-a11">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case "goals":
      return (
        <ol className="flex flex-col gap-3">
          {block.items.map((item, index) => (
            <li key={item.text} className="text-md leading-6 text-gray-a11">
              {item.uncertain ? "? " : `${index + 1}. `}
              {item.text}
            </li>
          ))}
        </ol>
      );
    case "stats": {
      const isComparison = block.stats.length === 2;

      if (isComparison) {
        return (
          <CaseStudyBeforeAfter
            intro={block.intro}
            before={block.stats[0]}
            after={block.stats[1]}
          />
        );
      }

      return <CaseStudySingleStat stat={block.stats[0]} />;
    }
    case "qa-group":
      return (
        <div
          className={cn(
            "flex flex-col rounded-md border border-gray-a6 bg-gray-a2",
            usesOldLayout
              ? "gap-5 px-6 py-4 sm:gap-6 sm:py-5"
              : "gap-4 p-4",
          )}
        >
          {block.items.map((item, index) => (
            <div key={item.question} className="flex gap-3">
              <span
                aria-hidden
                className={cn(
                  "flex shrink-0 items-center justify-center font-medium",
                  usesOldLayout
                    ? "mt-0.5 size-5 rounded-sm text-xxs text-gray-1"
                    : "size-6 rounded-full bg-purple-a2 text-xs text-purple-11",
                  usesOldLayout && index === 0 && "bg-purple-9",
                  usesOldLayout && index === 1 && "bg-gray-9",
                  usesOldLayout && index === 2 && "bg-green-9",
                )}
              >
                ?
              </span>
              <div className="flex min-w-0 flex-col gap-1.5">
                <p
                  className={cn(
                    "font-medium text-gray-a12",
                    usesOldLayout ? "text-md" : "text-xs",
                  )}
                >
                  {item.question}
                </p>
                <p
                  className={cn(
                    "text-gray-a11",
                    usesOldLayout ? "text-md leading-6" : "text-sm leading-5",
                  )}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    case "qa":
      return (
        <div className="flex gap-3 rounded-md border border-gray-a6 bg-gray-a2 p-4">
          <span
            aria-hidden
            className="flex size-6 shrink-0 items-center justify-center rounded-full bg-purple-a2 text-xs font-medium text-purple-11"
          >
            ?
          </span>
          <div className="flex min-w-0 flex-col gap-1.5">
            <p className="text-xs font-medium text-gray-a12">{block.question}</p>
            <p className="text-sm leading-5 text-gray-a11">{block.answer}</p>
          </div>
        </div>
      );
    case "timeline":
      return (
        <div className={cn("flex flex-col gap-1", separatorClassName)}>
          <p className="text-xs font-medium text-gray-a10">{block.label}</p>
          <p className="text-sm text-gray-a12">{block.value}</p>
        </div>
      );
    case "web-mobile-scan-diagram":
      return <CaseStudyWebMobileScanDiagram />;
    case "cta":
      return (
        <a
          href={block.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center rounded-md border border-purple-a6 bg-purple-a2 px-4 py-2.5 text-sm font-medium text-purple-11 no-underline transition-colors hover:bg-purple-a3"
        >
          {block.label}
        </a>
      );
    case "credits":
      return (
        <div
          className={cn(
            sectionId === "next" && "border-t border-gray-a6 pt-8",
          )}
        >
          <p className="text-sm leading-5 text-gray-a11">
            {block.text}
            {block.links?.map((link, index) => (
              <span key={link.href}>
                {index === 0
                  ? " "
                  : index === block.links!.length - 1
                    ? ", and "
                    : ", "}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={link.accent ? accentLinkClassName : linkClassName}
                >
                  {link.label}
                </a>
              </span>
            ))}
            .
          </p>
        </div>
      );
    default:
      return null;
  }
}

function sectionBlockGap(sectionId: string) {
  if (sectionId === "process" || sectionId === "solution") return "gap-8";
  if (sectionId === "details") return "gap-2";
  if (sectionId === "goals") return "gap-6";
  return "gap-5";
}

function isCaptionedMediaPair(
  current: BlockCaseStudyBlock,
  next: BlockCaseStudyBlock | undefined,
): next is Extract<BlockCaseStudyBlock, { type: "media" }> {
  return (
    current.type === "media" &&
    next?.type === "media" &&
    Boolean(current.media.caption) &&
    Boolean(next.media.caption)
  );
}

function CaseStudySectionBlock({
  section,
  usesOldLayout,
}: {
  section: BlockCaseStudySection;
  usesOldLayout: boolean;
}) {
  const renderedBlocks: ReactNode[] = [];
  let index = 0;

  while (index < section.blocks.length) {
    const block = section.blocks[index];
    const next = section.blocks[index + 1];

    if (usesOldLayout && section.id === "details" && index === 1) {
      renderedBlocks.push(
        <div
          key="details-meta"
          className="grid grid-cols-1 gap-[25.5px] sm:grid-cols-[1.45fr_1fr_0.75fr] sm:gap-10"
        >
          {section.blocks.slice(1).map((detailBlock, detailIndex) => (
            <CaseStudyBlockRenderer
              key={`details-meta-${detailIndex}`}
              block={detailBlock}
              sectionId={section.id}
              blockIndex={detailIndex + 1}
              blocks={section.blocks}
              usesOldLayout={usesOldLayout}
            />
          ))}
        </div>,
      );
      break;
    }

    if (
      block.type === "media" &&
      isCaptionedMediaPair(block, next) &&
      section.id !== "process"
    ) {
      renderedBlocks.push(
        <div
          key={`${section.id}-${index}-pair`}
          className={cn(
            "grid gap-4",
            "grid-cols-1 sm:grid-cols-2",
          )}
        >
          <CaseStudyMediaBlock
            media={block.media}
            className={usesOldLayout && section.id === "solution" ? "h-[320px] object-cover" : undefined}
          />
          <CaseStudyMediaBlock
            media={next.media}
            className={usesOldLayout && section.id === "solution" ? "h-[320px] object-cover" : undefined}
          />
        </div>,
      );
      index += 2;
      continue;
    }

    renderedBlocks.push(
      <CaseStudyBlockRenderer
        key={`${section.id}-${index}`}
        block={block}
        sectionId={section.id}
        blockIndex={index}
        blocks={section.blocks}
        usesOldLayout={usesOldLayout}
      />,
    );
    index += 1;
  }

  return (
    <section
      id={section.id}
      className={cn(
        "flex scroll-mt-16 flex-col",
        usesOldLayout ? "gap-4" : "gap-5",
        usesOldLayout &&
          section.id === "context" &&
          "pb-[15px] sm:-mt-8",
      )}
      aria-labelledby={`${section.id}-heading`}
    >
      <h2
        id={`${section.id}-heading`}
        className="text-xs font-medium text-gray-a10"
      >
        {section.label}
      </h2>
      <div
        className={cn(
          "flex flex-col",
          usesOldLayout
            ? section.id === "details"
              ? "gap-4"
              : section.id === "context"
                ? "gap-0 [&>*:nth-child(2)]:mt-4 [&>*:nth-child(3)]:mt-4 [&>*:nth-child(4)]:mt-4 sm:[&>*:nth-child(3)]:mt-16 sm:[&>*:nth-child(4)]:mt-11"
                : "gap-8"
            : sectionBlockGap(section.id),
        )}
      >
        {renderedBlocks}
      </div>
    </section>
  );
}

export function BlockCaseStudyArticle({ caseStudy }: { caseStudy: BlockCaseStudy }) {
  const usesOldLayout = caseStudy.slug === "privado-mobile-app-scan";
  const navSections = caseStudy.sections.map((section) => ({
    id: section.id,
    label: section.label,
  }));

  return (
    <>
      {usesOldLayout ? <CaseStudyLegacySiteNav /> : null}
      <article
        className={cn(
          "w-full px-4 text-sm",
          usesOldLayout
            ? "mx-auto max-w-[832px] pb-0"
            : "max-w-[600px]",
        )}
      >
        <header
          className={cn(
            "flex flex-col",
            usesOldLayout
              ? "border-b border-gray-a4 pb-12 pt-20 sm:pb-[60px]"
              : "mb-8 gap-5",
          )}
        >
          {usesOldLayout ? null : <CaseStudyBackButton />}
          {usesOldLayout ? (
            <CaseStudyLegacyHero />
          ) : caseStudy.heroMedia ? (
            <CaseStudyMediaBlock media={caseStudy.heroMedia} />
          ) : null}
          <div
            className={cn(
              "flex flex-col",
              usesOldLayout ? "mt-10 gap-4" : "gap-2",
            )}
          >
            <h1
              className={cn(
                "text-gray-a12",
                usesOldLayout
                  ? "text-2xl-semibold sm:text-3xl-semibold"
                  : "text-lg-semibold",
              )}
            >
              {usesOldLayout ? (
                <>
                  <span className="tracking-[-1px] sm:hidden">
                    Unlocking New Revenue
                    <br />
                    Stream with Privado
                    <br />
                    Mobile App Scanning
                  </span>
                  <span className="hidden sm:inline">
                    Unlocking New Revenue Stream
                    <br /> with Privado Mobile App Scanning
                  </span>
                </>
              ) : (
                caseStudy.title
              )}
            </h1>
            <p
              className={cn(
                "text-pretty text-gray-a11",
                usesOldLayout
                  ? "text-sm font-medium leading-5"
                  : "text-md leading-6",
              )}
            >
              {caseStudy.subtitle}
            </p>
          </div>
        </header>

        <CaseStudySectionNav
          sections={navSections}
          showDesktopList={usesOldLayout}
        />

        <div
          className={cn(
            "flex flex-col",
            usesOldLayout
              ? "mt-8 gap-20 sm:mt-[60px] sm:gap-32"
              : "mt-10 gap-16",
          )}
        >
          {caseStudy.sections.map((section) => (
            <CaseStudySectionBlock
              key={section.id}
              section={section}
              usesOldLayout={usesOldLayout}
            />
          ))}
        </div>
        {usesOldLayout ? <CaseStudyLegacyClosing /> : null}
      </article>
    </>
  );
}
