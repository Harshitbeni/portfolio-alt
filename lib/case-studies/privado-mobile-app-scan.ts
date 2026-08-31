import type { BlockCaseStudy } from "@/lib/case-studies/block-types";

const ASSET = "/work/privado-mobile-app-scan";

export const privadoMobileAppScan: BlockCaseStudy = {
  slug: "privado-mobile-app-scan",
  title: "Unlocking New Revenue Stream with Privado Mobile App Scanning",
  subtitle:
    "We were losing 50% of the market as Privado couldn't touch mobile apps. I led the design for the Privado Mobile App Scan that changed that.",
  heroMedia: {
    type: "video",
    src: `${ASSET}/hero-mobile-scan-demo.mp4`,
    alt: "Privado mobile app scan demo",
    loop: true,
    muted: true,
    controls: false,
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
                "Privado is a platform that scans codebases with its proprietary code-scan engine to map data flows and catch privacy risks before they ship.",
            },
            {
              question: "What's the gap?",
              answer:
                "Code-scan works perfectly for web apps, but not at all for mobile apps. This meant losing half of our market, as they were unable to use Privado.",
            },
            {
              question: "What was my role?",
              answer:
                "I led the end-to-end design, collaborating with the engineering and product teams to bring Privado's privacy tools to mobile apps.",
            },
          ],
        },
        {
          type: "team",
          members: [
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
          ],
        },
        {
          type: "links",
          links: [
            {
              label: "Mobile App Privacy",
              href: "https://www.privado.ai/solutions/mobile-app-privacy",
              icon: `${ASSET}/code-icon.png`,
              accent: true,
            },
            {
              label: "Prototype",
              href: "https://www.figma.com/proto/viaNGzesnZ8VqNt9LwBAEz/Mobile-App-Scanning?page-id=1%3A75&node-id=1-1947&viewport=2040%2C739%2C0.77&t=d9JeItXLP6TEgseY-8&scaling=contain&content-scaling=responsive&starting-point-node-id=1%3A1947&hide-ui=1",
              icon: `${ASSET}/figma-app-icon.png`,
            },
          ],
        },
        {
          type: "timeline",
          label: "Timeline",
          value: "2024 — 2 month",
        },
      ],
    },
    {
      id: "context",
      label: "Context",
      blocks: [
        {
          type: "heading",
          text: "Privacy teams are spread thin",
          level: 2,
        },
        {
          type: "paragraph",
          text: "Testing multiple apps across different platforms and geographies. Privacy teams usually have to punch above their weight. While Privado helps them automate a lot of efforts, mobile apps are not one of them.",
        },
        {
          type: "cards",
          cards: [
            {
              title: "Limited Resources",
              description:
                "Small teams juggling compliance across multiple apps, platforms and regional laws.",
            },
            {
              title: "Non-technical",
              description:
                "Usually from a legal background. Can't build tests and verify what developers claim.",
            },
          ],
        },
        {
          type: "quote",
          text: "I am basically trusting what the developers tell me",
        },
      ],
    },
    {
      id: "goals",
      label: "Goals",
      blocks: [
        {
          type: "heading",
          text: "Allow privacy teams to scan mobile apps",
          level: 2,
        },
        { type: "web-mobile-scan-diagram" },
        {
          type: "paragraph",
          text: "Privado has no way of reading mobile apps",
        },
      ],
    },
    {
      id: "process",
      label: "Process",
      blocks: [
        {
          type: "heading",
          text: "Finding a way to manually map mobile apps",
          level: 2,
        },
        {
          type: "paragraph",
          text: "After Privado scans a codebase, it identifies the data flows that provide all the granular details required by a privacy team: data elements, third parties, and databases. It does this automatically. For mobile apps, we aimed to create a manual method for inputting all the objects (data elements, third parties, databases).",
        },
        {
          type: "paragraph",
          text: "Balancing abstractions and complexity to find the perfect trade-offs.",
        },
        {
          type: "feature",
          title: "Knowledge Graph",
          description:
            "Each object represented with its own node. Connections show dataflow from source to sink.",
          items: [
            { text: "A true representation of the application", tone: "positive" },
            { text: "Needs knowledge of technical architecture", tone: "negative" },
          ],
          media: {
            type: "image",
            src: `${ASSET}/flowchart-screenshot.png`,
            alt: "Knowledge graph exploration",
            width: 2672,
            height: 1640,
          },
        },
        {
          type: "feature",
          title: "Cluster Groups",
          description:
            "Objects from similar family (user journey, features) grouped together.",
          items: [
            { text: "Similar representation as a knowledge graph", tone: "positive" },
            { text: "More structured interface with progressive disclosure", tone: "positive" },
            { text: "Still needs an architectural knowledge of the mobile app", tone: "negative" },
          ],
          media: {
            type: "image",
            src: `${ASSET}/ethindia-flowchart-03.png`,
            alt: "Cluster groups exploration",
            width: 2672,
            height: 1640,
          },
        },
        {
          type: "feature",
          title: "Tree Map",
          description:
            "A more hierarchal view that allows you to drill in and see details as needed.",
          items: [
            { text: "Abstracts the architecture into simpler representations like pages", tone: "positive" },
            { text: "Still needs an architectural knowledge of the mobile app", tone: "negative" },
          ],
          media: {
            type: "image",
            src: `${ASSET}/dashboard-screenshot-03.png`,
            alt: "Tree map exploration",
            width: 2672,
            height: 1600,
          },
        },
        {
          type: "heading",
          text: "Simulating mobile apps to build data flows",
          level: 2,
        },
        {
          type: "paragraph",
          text: "All the above approaches involved an abstraction, prompting privacy teams to think in terms of technology rather than user interactions. This led us to explore a different method that simulates the app. Privacy teams interact with the app as a user would, and we obtain privacy insights by monitoring data such as network logs and app storage. Most of the insights, without scanning code or manual mapping.",
        },
        {
          type: "media",
          media: {
            type: "image",
            src: `${ASSET}/mobile-finance-screen.png`,
            alt: "Simulating mobile apps in Privado",
            caption: "Simulating mobile apps in Privado to map dataflows",
            width: 2672,
            height: 1600,
          },
        },
        {
          type: "comparison",
          heading: "Abstraction vs Simulations",
          intro:
            "These two approaches were very different, with different compromises. The main question became: comprehensive vs faster insights.",
          left: {
            title: "Abstraction",
            items: [
              "Maps the entire app, like our web code-scan, covering all flows.",
              "Need to know app architecture, technical details and manually map a majority of the app before seeing any results.",
            ],
          },
          right: {
            title: "Simulation",
            items: [
              "Record a single user journey in 5 minutes and see results almost instantly.",
              "User journeys live in isolation without a way to map dataflows between journeys.",
            ],
          },
        },
        {
          type: "list",
          items: [
            "Delivering results within a few minutes was a great value unlock for privacy teams.",
            "Single flow lets teams prioritize which flow to cover first by compliance risk.",
            "Recording a single flow meant thinking linearly, without any need to understand the app architecture.",
          ],
        },
      ],
    },
    {
      id: "solution",
      label: "Solution",
      blocks: [
        {
          type: "heading",
          text: "Upload mobile apps and start testing user journeys",
          level: 2,
        },
        {
          type: "media",
          media: {
            type: "video",
            src: `${ASSET}/hero-mobile-scan-demo.mp4`,
            alt: "Uploading a mobile app in Privado",
            autoplay: true,
            loop: true,
            muted: true,
            controls: false,
            caption: "Adding a new mobile in Privado",
          },
        },
        {
          type: "heading",
          text: "Versioning across different builds",
          level: 2,
        },
        {
          type: "media",
          media: {
            type: "video",
            src: `${ASSET}/upload-app.mp4`,
            alt: "Automatic version control",
            autoplay: true,
            loop: true,
            muted: true,
            controls: false,
            caption: "Automatic version control",
          },
        },
        {
          type: "media",
          media: {
            type: "video",
            src: `${ASSET}/versioning.mp4`,
            alt: "Changes from previous app versions",
            autoplay: true,
            loop: true,
            muted: true,
            controls: false,
            caption: "Delta from previous app versions",
          },
        },
        {
          type: "paragraph",
          text: "Versioning is handled automatically using app metadata. Delta between two versions is surfaced to show what actually changed and what needs attention.",
        },
        {
          type: "heading",
          text: "Recording user journeys to test for compliance",
          level: 2,
        },
        {
          type: "media",
          media: {
            type: "video",
            src: `${ASSET}/recording-journey.mp4`,
            alt: "Recording a user journey",
            autoplay: true,
            loop: true,
            muted: true,
            controls: false,
          },
        },
        {
          type: "paragraph",
          text: "Testing mobile apps in Privado is as simple as recording a user journey. Simply perform actions and Privado records various actions, and the resulting data flows. Recorded 'Tests' are saved and can be rerun to automatically test new updates.",
        },
        {
          type: "heading",
          text: "Perfecting the Toolbar",
          level: 2,
        },
        {
          type: "media",
          media: {
            type: "video",
            src: `${ASSET}/toolbar-recording.mp4`,
            alt: "Toolbar recording interaction",
            autoplay: true,
            loop: true,
            muted: true,
            controls: false,
            caption: "Modeled the toolbar around one familiar metaphor: Recording",
          },
        },
        {
          type: "paragraph",
          text: "The biggest challenge here was the toolbar. It needed to be simple enough to convey what's expected from the user and at the same time convey the different actions and states. We started by exploring a few options: placement, micro-copy, status updates and visual weight before finding the perfect balance.",
        },
        {
          type: "heading",
          text: "Complete visibility into mobile apps",
          level: 2,
        },
        {
          type: "media",
          media: {
            type: "video",
            src: `${ASSET}/overview-dashboard.mp4`,
            alt: "Mobile app overview dashboard",
            autoplay: true,
            loop: true,
            muted: true,
            controls: false,
            caption: "Mobile app Overview",
          },
        },
        {
          type: "paragraph",
          text: "Each mobile app has layers of details: SDKs, permissions, data elements, and third parties spread across multiple views. The overview dashboard surfaces what needs attention and what's changed, so the privacy team knows exactly where to dig in.",
        },
        {
          type: "heading",
          text: "Speeding up Test Recording",
          level: 2,
        },
        {
          type: "media",
          media: {
            type: "video",
            src: `${ASSET}/notes-context.mp4`,
            alt: "Notes for added context",
            autoplay: true,
            loop: true,
            muted: true,
            controls: false,
            caption: "Notes for added context",
          },
        },
        {
          type: "media",
          media: {
            type: "video",
            src: `${ASSET}/templates-recording.mp4`,
            alt: "Templates for test recordings",
            autoplay: true,
            loop: true,
            muted: true,
            controls: false,
            caption: "Templates for test recordings",
          },
        },
        {
          type: "paragraph",
          text: "We added notes to allow privacy teams to add context, steps, or any other details that might be needed in future retests.",
        },
      ],
    },
    {
      id: "results",
      label: "Results",
      blocks: [
        {
          type: "heading",
          text: "Winning 5 new enterprise customers",
          level: 2,
        },
        {
          type: "paragraph",
          text: "The mobile app scan was the final missing piece in our suite of privacy tools. Privado now covers all touchpoints: web apps, websites and now mobile apps.",
        },
        {
          type: "paragraph",
          text: "This unlocked new industries for Privado: mobile gaming, consumer apps, and e-commerce. Landing 5 new enterprise customers in a single quarter.",
        },
        {
          type: "cta",
          label: "Mobile App Privacy",
          href: "https://www.privado.ai/solutions/mobile-app-privacy",
        },
      ],
    },
  ],
};
