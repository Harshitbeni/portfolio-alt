export type StackItem = {
  id: string;
  name: string;
  description: string;
  iconSrc: string;
  href: string;
};

export const STACK_ITEMS = [
  {
    id: "1password",
    name: "1Password",
    description: "Password manager that does the job well.",
    iconSrc: "/stack/1password.png",
    href: "https://1password.com/",
  },
  {
    id: "bike",
    name: "Bike",
    description:
      "Outliners match how I think. This is a simple, fast and native outliner.",
    iconSrc: "/stack/bike.png",
    href: "https://hogbaysoftware.com/bike/",
  },
  {
    id: "cron",
    name: "Cron",
    description:
      "Clean and to the point calendar with built-in scheduling functionality.",
    iconSrc: "/stack/cron.png",
    href: "https://cron.com",
  },
  {
    id: "figma",
    name: "Figma",
    description:
      "Use it at work. Systems, Components, and Auto-layout make it perfect for teams.",
    iconSrc: "/stack/figma.png",
    href: "https://figma.com",
  },
  {
    id: "framer",
    name: "Framer",
    description:
      "This website, v3 was made three years ago in Framer from scratch.",
    iconSrc: "/stack/framer.png",
    href: "https://www.framer.com",
  },
  {
    id: "lookaway",
    name: "Lookaway",
    description: "Pomodoro timer that forces me to look away.",
    iconSrc: "/stack/lookaway.png",
    href: "https://lookaway.app",
  },
  {
    id: "mymind",
    name: "Mymind",
    description:
      "Everything I like/find inspiring/want to refer later, goes to mymind.",
    iconSrc: "/stack/mymind.png",
    href: "https://mymind.com",
  },
  {
    id: "noir",
    name: "Noir",
    description:
      "Dark mode every website at night. Works and syncs across all my devices.",
    iconSrc: "/stack/noir.png",
    href: "https://getnoir.app",
  },
  {
    id: "oneswitch",
    name: "OneSwitch",
    description: "All my important toggles available in a single click.",
    iconSrc: "/stack/oneswitch.png",
    href: "https://fireball.studio/oneswitch",
  },
  {
    id: "raycast",
    name: "Raycast",
    description: "Spotlight replacement on steroid.",
    iconSrc: "/stack/raycast.png",
    href: "https://www.raycast.com",
  },
  {
    id: "reeder",
    name: "Reeder",
    description: "My choice of RSS + Read later app in one.",
    iconSrc: "/stack/reeder.jpg",
    href: "https://www.reederapp.com",
  },
  {
    id: "sleeve",
    name: "Sleeve",
    description: "Quick music controls and Last.fm scrobbling.",
    iconSrc: "/stack/sleeve.png",
    href: "https://replay.software/sleeve",
  },
  {
    id: "swish",
    name: "Swish",
    description: "Window management through gestures.",
    iconSrc: "/stack/swish.png",
    href: "https://highlyopinionated.co/swish/",
  },
  {
    id: "things-3",
    name: "Things 3",
    description: "Quintessential Personal task manager.",
    iconSrc: "/stack/things.png",
    href: "https://culturedcode.com/things/",
  },
] satisfies StackItem[];
