import type { BlockCaseStudy } from "@/lib/case-studies/block-types";

const ASSET = "/work/privado-assessments";

const FIGMA_PROTO =
  "https://www.figma.com/proto/DljZCMBWOhLRh5Pv13i5JG/Assessments---Redesign?page-id=796%3A14235&node-id=796-16360&node-type=frame&viewport=-1992%2C640%2C0.32&t=sWgAczWL0ZMWBIBF-8&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=796%3A16360&hide-ui=1";

const DASHBOARD_IMAGE = `${ASSET}/privado-dashboard-screenshot-03.png`;

const COGNITIVE_ANNOTATIONS = [
  {
    number: 2,
    x: 31,
    y: 20,
    text: "Approver, Requested by and respondents could be clubbed together",
  },
  {
    number: 1,
    x: 39,
    y: 10,
    text: "Assessment and Repository name repeated",
  },
  {
    number: 4,
    x: 84,
    y: 6,
    text: "Save state isolated and no progress aparent.",
  },
  {
    number: 5,
    x: 79,
    y: 93,
    text: "Submit detached from all other important peices of information.",
  },
  {
    number: 3,
    x: 79,
    y: 16,
    text: "Share is unclear and could be part of the main status bar",
  },
];

const READABILITY_ANNOTATIONS = [
  {
    number: 2,
    x: 79,
    y: 39,
    text: "Line width too wide. Hindering readability.",
  },
  {
    number: 1,
    x: 21,
    y: 23,
    text: "No distinction on what type of questions am I answering.",
  },
  {
    number: 3,
    x: 84,
    y: 18,
    text: "Share, an important part of assessments missed out",
  },
];

const STATUSES_ANNOTATIONS = [
  {
    number: 3,
    x: 77,
    y: 12,
    text: "Assessment name + Sender",
  },
  {
    number: 1,
    x: 23,
    y: 7,
    text: "privado logo + saved state",
  },
  {
    number: 2,
    x: 21,
    y: 16,
    text: "More detail + Share",
  },
  {
    number: 4,
    x: 21,
    y: 93,
    text: "Submit",
  },
];

