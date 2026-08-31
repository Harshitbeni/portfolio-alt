import type { CaseStudy } from "./types";

const BASE = "/work/thursday";

function img(
  filename: string,
  alt: string,
  width: number,
  height: number,
) {
  return { src: `${BASE}/${filename}`, alt, width, height };
}

export const thursdayCaseStudy: CaseStudy = {
  slug: "thursday",
  title: "Thursday",
  subtitle:
    "Reimagining a new way for remote teams to socialize, connect, and build a strong culture. Beyond video calls",
  accent: "purple",
  role: "I was the founding designer and led product and brand design for Thursday.",
  team: [
    { name: "Nishith Shah", role: "CEO" },
    { name: "Deepa Shah", role: "Co-founder" },
    { name: "Rucha Joshi", role: "Designer" },
    { name: "Jahnavi Patel", role: "Designer" },
    { name: "Meeth Panchal", role: "Designer" },
  ],
  links: [{ label: "Thursday", href: "https://thursday.social" }],
  timeline: "2021–2023",
  goalsStatement: "Helping remote teams build a strong culture",
  gap: {
    heading: "What's the gap?",
    paragraphs: [
      "With the future of work going remote, everyone was busy building tools to make 'work' better. But what about everything else? Casual chats, coffee breaks, and game sessions with the team?",
    ],
  },
  goals: [
    {
      number: 1,
      question: "Why does socialising online feel so awkward?",
    },
    {
      number: 2,
      question:
        "How do we design for spontaneity when everything is structured and scheduled?",
    },
    {
      number: 3,
      question:
        "How might we create an experience that feels as close to in-real-life socializing?",
    },
  ],
  research: {
    heading: "What's going on in the world of remote work?",
    context: [
      "Remote work made us more productive. However, the Great Resignation showed us that something was breaking. People were connecting to their work, but were disconnected from each other.",
      "We interviewed 25+ remote workers to understand why.",
    ],
    insightsHeading: "Top Three Insights",
    insights: [
      "Relying on video conferencing tools for remote socializing",
      "Unequal participation dominated by outspoken individuals",
      "Difficulty for organizers to regularly host engaging socials",
    ],
    quote:
      "When everyone is on mute, hosting a happy hour feels more disappointing than not hosting it at all",
    personasHeading: "Two users, two different problems",
    personasIntro:
      "Our research kept pointing to two groups experiencing remote socials very differently. One dreading them, and the other struggling to run them.",
    personas: [
      {
        id: "employees",
        title: "Employees",
        emoji: ["Feels isolated 😔", "Overly focused on work 💻"],
        summary:
          "Wants to connect with teammates but dreads another Zoom call after a long workday.",
        image: img("persona-employee.jpg", "Employee persona", 790, 790),
        tabs: [
          {
            id: "pain",
            label: "Pain",
            items: [
              "Feels isolated from teammates",
              "Overly focused on work with little social connection",
              "Dreads scheduled video socials after a long workday",
            ],
          },
          {
            id: "needs",
            label: "Needs",
            items: [
              "Low-pressure ways to connect casually",
              "Social experiences that don't feel like another meeting",
              "Opportunities to bond without performing",
            ],
          },
          {
            id: "goals",
            label: "Goals",
            items: [
              "Feel part of the team culture",
              "Connect with colleagues authentically",
              "Participate without being in the spotlight",
            ],
          },
        ],
      },
      {
        id: "organisers",
        title: "Organisers",
        emoji: ["Organising difficulties 📅", "Finding activities 🔍"],
        summary:
          "Wants to build team culture but is unable to do so effectively as it's hard to find engaging activities.",
        image: img("persona-organiser.jpeg", "Organiser persona", 790, 790),
        tabs: [
          {
            id: "pain",
            label: "Pain",
            items: [
              "Hard to schedule and coordinate team socials",
              "Difficult to find engaging activities everyone enjoys",
              "Low participation makes hosting feel unrewarding",
            ],
          },
          {
            id: "needs",
            label: "Needs",
            items: [
              "Easy tools to plan and run socials",
              "Activity templates that work out of the box",
              "Visibility into team engagement",
            ],
          },
          {
            id: "goals",
            label: "Goals",
            items: [
              "Build a strong remote team culture",
              "Run socials people actually look forward to",
              "Make participation feel natural for everyone",
            ],
          },
        ],
      },
    ],
  },
  process: {
    heading: "Rethinking Remote Socials",
    intro:
      "Our research had made things clear and pointed out three core problems:",
    pillars: [
      {
        title: "Unequal Participation",
        description:
          "Designing interactions that allow for everyone to participate in the social.",
        features: [
          {
            title: "Group activities",
            description: "Team building with a twist",
          },
          {
            title: "Icebreakers",
            description: "Getting rid of the awkward silences",
          },
          {
            title: "Polls",
            description:
              "Turning normal talking affordances to interactive experiences",
          },
        ],
        images: [
          img("thursday-icebreakers.png", "Thursday icebreakers", 2384, 1626),
        ],
      },
      {
        title: "Difficulty Organising",
        description:
          "Making it easy for hosts to schedule, host and reflect on team socials.",
        features: [
          {
            title: "Summaries",
            description: "To keep an eye on how well your org is engaging",
          },
          {
            title: "Quick start",
            description: "Removing all hinderances from starting socials",
          },
          {
            title: "Customisability",
            description: "Every team is different",
          },
        ],
        images: [
          img(
            "thursday-calendar-app-illustration.png",
            "Calendar app illustration",
            288,
            272,
          ),
        ],
      },
      {
        title: "Rigid Video Calls",
        description: "Turning passive participation to active engagement.",
        features: [
          {
            title: "Shared experiences",
            description: "Watching movie, listening to music together",
          },
          {
            title: "Diverse activities",
            description: "You'll never be bored again",
          },
          {
            title: "Discussion topics",
            description:
              "Steering conversations to be more inclusive and thoughtful",
          },
        ],
        images: [
          img("thursday-video-call.png", "Thursday video call", 520, 280),
          img("television.jpg", "Shared television experience", 940, 306),
        ],
      },
    ],
    prototypeNote:
      "With these ideas, we prototyped extensively. From Figma prototypes to wizard-of-Oz-esque trials of our concepts.",
    betaNote: "In under three months, we launched our beta.",
    images: [
      img("thursday-sketches.png", "Early Thursday sketches", 4096, 2495),
      img("thursday-sketch-02.png", "Thursday sketch exploration", 2904, 2858),
      img("thursday-wireframes.png", "Thursday wireframes", 3116, 1552),
      img(
        "thursday-wireframe-sketch.png",
        "Thursday wireframe sketch",
        3336,
        1916,
      ),
      img("flowchart-sketch.png", "Process flowchart sketch", 4096, 1175),
    ],
  },
  buildingInPublic: {
    heading: "Building in Public",
    paragraphs: [
      "We launched our beta publicly. On Twitter and LinkedIn, we sent public invites for everyone to join our first social. It was a massive risk, but also a huge opportunity to stress-test and get real feedback from real users.",
    ],
    video: {
      src: `${BASE}/building-in-public.mp4`,
      alt: "Thursday beta launch — building in public",
    },
  },
  solution: {
    heading: "Solution",
    thesisHeading: "Real conversations happen in small groups",
    thesis:
      "Real conversations happen in small groups. Socializing is more effective in small groups. However, splitting people apart without a shared space didn't feel like a team anymore.",
    comparisonHeading: "Online spaces that feel like a room",
    comparisonIntro:
      "We wanted to find a balance between the rigidity of Zoom that makes it ineffective for social events and the complexity of tools like Gather Town that make it cumbersome.",
    comparisonProducts: [
      {
        name: "Zoom",
        logo: img("zoom-logo.png", "Zoom logo", 1024, 1024),
        scores: { spatial: 1, simple: 4, speed: 5 },
      },
      {
        name: "Gather Town",
        logo: img("gather-logo.jpg", "Gather Town logo", 400, 400),
        scores: { spatial: 5, simple: 2, speed: 2 },
      },
      {
        name: "Thursday",
        logo: img("thursday-logo.png", "Thursday logo", 264, 264),
        scores: { spatial: 4, simple: 4, speed: 4 },
      },
    ],
    usercard: {
      heading: "Usercard",
      description:
        "What if moving through an online space was as simple as moving your cursor? Usercards let you do exactly that. Move around a room, cluster with people, and drift between conversations.",
      image: img("usercard.png", "Thursday usercard interface", 4096, 1724),
    },
    lounge: {
      heading: "Lounge in Thursday",
      description:
        "Lounge is Thursday's shared space, like a real office lounge. Move your cursor to move through the room, everyone's presence is felt.",
      image: img("lounge-screenshot.png", "Thursday lounge", 1988, 352),
    },
    participation: {
      heading: "Multiple ways to participate",
      description:
        "Not everyone socializes in the same way. Some people want face time, others prefer typing, and some just want to react with an emoji and vibe. Lounge was designed with multiple ways to participate, so no one gets left out.",
      modes: [
        "Ephemeral chat & reactions",
        "Hop on stage for facetime",
        "Move around the lounge",
      ],
      image: img(
        "participation-modes.png",
        "Participation modes in Thursday lounge",
        1792,
        354,
      ),
    },
    mixers: {
      heading: "Socializing works better when you're having fun",
      description:
        "Lounge breaks out into smaller groups that we call mixers, with one goal: to maximize conversations! Every mixer was thoughtfully designed with its own concept, goals, and nuances.",
      wyr: {
        heading: "Would you rather",
        description:
          'The interactions were designed to make you feel as if you are not interacting with a screen. For example: instead of pressing a button to select an option in "Would You Rather", you actually move your video card to that side, similar to how you would if you were playing this game in real-life in a room.',
        beforeImage: img(
          "thursday-would-you-rather.png",
          "Normal would you rather",
          3836,
          1692,
        ),
        afterImage: img(
          "thursday-mixer-would-you-rather.png",
          "Would you rather in Thursday",
          2732,
          1536,
        ),
      },
      gallery: [
        img(
          "thursday-mixer-drunk-startups.png",
          "Drunk Startups mixer",
          2732,
          1536,
        ),
        img("thursday-mixer-charades.png", "Charades mixer", 2732, 1536),
        img(
          "thursday-mixer-doodle-race.png",
          "Doodle Race mixer",
          2732,
          1536,
        ),
        img(
          "thursday-mixer-would-you-rather.png",
          "Would you Rather mixer",
          2732,
          1536,
        ),
      ],
      galleryCaption: "Various Mixers in Thursday",
    },
    hosting: {
      heading: "Hosting without the headache",
      description:
        "Hosts always found it tough to schedule, organize, and manage remote socials. We made their jobs easier with our dashboard. One click to schedule socials, templates to pick different activities, and a Slack bot that invites the team and shares highlights of the social afterward.",
      dashboardImage: img(
        "dashboard-scheduling.png",
        "Scheduling a social with templates",
        1946,
        538,
      ),
      dashboardCaption: "Scheduling a social, made simple with templates.",
      slackbotImage: img(
        "slackbot.png",
        "Thursday Slackbot social summary",
        1886,
        352,
      ),
      slackbotCaption: "Thursday Slackbot sends social summaries",
    },
    closing:
      "Lounge, Mixers, and Dashboard — together, these three pieces gave remote teams something they'd been missing. Remote socials that people look forward to.",
    youtube: {
      heading: "A quick peek inside Thursday",
      videoId: "Fjvin-dOuV8",
    },
    demoVideo: {
      src: `${BASE}/product-demo.mp4`,
      alt: "Thursday product demo",
    },
  },
  results: {
    heading: "Result",
    awardHeading: "Winning Product of the Year Award",
    stats: [
      { value: "1,000+", label: "teams using thursday" },
      { value: "10,000+", label: "socials hosted" },
    ],
    rating: "4.8/5 overall",
    summary:
      "In under two years, Thursday became the go-to platform for over 1,000 remote teams—hosting 10,000+ socials and earning Product Hunt's Product of the Year (Golden Kitty) award. More importantly it was loved by all its users:",
    productHuntBadge: img(
      "product-hunt-golden-kitty.svg",
      "Product Hunt Golden Kitty Award",
      250,
      54,
    ),
    testimonial: {
      quote:
        "A lot of tools have tried to create the energy that Thursday has, but I don't think that anyone has come close to what Thursday is doing.",
      name: "Sarah Park",
      role: "Head of people",
      company: "Geneva",
      image: img(
        "testimonial-sarah-park.webp",
        "Sarah Park testimonial",
        1080,
        672,
      ),
    },
    creditsHeading: "This project would not have been possible without",
    creditsSubheading: [
      "my team",
      "my founders who always pushed me",
      "my fellow designers",
    ],
    collage: [
      img("testimonial-quote-01.png", "Team testimonial", 2880, 500),
      img("testimonial-quote-02.png", "Team testimonial", 1908, 354),
      img("testimonial-quote-03.png", "Team testimonial", 1714, 354),
      img("testimonial-quote-05.png", "Team testimonial", 906, 272),
      img("testimonial-quote-06.png", "Team testimonial", 1860, 452),
      img("testimonial-quote-07.png", "Team testimonial", 1038, 308),
      img("testimonial-quote-08.png", "Team testimonial", 1878, 354),
      img("testimonial-quote-09.png", "Team testimonial", 1696, 306),
      img("testimonial-quote-10.png", "Team testimonial", 1454, 306),
      img("testimonial-quote-11.png", "Team testimonial", 1162, 306),
      img("testimonial-quote-12.png", "Team testimonial", 1658, 232),
      img("testimonial-quote-14.png", "Team testimonial", 1166, 306),
      img("testimonial-quote-15.png", "Team testimonial", 1896, 402),
      img("testimonial-quote-16.png", "Team testimonial", 1714, 596),
      img("testimonial-quote-18.png", "Team testimonial", 1042, 308),
    ],
    teamPhoto: img("thursday-team-photo.jpg", "Thursday team", 790, 790),
  },
};
