export type BlockCaseStudyLink = {
  label: string;
  href: string;
  icon?: string;
  accent?: boolean;
};

export type BlockCaseStudyTeamMember = {
  name: string;
  role: string;
  image?: string;
};

export type BlockCaseStudyCard = {
  title: string;
  description: string;
  icon?: string;
};

export type BlockCaseStudyComparisonColumn = {
  title: string;
  items: string[];
};

export type BlockCaseStudyMedia = {
  type: "image" | "video";
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  caption?: string;
  usePlayer?: boolean;
  framed?: boolean;
};

export type BlockCaseStudyAnnotation = {
  number: number;
  x: number;
  y: number;
  text: string;
};

export type BlockCaseStudyProblemCard = {
  title: string;
  description: string;
  image?: string;
  annotations?: BlockCaseStudyAnnotation[];
};

export type BlockCaseStudyGoal = {
  text: string;
  uncertain?: boolean;
};

export type BlockCaseStudyStat = {
  value: string;
  label: string;
};

export type BlockCaseStudyBlock =
  | { type: "paragraph"; text: string; tone?: "primary" | "default" }
  | { type: "qa-group"; items: { question: string; answer: string }[] }
  | { type: "heading"; text: string; level?: 2 | 3 }
  | { type: "media"; media: BlockCaseStudyMedia }
  | { type: "cards"; cards: BlockCaseStudyCard[] }
  | { type: "quote"; text: string; attribution?: string }
  | {
      type: "comparison";
      heading?: string;
      intro?: string;
      left: BlockCaseStudyComparisonColumn;
      right: BlockCaseStudyComparisonColumn;
    }
  | {
      type: "feature";
      title: string;
      description?: string;
      items?: { text: string; tone: "positive" | "negative" }[];
      media?: BlockCaseStudyMedia;
      mediaFirst?: boolean;
    }
  | { type: "team"; members: BlockCaseStudyTeamMember[] }
  | { type: "links"; links: BlockCaseStudyLink[] }
  | { type: "list"; items: string[] }
  | { type: "qa"; question: string; answer: string }
  | { type: "timeline"; label: string; value: string }
  | { type: "cta"; label: string; href: string }
  | { type: "problem-cards"; cards: BlockCaseStudyProblemCard[] }
  | { type: "goals"; items: BlockCaseStudyGoal[] }
  | { type: "stats"; intro?: string; stats: BlockCaseStudyStat[] }
  | { type: "credits"; text: string; links?: BlockCaseStudyLink[] }
  | { type: "web-mobile-scan-diagram" };

export type BlockCaseStudySection = {
  id: string;
  label: string;
  blocks: BlockCaseStudyBlock[];
};

export type BlockCaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  heroMedia?: BlockCaseStudyMedia;
  sections: BlockCaseStudySection[];
};
