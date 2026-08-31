#!/usr/bin/env node

import { createWriteStream } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "public/work/thursday");
const BASE = "https://portfolio-sable-one-83.vercel.app";

/** @type {Array<{ source: string; dest: string }>} */
const MANIFEST = [
  // Videos
  {
    source: "/assets/video/LaWB80maYUz5FQERPNkzmrq6FE.mp4",
    dest: "building-in-public.mp4",
  },
  {
    source: "/assets/video/U68Ra4Uz6RmU4IPSbLbTRKdlo.mp4",
    dest: "product-demo.mp4",
  },
  // Product Hunt badge
  {
    source:
      "https://api.producthunt.com/widgets/embed-image/v1/golden-kitty-badge.svg?post_id=317530&theme=light",
    dest: "product-hunt-golden-kitty.svg",
  },
  // Comparison logos
  { source: "/assets/img/zoom-logo.png", dest: "zoom-logo.png" },
  { source: "/assets/img/geometric-logo.jpg", dest: "gather-logo.jpg" },
  { source: "/assets/img/thursday-logo-icon.png", dest: "thursday-logo.png" },
  {
    source: "/assets/img/11KSGbIZoRSg4pjdnUoif6MKHI.svg",
    dest: "comparison-zoom.svg",
  },
  {
    source: "/assets/img/6tTbkXggWgQCAJ4DO2QEdXXmgM.svg",
    dest: "comparison-gather.svg",
  },
  // Personas
  { source: "/assets/img/portrait-woman.jpg", dest: "persona-employee.jpg" },
  {
    source: "/assets/img/portrait-woman-03.jpeg",
    dest: "persona-organiser.jpeg",
  },
  // Process / research
  { source: "/assets/img/flowchart-sketch.png", dest: "flowchart-sketch.png" },
  { source: "/assets/img/thursday-sketches.png", dest: "thursday-sketches.png" },
  { source: "/assets/img/thursday-sketch-02.png", dest: "thursday-sketch-02.png" },
  {
    source: "/assets/img/thursday-wireframes.png",
    dest: "thursday-wireframes.png",
  },
  {
    source: "/assets/img/thursday-wireframe-sketch.png",
    dest: "thursday-wireframe-sketch.png",
  },
  {
    source: "/assets/img/thursday-icebreakers.png",
    dest: "thursday-icebreakers.png",
  },
  {
    source: "/assets/img/thursday-video-call.png",
    dest: "thursday-video-call.png",
  },
  {
    source: "/assets/img/thursday-video-call-02.png",
    dest: "thursday-video-call-02.png",
  },
  {
    source: "/assets/img/thursday-zoom-tools-illustrations.png",
    dest: "thursday-zoom-tools-illustrations.png",
  },
  { source: "/assets/img/video-call-screenshot.png", dest: "video-call-screenshot.png" },
  { source: "/assets/img/television.jpg", dest: "television.jpg" },
  { source: "/assets/img/outdoor-photo.jpg", dest: "outdoor-photo.jpg" },
  { source: "/assets/img/portrait-backpack.png", dest: "portrait-backpack.png" },
  { source: "/assets/img/portrait-mirror.jpg", dest: "portrait-mirror.jpg" },
  { source: "/assets/img/donkey-sticker.png", dest: "donkey-sticker.png" },
  // Solution
  {
    source: "/assets/img/1juoUTb48kPWBaOGKDp0ZVpSKM.png",
    dest: "usercard.png",
  },
  {
    source: "/assets/img/6uHbtpyon1AeOBc6jjxwP4klefk.png",
    dest: "lounge-screenshot.png",
  },
  {
    source: "/assets/img/DpjKuUaWtdlK8ZCyuHjmDYuvNYI.png",
    dest: "participation-modes.png",
  },
  {
    source: "/assets/img/jVe9VZ37lbzwgUjuyCxd3je2wis.png",
    dest: "dashboard-scheduling.png",
  },
  { source: "/assets/img/thursday-lounge.png", dest: "thursday-lounge.png" },
  {
    source: "/assets/img/thursday-reaction-board.png",
    dest: "thursday-reaction-board.png",
  },
  {
    source: "/assets/img/thursday-social-cards.png",
    dest: "thursday-social-cards.png",
  },
  {
    source: "/assets/img/thursday-social-game.png",
    dest: "thursday-social-game.png",
  },
  {
    source: "/assets/img/thursday-would-you-rather.png",
    dest: "thursday-would-you-rather.png",
  },
  {
    source: "/assets/img/thursday-mixer-would-you-rather.png",
    dest: "thursday-mixer-would-you-rather.png",
  },
  {
    source: "/assets/img/thursday-mixer-charades.png",
    dest: "thursday-mixer-charades.png",
  },
  {
    source: "/assets/img/thursday-mixer-doodle-race.png",
    dest: "thursday-mixer-doodle-race.png",
  },
  {
    source: "/assets/img/thursday-mixer-drunk-startups.png",
    dest: "thursday-mixer-drunk-startups.png",
  },
  {
    source: "/assets/img/thursday-calendar-app-illustration.png",
    dest: "thursday-calendar-app-illustration.png",
  },
  {
    source: "/assets/img/thursday-megaphone-people-illustration.png",
    dest: "thursday-megaphone-people-illustration.png",
  },
  {
    source: "/assets/img/thursday-design-feedback.png",
    dest: "thursday-design-feedback.png",
  },
  {
    source: "/assets/img/thursday-social-website-07.png",
    dest: "thursday-social-website-07.png",
  },
  { source: "/assets/img/product-feedback-quote.png", dest: "slackbot.png" },
  // Results
  {
    source: "/assets/img/thursday-testimonial-02.webp",
    dest: "testimonial-sarah-park.webp",
  },
  { source: "/assets/img/thursday-team-photo.jpg", dest: "thursday-team-photo.jpg" },
  { source: "/assets/img/testimonial-quote.png", dest: "testimonial-quote-01.png" },
  { source: "/assets/img/testimonial-quote-02.png", dest: "testimonial-quote-02.png" },
  { source: "/assets/img/testimonial-quote-03.png", dest: "testimonial-quote-03.png" },
  { source: "/assets/img/testimonial-quote-05.png", dest: "testimonial-quote-05.png" },
  { source: "/assets/img/testimonial-quote-06.png", dest: "testimonial-quote-06.png" },
  { source: "/assets/img/testimonial-quote-07.png", dest: "testimonial-quote-07.png" },
  { source: "/assets/img/testimonial-quote-08.png", dest: "testimonial-quote-08.png" },
  { source: "/assets/img/testimonial-quote-09.png", dest: "testimonial-quote-09.png" },
  { source: "/assets/img/testimonial-quote-10.png", dest: "testimonial-quote-10.png" },
  { source: "/assets/img/testimonial-quote-11.png", dest: "testimonial-quote-11.png" },
  { source: "/assets/img/testimonial-quote-12.png", dest: "testimonial-quote-12.png" },
  { source: "/assets/img/testimonial-quote-14.png", dest: "testimonial-quote-14.png" },
  { source: "/assets/img/testimonial-quote-15.png", dest: "testimonial-quote-15.png" },
  { source: "/assets/img/testimonial-quote-16.png", dest: "testimonial-quote-16.png" },
  { source: "/assets/img/testimonial-quote-18.png", dest: "testimonial-quote-18.png" },
];

async function downloadFile(url, destPath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }
  await mkdir(dirname(destPath), { recursive: true });
  await pipeline(response.body, createWriteStream(destPath));
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const results = [];
  for (const entry of MANIFEST) {
    const url = entry.source.startsWith("http")
      ? entry.source
      : `${BASE}${entry.source}`;
    const destPath = join(OUT_DIR, entry.dest);
    process.stdout.write(`Downloading ${entry.dest}... `);
    try {
      await downloadFile(url, destPath);
      results.push({ ...entry, status: "ok" });
      console.log("done");
    } catch (error) {
      results.push({ ...entry, status: "error", error: String(error) });
      console.log("FAILED");
    }
  }

  const manifestPath = join(OUT_DIR, "manifest.json");
  await writeFile(manifestPath, JSON.stringify(results, null, 2));
  console.log(`\nWrote manifest to ${manifestPath}`);

  const failures = results.filter((r) => r.status === "error");
  if (failures.length > 0) {
    console.error(`\n${failures.length} download(s) failed.`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