export const privadoAssessments: BlockCaseStudy = {
  slug: "privado-assessments",
  title: "Privacy Assessments",
  subtitle:
    "Turning an unwanted chore that takes months to complete into a streamlined workflow that is done within a week.",
  heroMedia: {
    type: "image",
    src: `${ASSET}/hero-dashboard.png`,
    alt: "Privado privacy assessments dashboard",
    width: 2676,
    height: 1600,
  },
  sections: [
    {
      id: "details",
      label: "Details",
      blocks: [
        {
          type: "qa-group",
          items: [
            {
              question: "What's Privado?",
              answer:
                "Privado is a platform that automates privacy compliance and governance by scanning code to map data flows, identify risks, and embed privacy into your software development lifecycle.",
            },
            {
              question: "What are Privacy Assessments?",
              answer:
                "Assessments are how teams evaluate their privacy health, generate reports, and submit them for compliance with mandates, for example, the General Data Protection Regulation (GDPR) in EU.",
            },
          ],
        },
        {
          type: "paragraph",
          text: "Traditionally, Data Privacy Officers (DPOs) conduct privacy assessments manually, collaborating with engineering teams to understand how user data is managed within their companies. This process typically takes up to 6 months to complete. With Privado, we aimed to leverage code-scanning to automate this process, creating an experience that is significantly faster.",
        },
        {
          type: "paragraph",
          tone: "primary",
          text: "My role involved leading the redesign to increase the usage of Privacy Assessments within Privado's suite of privacy tools.",
        },
        {
          type: "team",
          members: [
            {
              name: "Harshit Beniwal",
              role: "Product Designer",
              image: `${ASSET}/harshit.webp`,
            },
            {
              name: "Nitin Garg",
              role: "Head of Design",
              image: `${ASSET}/nitin.png`,
            },
          ],
        },
        {
          type: "links",
          links: [
            {
              label: "Smart Assessments",
              href: "https://www.privado.ai/products/smart-assessments",
              icon: `${ASSET}/code-icon.png`,
              accent: true,
            },
            {
              label: "Figma prototype",
              href: FIGMA_PROTO,
              icon: `${ASSET}/figma-icon.png`,
            },
          ],
        },
        {
          type: "timeline",
          label: "Timeline",
          value: "2024 · 3 months",
        },
      ],
    },
    {
      id: "goals",
      label: "Goals",
      blocks: [
        {
          type: "heading",
          text: "Increasing Privacy Assessments usage",
          level: 2,
        },
        {
          type: "goals",
          items: [
            { text: "Improve the readability and usability of Assessments." },
            { text: "Increase the completion rate." },
            { text: "Enable collaboration in Assessments to engage engineering teams." },
            {
              text: "Allow configurations to customise an assessment",
              uncertain: true,
            },
          ],
        },
      ],
    },
    {
      id: "process",
      label: "Process",
      blocks: [
        {
          type: "heading",
          text: "Finding usability issues",
          level: 2,
        },
        {
          type: "problem-cards",
          cards: [
            {
              title: "Cognitive overload",
              description:
                "Too much information is visible at once, available at all times, even if the user intends to retrieve it or not.",
              image: DASHBOARD_IMAGE,
              annotations: COGNITIVE_ANNOTATIONS,
            },
            {
              title: "Readability",
              description:
                "Text and typography could be further refined to enhance the reading experience.",
              image: DASHBOARD_IMAGE,
              annotations: READABILITY_ANNOTATIONS,
            },
            {
              title: "Statuses",
              description:
                "Information could be represented in a way that fits the user's mental model and is not scattered all over the interface.",
              image: DASHBOARD_IMAGE,
              annotations: STATUSES_ANNOTATIONS,
            },
          ],
        },
        {
          type: "paragraph",
          text: "With a simple heuristic evaluation, we identified several areas for improvement in the current design. These range from clear enhancements, such as reducing text width, to more ambiguous issues, like creating a better information architecture.",
        },
        {
          type: "heading",
          text: "Iterating Layout and Information Architecture",
          level: 2,
        },
        {
          type: "media",
          media: {
            type: "image",
            src: `${ASSET}/design-iterations.gif`,
            alt: "Design layout iterations",
            width: 1920,
            height: 1366,
            framed: true,
            caption: "iterate, iterate, iterate…",
          },
        },
        {
          type: "paragraph",
          text: "Once we had a good idea of the trade-offs of different layouts, we finalized one and refined it further. With the new layout, we improved the readability and comprehension of the assessment.",
        },
        {
          type: "media",
          media: {
            type: "image",
            src: `${ASSET}/ia-wireframe-before.png`,
            alt: "Previous information architecture wireframe",
            width: 520,
            height: 166,
            caption: "Previous information architecture",
          },
        },
        {
          type: "media",
          media: {
            type: "image",
            src: `${ASSET}/ia-wireframe-after.png`,
            alt: "Improved redesign wireframe",
            width: 520,
            height: 225,
            caption: "Improved redesign",
          },
        },
        {
          type: "paragraph",
          text: "We provided better structure with sections that inform them about the types of questions being asked in it and an Info Bar that collates all the information about assessments and presents it in a neatly organized view.",
        },
      ],
    },
    {
      id: "solution",
      label: "Solution",
      blocks: [
        {
          type: "heading",
          text: "Basic Form → Comprehensive Tool for Privacy Assessments",
          level: 2,
        },
        {
          type: "paragraph",
          text: "Once we had our layout and structure in place, we started asking questions about how to turn assessments into the command center for privacy teams, the place where they operate their workflows for gathering privacy data from their organization.",
        },
        {
          type: "paragraph",
          text: "We looked at user feedback and the problems usually encountered by our customer success teams when helping our customers to onboard or fill out assessments.",
        },
        {
          type: "feature",
          title: "Progress widget",
          media: {
            type: "video",
            src: `${ASSET}/progress-widget.mp4`,
            alt: "Progress widget demo",
            loop: true,
            muted: true,
            usePlayer: true,
            caption:
              "Progress widget: a widget where users can get all the information they need: total questions, filters, and completed questions.",
          },
        },
        {
          type: "feature",
          title: "Collapsible section",
          media: {
            type: "video",
            src: `${ASSET}/collapsible-section.mp4`,
            alt: "Collapsible section demo",
            loop: true,
            muted: true,
            usePlayer: true,
            caption:
              "Collapsible section: collapse sections that you don't have to answer. Focus on the ones you do.",
          },
        },
        {
          type: "feature",
          title: "Question Flags",
          media: {
            type: "video",
            src: `${ASSET}/question-flags.mp4`,
            alt: "Question flags demo",
            loop: true,
            muted: true,
            usePlayer: true,
            caption:
              "Question Flags: flag questions that are incorrect or inapplicable.",
          },
        },
        {
          type: "feature",
          title: "Comments",
          media: {
            type: "video",
            src: `${ASSET}/comments.mp4`,
            alt: "Comments demo",
            loop: true,
            muted: true,
            usePlayer: true,
            caption:
              "Comments: start a discussion with your teammates right inside Privado.",
          },
        },
        {
          type: "feature",
          title: "Quick Scroll",
          media: {
            type: "video",
            src: `${ASSET}/quick-scroll.mp4`,
            alt: "Quick scroll demo",
            loop: true,
            muted: true,
            usePlayer: true,
            caption:
              "Quick Scroll: move quickly between long sections. There's no stopping you.",
          },
        },
        {
          type: "feature",
          title: "Assignees",
          media: {
            type: "video",
            src: `${ASSET}/assignees.mp4`,
            alt: "Assignees demo",
            loop: true,
            muted: true,
            usePlayer: true,
            caption:
              "Assignees: assign questions or sections to the right people on your team.",
          },
        },
        {
          type: "feature",
          title: "Filters",
          media: {
            type: "video",
            src: `${ASSET}/filters.mp4`,
            alt: "Filters demo",
            loop: true,
            muted: true,
            usePlayer: true,
            caption:
              "Filters: focus on the right questions, whether they are unanswered, mandatory, or assigned to you.",
          },
        },
        {
          type: "feature",
          title: "Info Bar",
          media: {
            type: "video",
            src: `${ASSET}/info-bar.mp4`,
            alt: "Info bar demo",
            loop: true,
            muted: true,
            usePlayer: true,
            caption:
              "Info Bar: all the information our users need, neatly arranged in one single place.",
          },
        },
      ],
    },
    {
      id: "results",
      label: "Results",
      blocks: [
        {
          type: "heading",
          text: "Turned an abandoned feature into the most used one",
          level: 2,
        },
        {
          type: "paragraph",
          text: "This massive redesign not only addressed the design issues but also transformed Assessments into a crucial component of Privado. It helps privacy teams assess their privacy health and maintain compliance within a few days, rather than the typical 6 months it usually took.",
        },
        {
          type: "stats",
          intro: "Time to complete",
          stats: [
            { value: "~6", label: "Months" },
            { value: "1", label: "Week" },
          ],
        },
        {
          type: "stats",
          stats: [{ value: "3x", label: "Teams using Assessments" }],
        },
      ],
    },
    {
      id: "next",
      label: "Next steps",
      blocks: [
        {
          type: "heading",
          text: "Future of Assessments is one where you don't need to do them manually",
          level: 2,
        },
        {
          type: "paragraph",
          text: "This project was version 1.0. As we observe how our customers use and interact with this upgraded version of Assessments, we identified several opportunities to make it even better.",
        },
        {
          type: "cards",
          cards: [
            {
              title: "Templates",
              description: "Allow data protection officers to customise the questions.",
              icon: `${ASSET}/templates-icon.png`,
            },
            {
              title: "Integrations",
              description: "Connect with other privacy tools like OneTrust.",
              icon: `${ASSET}/integrations-icon.png`,
            },
            {
              title: "Agentic Assessments",
              description: "Auto-populate assessments with agents and code-scan.",
              icon: `${ASSET}/agentic-icon.png`,
            },
          ],
        },
        {
          type: "credits",
          text: "This project would not have been possible without my team, my manager and mentor",
          links: [
            {
              label: "Nitin Garg",
              href: "https://x.com/nitinmgarg",
            },
            {
              label: "Privado",
              href: "https://privado.ai",
              accent: true,
            },
          ],
        },
      ],
    },
  ],
};
