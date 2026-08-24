export type WorkCompany = {
  name: string;
  href: string;
  accent: WorkAccent;
};

export const WORK_ACCENTS = ["red", "purple", "blue", "yellow"] as const;

export type WorkAccent = (typeof WORK_ACCENTS)[number];

export const WORK_ICON_NAMES = [
  "bland",
  "privado",
  "fold",
  "thursday",
  "angel-one",
] as const;

export type WorkIconName = (typeof WORK_ICON_NAMES)[number];

export type WorkCaptionPart = {
  text: string;
  dotted?: boolean;
};

export type WorkMediaKind = "placeholder" | "video" | "image";

export type WorkCaptionSize = "xs" | "xxs";

export type WorkMediaItem = {
  id: string;
  kind: WorkMediaKind;
  src?: string;
  href?: string;
  width?: number;
  height?: number;
  caption: WorkCaptionPart[];
  captionSize?: WorkCaptionSize;
};

export type WorkItem = {
  id: string;
  icon: WorkIconName;
  role: string;
  company: WorkCompany;
  via?: WorkCompany;
  dates: string;
  description: string;
  media: WorkMediaItem[];
  viewProject?: boolean;
  assetCount?: number;
};

const PRIVADO_MEDIA_CAPTIONS: WorkCaptionPart[][] = [
  [{ text: "Mobile App Privacy" }],
  [{ text: "Privacy Assessment Reports" }],
];

const FOLD_MEDIA_CAPTIONS: WorkCaptionPart[][] = [
  [{ text: "Color Themes" }],
  [{ text: "App Icons" }],
  [{ text: "Refund Center" }],
];

const THURSDAY_MEDIA_CAPTIONS: WorkCaptionPart[][] = [
  [{ text: "Making of Thursday from 0 to 1" }],
  [{ text: "Award winning websites for Thursday" }],
];

export const WORK_ITEMS: WorkItem[] = [
  {
    id: "bland",
    icon: "bland",
    role: "Product Designer",
    company: {
      name: "Bland AI",
      href: "https://bland.ai",
      accent: "red",
    },
    dates: "2023-2025",
    description: "Voice agents for enterprises",
    viewProject: false,
    assetCount: 2,
    media: [
      {
        id: "voice-orbs",
        kind: "placeholder",
        caption: [{ text: "Voice Orbs" }],
        captionSize: "xxs",
      },
      {
        id: "sidebar",
        kind: "placeholder",
        caption: [{ text: "Sidebar" }],
        captionSize: "xxs",
      },
    ],
  },
  {
    id: "privado",
    icon: "privado",
    role: "Product Designer",
    company: {
      name: "Privado AI",
      href: "https://privado.ai",
      accent: "purple",
    },
    dates: "2023-2025",
    description: "Privacy platform for modern software teams",
    viewProject: true,
    assetCount: 2,
    media: [
      {
        id: "mobile-app-privacy",
        kind: "video",
        src: "/video/privado-mobile-privacy.mp4",
        caption: PRIVADO_MEDIA_CAPTIONS[0],
        captionSize: "xs",
      },
      {
        id: "privacy-assessment-reports",
        kind: "video",
        src: "/video/privado-assessments.mp4",
        caption: PRIVADO_MEDIA_CAPTIONS[1],
        captionSize: "xxs",
      },
    ],
  },
  {
    id: "fold",
    icon: "fold",
    role: "Product Designer",
    company: {
      name: "Fold",
      href: "https://fold.money",
      accent: "blue",
    },
    dates: "2023",
    description: "Personal Finance for the rest of us",
    viewProject: false,
    assetCount: 3,
    media: [
      {
        id: "color-themes",
        kind: "placeholder",
        caption: FOLD_MEDIA_CAPTIONS[0],
        captionSize: "xs",
      },
      {
        id: "app-icons",
        kind: "placeholder",
        caption: FOLD_MEDIA_CAPTIONS[1],
        captionSize: "xxs",
      },
      {
        id: "refund-center",
        kind: "placeholder",
        caption: FOLD_MEDIA_CAPTIONS[2],
        captionSize: "xxs",
      },
    ],
  },
  {
    id: "thursday",
    icon: "thursday",
    role: "Founding Designer",
    company: {
      name: "Thursday.social",
      href: "https://thursday.social",
      accent: "purple",
    },
    dates: "2021-2023",
    description: "Social Platform for remote teams",
    viewProject: true,
    assetCount: 2,
    media: [
      {
        id: "thursday-from-minus-one",
        kind: "video",
        src: "/video/thursday.mp4",
        caption: THURSDAY_MEDIA_CAPTIONS[0],
        captionSize: "xs",
      },
      {
        id: "thursday-websites",
        kind: "placeholder",
        caption: THURSDAY_MEDIA_CAPTIONS[1],
        captionSize: "xxs",
      },
    ],
  },
  {
    id: "angel-one",
    icon: "angel-one",
    role: "UX Designer",
    company: {
      name: "Angel One",
      href: "https://www.angelone.in",
      accent: "yellow",
    },
    via: { name: "Thence", href: "https://www.thence.co", accent: "yellow" },
    dates: "2023",
    description: "Modern stock trading platform",
    viewProject: true,
    assetCount: 2,
    media: [
      { id: "angel-one-1", kind: "placeholder", caption: [] },
      { id: "angel-one-2", kind: "placeholder", caption: [] },
    ],
  },
];
