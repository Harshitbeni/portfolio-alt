export const STACK_SECTIONS = ["work", "life", "utility"] as const;

export type StackSection = (typeof STACK_SECTIONS)[number];

export type StackItem = {
  id: string;
  name: string;
  description: string;
  iconSrc: string;
  href: string;
  section: StackSection;
};

export const STACK_ITEMS = [
  {
    id: "bike",
    name: "Bike",
    description:
      "Outliners match how I think. This is a simple, fast and native outliner.",
    iconSrc: "/stack/bike.png",
    href: "https://hogbaysoftware.com/bike/",
    section: "work",
  },
  {
    id: "codex",
    name: "Codex",
    description:
      "Personal use AI agents, I love the iOS app and voice mode.",
    iconSrc: "/stack/codex.png",
    href: "https://openai.com/codex/",
    section: "work",
  },
  {
    id: "cursor",
    name: "Cursor",
    description:
      "This is my top choice for coding agents and what I like to use for work.",
    iconSrc: "/stack/cursor.jpg",
    href: "https://cursor.com",
    section: "work",
  },
  {
    id: "figma",
    name: "Figma",
    description: "I still love the canvas interface for designing.",
    iconSrc: "/stack/figma.jpg",
    href: "https://figma.com",
    section: "work",
  },
  {
    id: "1password",
    name: "1Password",
    description: "Password manager that does the job well.",
    iconSrc: "/stack/1password.png",
    href: "https://1password.com/",
    section: "utility",
  },
  {
    id: "cron",
    name: "Cron",
    description:
      "Clean and to the point calendar with built-in scheduling functionality.",
    iconSrc: "/stack/cron.jpg",
    href: "https://cron.com",
    section: "utility",
  },
  {
    id: "swish",
    name: "Swish",
    description: "Window management through gestures.",
    iconSrc: "/stack/swish.png",
    href: "https://highlyopinionated.co/swish/",
    section: "utility",
  },
  {
    id: "raycast",
    name: "Raycast",
    description: "Spotlight replacement on steroid.",
    iconSrc: "/stack/raycast.png",
    href: "https://www.raycast.com",
    section: "utility",
  },
  {
    id: "oneswitch",
    name: "OneSwitch",
    description: "All my important toggles available in a single click.",
    iconSrc: "/stack/oneswitch.jpg",
    href: "https://fireball.studio/oneswitch",
    section: "utility",
  },
  {
    id: "lookaway",
    name: "Lookaway",
    description: "Pomodoro timer that forces me to look away.",
    iconSrc: "/stack/lookaway.png",
    href: "https://lookaway.app",
    section: "utility",
  },
  {
    id: "noir",
    name: "Noir",
    description:
      "Dark mode every website at night. Works and syncs across all my devices.",
    iconSrc: "/stack/noir.jpg",
    href: "https://getnoir.app",
    section: "utility",
  },
  {
    id: "things-3",
    name: "Things 3",
    description: "Quintessential Personal task manager.",
    iconSrc: "/stack/things.png",
    href: "https://culturedcode.com/things/",
    section: "life",
  },
  {
    id: "sleeve",
    name: "Sleeve",
    description: "Quick music controls and Last.fm scrobbling.",
    iconSrc: "/stack/sleeve.png",
    href: "https://replay.software/sleeve",
    section: "life",
  },
  {
    id: "reeder",
    name: "Reeder",
    description: "My choice of RSS + Read later app in one.",
    iconSrc: "/stack/reeder.jpg",
    href: "https://www.reederapp.com",
    section: "life",
  },
  {
    id: "mymind",
    name: "Mymind",
    description:
      "Everything I like/find inspiring/want to refer later, goes to mymind.",
    iconSrc: "/stack/mymind.jpg",
    href: "https://mymind.com",
    section: "life",
  },
] satisfies StackItem[];
