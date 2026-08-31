"use client";

import { createElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { useIcons, type IconName } from "@/lib/icon-context";

const DESKTOP_LINKS = [
  { label: "work", href: "/?tab=work" },
  { label: "about", href: "/about" },
  { label: "play", href: "/play" },
  { label: "notes", href: "/notes" },
  { label: "resume", href: "/cv" },
];

const MOBILE_LINKS: { label: string; href: string; icon: IconName }[] = [
  { label: "home", href: "/", icon: "home" },
  { label: "about", href: "/about", icon: "user" },
  { label: "play", href: "/play", icon: "play" },
  { label: "notes", href: "/notes", icon: "pencil" },
  { label: "cv", href: "/cv", icon: "folder" },
];

export function CaseStudyLegacySiteNav() {
  const icons = useIcons();

  return (
    <>
      <header className="hidden h-16 w-full sm:block">
        <div className="mx-auto flex h-full w-full max-w-[1184px] items-center justify-between">
          <Link
            href="/"
            aria-label="Home"
            className="rounded-full outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            <Image
              src="/nav-card/avatar.webp"
              alt=""
              width={32}
              height={32}
              className="size-8 rounded-full"
            />
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-8">
            {DESKTOP_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-sm text-sm text-gray-a10 outline-none transition-colors hover:text-gray-a12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <nav
        aria-label="Primary"
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-gray-a6 bg-background/95 px-3 pb-[max(8px,env(safe-area-inset-bottom))] pt-2 backdrop-blur-[16px] sm:hidden"
      >
        {MOBILE_LINKS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-md text-xxs text-gray-a10 outline-none transition-colors hover:text-gray-a12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            {createElement(icons[item.icon], { size: 17 })}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

const HERO_LAYERS = [
  "/work/privado-mobile-app-scan/privado-dashboard-screenshot-02.png",
  "/work/privado-mobile-app-scan/privado-assessment-form.png",
  "/work/privado-mobile-app-scan/mobile-app-screenshot-02.png",
];

export function CaseStudyLegacyHero() {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[16px] border border-gray-a6 bg-gray-3 shadow-sm sm:rounded-[24px]">
      {HERO_LAYERS.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={index === HERO_LAYERS.length - 1 ? "Privado Mobile App Scan interface" : ""}
          width={2672}
          height={1600}
          priority={index === HERO_LAYERS.length - 1}
          className="absolute left-[5%] top-[16%] h-auto w-[90%] rounded-[12px] border border-gray-a6 object-cover shadow-md"
          style={{
            zIndex: index + 1,
            transform: `translateY(${(HERO_LAYERS.length - 1 - index) * -16}px) scale(${0.94 + index * 0.03})`,
            transformOrigin: "top center",
          }}
          sizes="(max-width: 639px) calc(100vw - 3.2rem), 720px"
        />
      ))}
    </div>
  );
}

const FOOTER_LINKS = [
  { label: "hello@harshitbeni.com", href: "mailto:hello@harshitbeni.com" },
  { label: "@harshitbeni", href: "https://x.com/harshitbeni" },
  {
    label: "@harshit-beniwal",
    href: "https://www.linkedin.com/in/harshit-beniwal/",
  },
  {
    label: "@harshitbeni.bsky.social",
    href: "https://bsky.app/profile/harshitbeni.bsky.social",
  },
];

export function CaseStudyLegacyClosing() {
  return (
    <div className="mt-1">
      <Link
        href="/"
        className="mx-auto flex h-7 w-fit items-center rounded-full border border-gray-a6 px-3 text-sm text-gray-a10 transition-colors hover:text-gray-a12"
      >
        ←&nbsp; Back
      </Link>

      <Link
        href="/"
        className="mt-[50px] flex h-7 w-full items-center justify-center rounded-full border border-gray-a6 text-sm text-gray-a10 transition-colors hover:text-gray-a12"
      >
        Next Project&nbsp; →
      </Link>

      <footer className="relative mt-[52px] h-[433px] overflow-hidden rounded-t-[24px] bg-gradient-to-b from-gray-3 to-transparent px-4 py-5 sm:h-[486px]">
        <p className="max-w-[360px] text-sm leading-5 text-gray-a11">
          harshitbeni.com is my internet home and a repository of my work and
          experiments. This is <Link href="/archive" className="underline">v3</Link>, made with Framer.
          Open to new projects, collaborations and non-profit work.
        </p>
        <div className="mt-4 flex flex-col gap-2">
          {FOOTER_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm text-gray-a11"
            >
              <span aria-hidden className="size-3 rounded-sm bg-gray-a7" />
              <span className="h-px flex-1 bg-gray-a6" />
              <span>{item.label}</span>
              <span aria-hidden>↗</span>
            </a>
          ))}
        </div>
        <Image
          src="/nav-card/avatar.webp"
          alt=""
          width={130}
          height={130}
          className="absolute -bottom-4 left-1/2 size-[130px] -translate-x-1/2 rounded-full object-cover"
        />
      </footer>
    </div>
  );
}
