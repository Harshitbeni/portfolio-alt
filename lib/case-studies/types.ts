import type { WorkAccent } from "@/lib/work";

export type CaseStudyImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type CaseStudyVideo = {
  src: string;
  alt: string;
};

export type CaseStudyTeamMember = {
  name: string;
  role: string;
};

export type CaseStudyLink = {
  label: string;
  href: string;
};

export type CaseStudyGoal = {
  number: number;
  question: string;
};

export type PersonaTab = {
  id: string;
  label: string;
  items: string[];
};

export type CaseStudyPersona = {
  id: string;
  title: string;
  emoji: string[];
  summary: string;
  image: CaseStudyImage;
  tabs: PersonaTab[];
};

export type ProcessPillar = {
  title: string;
  description: string;
  features: { title: string; description: string }[];
  images?: CaseStudyImage[];
};

export type ComparisonProduct = {
  name: string;
  logo: CaseStudyImage;
  scores: { spatial: number; simple: number; speed: number };
};

export type CaseStudyStat = {
  value: string;
  label: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  subtitle: string;
  accent: WorkAccent;
  role: string;
  team: CaseStudyTeamMember[];
  links?: CaseStudyLink[];
  timeline: string;
  goalsStatement: string;
  gap: {
    heading: string;
    paragraphs: string[];
  };
  goals: CaseStudyGoal[];
  research: {
    heading: string;
    context: string[];
    insightsHeading: string;
    insights: string[];
    quote: string;
    personasHeading: string;
    personasIntro: string;
    personas: CaseStudyPersona[];
  };
  process: {
    heading: string;
    intro: string;
    pillars: ProcessPillar[];
    prototypeNote: string;
    betaNote: string;
    images: CaseStudyImage[];
  };
  buildingInPublic: {
    heading: string;
    paragraphs: string[];
    video: CaseStudyVideo;
  };
  solution: {
    heading: string;
    thesisHeading: string;
    thesis: string;
    comparisonHeading: string;
    comparisonIntro: string;
    comparisonProducts: ComparisonProduct[];
    usercard: {
      heading: string;
      description: string;
      image: CaseStudyImage;
    };
    lounge: {
      heading: string;
      description: string;
      image: CaseStudyImage;
    };
    participation: {
      heading: string;
      description: string;
      modes: string[];
      image: CaseStudyImage;
    };
    mixers: {
      heading: string;
      description: string;
      wyr: {
        heading: string;
        description: string;
        beforeImage: CaseStudyImage;
        afterImage: CaseStudyImage;
      };
      gallery: CaseStudyImage[];
      galleryCaption: string;
    };
    hosting: {
      heading: string;
      description: string;
      dashboardImage: CaseStudyImage;
      dashboardCaption: string;
      slackbotImage: CaseStudyImage;
      slackbotCaption: string;
    };
    closing: string;
    youtube: {
      heading: string;
      videoId: string;
    };
    demoVideo: CaseStudyVideo;
  };
  results: {
    heading: string;
    awardHeading: string;
    stats: CaseStudyStat[];
    rating: string;
    summary: string;
    productHuntBadge: CaseStudyImage;
    testimonial: {
      quote: string;
      name: string;
      role: string;
      company: string;
      image: CaseStudyImage;
    };
    creditsHeading: string;
    creditsSubheading: string[];
    collage: CaseStudyImage[];
    teamPhoto: CaseStudyImage;
  };
};
