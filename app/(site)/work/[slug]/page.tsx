import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlockCaseStudyArticle } from "@/components/case-study/case-study-article";
import { StructuredCaseStudyArticle } from "@/components/case-study/structured-case-study-article";
import { getCaseStudy, getCaseStudySlugs } from "@/lib/case-studies";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCaseStudy(slug);
  if (!entry) {
    return { title: "Not found" };
  }

  return { title: entry.study.title };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getCaseStudy(slug);

  if (!entry) {
    notFound();
  }

  if (entry.format === "blocks") {
    return <BlockCaseStudyArticle caseStudy={entry.study} />;
  }

  return <StructuredCaseStudyArticle study={entry.study} />;
}
