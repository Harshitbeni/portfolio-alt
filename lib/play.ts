import type { WorkMediaItem } from "@/lib/work";
import { PLAY_ADDITIONS } from "@/lib/play-additions";
import { THREAD_PLAY_ITEMS } from "@/lib/play-thread";

export type PlayItem = {
  id: string;
  href: string;
  date: string;
  text: string;
  media: WorkMediaItem[];
};

const PLAY_ITEMS_BASE: PlayItem[] = [
  {
    id: "2061959582738747882",
    href: "https://x.com/harshitbeni/status/2061959582738747882",
    date: "Jun 2026",
    text: "Flora - a new kind of journaling app\n\nTestFlight below 👇",
    media: [
      {
        id: "2061959582738747882-1",
        kind: "video",
        src: "/play/flora.mp4",
        width: 1278,
        height: 720,
        caption: [],
      },
    ],
  },
  {
    id: "2059807486035759404",
    href: "https://x.com/harshitbeni/status/2059807486035759404",
    date: "May 2026",
    text: "Some shots from my deck from last semester, where I presented some ideas I wanted to work on:",
    media: [
      {
        id: "2059807486035759404-1",
        kind: "image",
        src: "/play/x-2059807486035759404-1.jpg",
        width: 1920,
        height: 1080,
        caption: [],
      },
      {
        id: "2059807486035759404-2",
        kind: "image",
        src: "/play/x-2059807486035759404-2.jpg",
        width: 1920,
        height: 1080,
        caption: [],
      },
      {
        id: "2059807486035759404-3",
        kind: "image",
        src: "/play/x-2059807486035759404-3.jpg",
        width: 1920,
        height: 1080,
        caption: [],
      },
      {
        id: "2059807486035759404-4",
        kind: "image",
        src: "/play/x-2059807486035759404-4.jpg",
        width: 1920,
        height: 1080,
        caption: [],
      },
    ],
  },
  {
    id: "2057117334435684500",
    href: "https://x.com/harshitbeni/status/2057117334435684500",
    date: "May 2026",
    text: "Can AI come up with this?\n\nWhen you tap the icon, it plays the first words Anne wrote in her diary (sound on 🔊).",
    media: [
      {
        id: "2057117334435684500-1",
        kind: "video",
        src: "/play/x-2057117334435684500-1.mp4",
        width: 1080,
        height: 1080,
        caption: [],
      },
    ],
  },
  {
    id: "2053261378090353068",
    href: "https://x.com/harshitbeni/status/2053261378090353068",
    date: "May 2026",
    text: "I started journaling after reading Diary of a Young Girl as a kid. So, obviously, I had to pay homage to Anne by adding a custom app icon that resembles her journal, Kitty!",
    media: [
      {
        id: "2053261378090353068-1",
        kind: "image",
        src: "/play/x-2053261378090353068-1.jpg",
        width: 2160,
        height: 2160,
        caption: [],
      },
      {
        id: "2053261378090353068-2",
        kind: "image",
        src: "/play/x-2053261378090353068-2.jpg",
        width: 2160,
        height: 2160,
        caption: [],
      },
    ],
  },
  {
    id: "2050739657009512771",
    href: "https://x.com/harshitbeni/status/2050739657009512771",
    date: "May 2026",
    text: "made a little something at the @glazeapp and @v0 sf event\nsee what songs your friends listen to while working 🎵",
    media: [
      {
        id: "2050739657009512771-1",
        kind: "video",
        src: "/play/x-2050739657009512771-1.mp4",
        width: 2940,
        height: 1844,
        caption: [],
      },
    ],
  },
  {
    id: "2045998758702502387",
    href: "https://x.com/harshitbeni/status/2045998758702502387",
    date: "Apr 2026",
    text: "Deck covers: different projects, same template, but with a bit of soul",
    media: [
      {
        id: "2045998758702502387-1",
        kind: "video",
        src: "/play/x-2045998758702502387-1.mp4",
        width: 1920,
        height: 1080,
        caption: [],
      },
      {
        id: "2045998758702502387-2",
        kind: "video",
        src: "/play/x-2045998758702502387-2.mp4",
        width: 1920,
        height: 1080,
        caption: [],
      },
      {
        id: "2045998758702502387-3",
        kind: "image",
        src: "/play/x-2045998758702502387-3.png",
        width: 1920,
        height: 1080,
        caption: [],
      },
    ],
  },
  {
    id: "2041278303760482353",
    href: "https://x.com/harshitbeni/status/2041278303760482353",
    date: "Apr 2026",
    text: "Easter is the perfect time to add an easter egg to your app 🥚\n\nAdded a mini-game of whack-a-mole to my onboarding!",
    media: [
      {
        id: "2041278303760482353-1",
        kind: "video",
        src: "/play/x-2041278303760482353-1.mp4",
        width: 1440,
        height: 1080,
        caption: [],
      },
    ],
  },
  {
    id: "2040251439352787261",
    href: "https://x.com/harshitbeni/status/2040251439352787261",
    date: "Apr 2026",
    text: "App icon for my upcoming journaling app.\n\nTestFlight soon! 💙",
    media: [
      {
        id: "2040251439352787261-1",
        kind: "image",
        src: "/play/x-2040251439352787261-1.jpg",
        width: 1179,
        height: 2556,
        caption: [],
      },
      {
        id: "2040251439352787261-2",
        kind: "image",
        src: "/play/x-2040251439352787261-2.jpg",
        width: 2800,
        height: 2800,
        caption: [],
      },
    ],
  },
  {
    id: "2038640482658713883",
    href: "https://x.com/harshitbeni/status/2038640482658713883",
    date: "Mar 2026",
    text: "Things are finally taking shape 🫡",
    media: [
      {
        id: "2038640482658713883-1",
        kind: "image",
        src: "/play/x-2038640482658713883-1.jpg",
        width: 3840,
        height: 2160,
        caption: [],
      },
    ],
  },
  {
    id: "2037676598200299536",
    href: "https://x.com/harshitbeni/status/2037676598200299536",
    date: "Mar 2026",
    text: "Working on the onboarding for my new app ✨\n\nDialKit for iOS is the biggest unlock I've had for experimenting and nailing down swift interactions.\n\nKudos to @joshpuckett and @mikelikesdesign for building this 🙏",
    media: [
      {
        id: "2037676598200299536-1",
        kind: "video",
        src: "/play/x-2037676598200299536-1.mp4",
        width: 1920,
        height: 1080,
        caption: [],
      },
    ],
  },
  {
    id: "2032881098389406020",
    href: "https://x.com/harshitbeni/status/2032881098389406020",
    date: "Mar 2026",
    text: "I used @figma Make to build a complete end-to-end prototype for figbuild, and I have some thoughts:\n\n1/ How does it compare to Claude Code?\n\nI think @AnthropicAI targets a completely different user group vs Figma. Figma handles everything for you: hosting, updates, versioning...",
    media: [
      {
        id: "2032881098389406020-1",
        kind: "image",
        src: "/play/x-2032881098389406020-1.jpg",
        width: 2908,
        height: 1814,
        caption: [],
      },
    ],
  },
  {
    id: "2031811699045777495",
    href: "https://x.com/harshitbeni/status/2031811699045777495",
    date: "Mar 2026",
    text: "I took part in @figma's Figbuild 2026 and built Anchor:\n\nWe all have objects in our lives that remind us of time gone by and of memories we cherished. Anchor lets you collect these objects, add context to them, and resurfaces them to remind you of your time.",
    media: [
      {
        id: "2031811699045777495-1",
        kind: "video",
        src: "/play/x-2031811699045777495-1.mp4",
        width: 2940,
        height: 1652,
        caption: [],
      },
    ],
  },
  {
    id: "2027943198988087304",
    href: "https://x.com/harshitbeni/status/2027943198988087304",
    date: "Mar 2026",
    text: "I made a clock that shows that time is relative.\n\nThe gradients reflect the time that bounds us. The day clock shows the sun's movement, while the year clock shows us the four seasons.\n\nBookmark and use it as your browser homepage.\n\nhttps://flight-swoop-66337217.figma.site #FigmaMakeathon",
    media: [
      {
        id: "2027943198988087304-1",
        kind: "video",
        src: "/play/x-2027943198988087304-1.mp4",
        width: 1596,
        height: 1080,
        caption: [],
      },
    ],
  },
  {
    id: "1802699507190133116",
    href: "https://x.com/harshitbeni/status/1802699507190133116",
    date: "Jun 2024",
    text: "ChatGPT icon in @foldmoney_ style ;)",
    media: [
      {
        id: "1802699507190133116-1",
        kind: "image",
        src: "/play/x-1802699507190133116-1.jpg",
        width: 1200,
        height: 720,
        caption: [],
      },
    ],
  },
  {
    id: "1792529697194258677",
    href: "https://x.com/harshitbeni/status/1792529697194258677",
    date: "May 2024",
    text: "Music widget 🎵\nMade in @framer, using @lastfm API, Sleeve app from @SoftwareReplay and lots of ChatGPT. Ship or nah?",
    media: [
      {
        id: "1792529697194258677-1",
        kind: "video",
        src: "/play/x-1792529697194258677-1.mp4",
        width: 1120,
        height: 800,
        caption: [],
      },
    ],
  },
  {
    id: "1756338703251943514",
    href: "https://x.com/harshitbeni/status/1756338703251943514",
    date: "Feb 2024",
    text: "My @MuseAppHQ board from ~1 year ago building @ThursdayByTS 0→1",
    media: [
      {
        id: "1756338703251943514-1",
        kind: "image",
        src: "/play/x-1756338703251943514-1.jpg",
        width: 4096,
        height: 968,
        caption: [],
      },
    ],
  },
  {
    id: "1635278034902167552",
    href: "https://x.com/harshitbeni/status/1635278034902167552",
    date: "Mar 2023",
    text: "I love designing empty states 🥰",
    media: [
      {
        id: "1635278034902167552-1",
        kind: "image",
        src: "/play/x-1635278034902167552-1.jpg",
        width: 3448,
        height: 2194,
        caption: [],
      },
    ],
  },
  {
    id: "1589243200148946944",
    href: "https://x.com/harshitbeni/status/1589243200148946944",
    date: "Nov 2022",
    text: "Cleaned up the grid over the weekend. 🧹",
    media: [
      {
        id: "1589243200148946944-1",
        kind: "image",
        src: "/play/x-1589243200148946944-1.jpg",
        width: 3584,
        height: 2016,
        caption: [],
      },
      {
        id: "1589243200148946944-2",
        kind: "image",
        src: "/play/x-1589243200148946944-2.jpg",
        width: 3584,
        height: 2016,
        caption: [],
      },
    ],
  },
  {
    id: "1540681600135860225",
    href: "https://x.com/harshitbeni/status/1540681600135860225",
    date: "Jun 2022",
    text: "Casually designing while binging TV shows works well 🤝",
    media: [
      {
        id: "1540681600135860225-1",
        kind: "image",
        src: "/play/x-1540681600135860225-1.jpg",
        width: 1700,
        height: 1246,
        caption: [],
      },
    ],
  },
  {
    id: "1446471038909313025",
    href: "https://x.com/harshitbeni/status/1446471038909313025",
    date: "Oct 2021",
    text: "1/ Me and my team @ThursdayByFolly have been building a space for remote teams to do their socials, talk and just have a fun time at work. With the future of work slowly but surely inclining towards remote, everyone is busy building tools to make ‘work’ better.",
    media: [
      {
        id: "1446471038909313025-1",
        kind: "image",
        src: "/play/x-1446471038909313025-1.jpg",
        width: 2400,
        height: 1600,
        caption: [],
      },
    ],
  },
];

export const PLAY_ITEMS = [
  ...PLAY_ITEMS_BASE,
  ...THREAD_PLAY_ITEMS,
  ...PLAY_ADDITIONS,
].sort((a, b) => b.id.localeCompare(a.id));
