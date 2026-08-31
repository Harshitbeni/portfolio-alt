import type { IconName } from "@/lib/icon-context";
import { WORK_ITEMS, type WorkMediaItem } from "@/lib/work";

const ASSET = "/work/privado-mobile-app-scan";

export const projectExperimentalIllustrationAlts: Partial<
  Record<string, string>
> = {
  "what-is-privado":
    "Privado turning a codebase into data maps, third parties, and privacy risks",
  "whats-the-gap": "Web apps can be scanned; mobile apps cannot",
  "whos-the-user": "Privacy teams spanning teams, legal, platforms, and regions",
  "current-experience": "Manual spreadsheet used to map mobile app data flows",
};

export type ProjectExperimentalTeamMember = {
  name: string;
  role: string;
  image?: string;
};

export type ProjectExperimentalRow = {
  id: string;
  heading: string;
  body: string;
  icon: IconName;
  section?: string;
};

export const projectExperimentalTitle =
  "Unlocking New Revenue Stream with Privado Mobile App Scanning";

export const projectExperimentalTeam: ProjectExperimentalTeamMember[] = [
  {
    name: "Harshit Beniwal",
    role: "Product Designer",
    image: `${ASSET}/portrait-black-and-white.png`,
  },
  {
    name: "Nitin Garg",
    role: "Head of Design",
    image: `${ASSET}/privado-team-photo.jpg`,
  },
  {
    name: "Vaibhav Antil",
    role: "CEO",
  },
];

export const projectExperimentalRows: ProjectExperimentalRow[] = [
  {
    id: "what-is-privado",
    section: "Problem",
    heading: "What is Privado?",
    body: "Privado is a platform that scans codebases with its proprietary code-scan engine to map data flows and catch privacy risks before they ship.",
    icon: "shield",
  },
  {
    id: "whats-the-gap",
    heading: "What's the gap?",
    body: "Code-scan works perfectly for web apps, but not at all for mobile apps. This meant losing half of our market, as they were unable to use Privado.",
    icon: "split",
  },
  {
    id: "whos-the-user",
    section: "Research",
    heading: "Who's the user?",
    body: "Privacy teams are spread thin. Testing multiple apps across different platforms and geographies. Privacy teams usually have to punch above their weight. While Privado helps them automate a lot of efforts, mobile apps are not one of them.",
    icon: "users",
  },
  {
    id: "current-experience",
    heading: "Current Experience",
    body: "---",
    icon: "monitor",
  },
  {
    id: "explorations",
    section: "Explorations",
    heading: "Explorations",
    body: "After Privado scans a codebase, it identifies the data flows that provide all the granular details required by a privacy team: data elements, third parties, and databases. It does this automatically. For mobile apps, we aimed to create a manual method for inputting all the objects (data elements, third parties, databases).",
    icon: "lightbulb",
  },
  {
    id: "knowledge-graph",
    heading: "Knowledge Graph",
    body: "---",
    icon: "network",
  },
  {
    id: "cluster-groups",
    heading: "Cluster Groups",
    body: "---",
    icon: "layers",
  },
  {
    id: "tree-maps",
    heading: "Tree Maps",
    body: "---",
    icon: "tree",
  },
  {
    id: "abstractions-vs-simulations",
    heading: "Abstractions vs Simulations",
    body: "---",
    icon: "compare",
  },
  {
    id: "upload-mobile-apps",
    section: "Solution",
    heading: "Upload mobile apps and start testing user journeys",
    body: "---",
    icon: "upload",
  },
  {
    id: "versioning",
    heading: "Versioning across different builds",
    body: "---",
    icon: "git",
  },
  {
    id: "recording-journeys",
    heading: "Recording user journeys to test for compliance",
    body: "---",
    icon: "record",
  },
  {
    id: "perfecting-the-toolbar",
    heading: "Perfecting the Toolbar",
    body: "---",
    icon: "sliders-horizontal",
  },
  {
    id: "complete-visibility",
    heading: "Complete visibility into mobile apps",
    body: "---",
    icon: "eye",
  },
  {
    id: "speeding-up-test-recording",
    heading: "Speeding up Test Recording",
    body: "---",
    icon: "rocket",
  },
  {
    id: "winning-customers",
    section: "Results",
    heading: "Winning 5 new enterprise customers",
    body: "---",
    icon: "star",
  },
];

export const projectExperimentalSections = projectExperimentalRows.reduce<
  { id: string; label: string }[]
>((sections, row) => {
  if (!row.section) return sections;
  const id = row.section.toLowerCase();
  if (!sections.some((section) => section.id === id)) {
    sections.push({ id, label: row.section });
  }
  return sections;
}, []);

export const projectExperimentalHeroMedia: WorkMediaItem[] = (
  WORK_ITEMS.find((item) => item.id === "privado")?.media.filter(
    (item) => item.id === "mobile-app-privacy",
  ) ?? []
).map((item) => ({ ...item, href: undefined, caption: [] }));

