"use client";

import Image from "next/image";
import {
  CaseStudySection,
  caseStudyBodyClassName,
  caseStudyMutedClassName,
} from "@/components/case-study/case-study-shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CaseStudy, CaseStudyPersona } from "@/lib/case-studies/types";

export function CaseStudyResearch({ study }: { study: CaseStudy }) {
  const { research } = study;

  return (
    <CaseStudySection label="Research" title={research.heading}>
      <div className="flex flex-col gap-8">
        {research.context.map((paragraph) => (
          <p key={paragraph} className={caseStudyBodyClassName}>
            {paragraph}
          </p>
        ))}

        <div className="flex flex-col gap-3">
          <h3 className="text-md-medium text-gray-a12">
            {research.insightsHeading}
          </h3>
          <ul className="list-disc space-y-2 pl-5 text-md leading-6 text-gray-a11">
            {research.insights.map((insight) => (
              <li key={insight}>{insight}</li>
            ))}
          </ul>
        </div>

        <figure className="relative overflow-hidden rounded-md border border-gray-a6 bg-purple-a2 px-5 py-6">
          <blockquote className="text-pretty text-md leading-6 text-gray-a11">
            &ldquo;{research.quote}&rdquo;
          </blockquote>
        </figure>

        <div className="flex flex-col gap-4">
          <h3 className="text-md-medium text-gray-a12">
            {research.personasHeading}
          </h3>
          <p className={caseStudyBodyClassName}>{research.personasIntro}</p>

          <div className="flex flex-col gap-6">
            {research.personas.map((persona) => (
              <PersonaCard key={persona.id} persona={persona} />
            ))}
          </div>
        </div>
      </div>
    </CaseStudySection>
  );
}

function PersonaCard({ persona }: { persona: CaseStudyPersona }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-md border border-gray-a6">
      <div className="relative aspect-square w-full bg-gray-a2">
        <Image
          src={persona.image.src}
          alt={persona.image.alt}
          fill
          sizes="(max-width: 600px) calc(100vw - 2rem), 568px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap justify-center gap-2">
          {persona.emoji.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-a2 px-2.5 py-1 text-xs text-gray-a11"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-1 text-center">
          <h4 className="text-sm font-medium text-gray-a12">{persona.title}</h4>
          <p className="text-sm leading-5 text-gray-a11">{persona.summary}</p>
        </div>

        <Tabs defaultValue={persona.tabs[0]?.id}>
          <TabsList variant="pills" className="w-full justify-center">
            {persona.tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {persona.tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="pt-3">
              <ul className="list-disc space-y-1.5 pl-4 text-sm leading-5 text-gray-a11">
                {tab.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </article>
  );
}
