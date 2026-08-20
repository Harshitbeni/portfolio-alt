export type PrimaryNavItem = {
  href: string;
  label: string;
  external?: boolean;
};

export const PRIMARY_NAV_ITEMS: PrimaryNavItem[] = [
  { href: "/#work", label: "work" },
  { href: "/about", label: "about" },
  { href: "/play", label: "play" },
  { href: "https://notes.harshitbeni.com", label: "notes", external: true },
  { href: "/cv", label: "resume" },
];

export function isNavActive(
  pathname: string,
  href: string,
  external?: boolean
): boolean {
  if (external) return false;

  const hashIdx = href.indexOf("#");
  if (hashIdx >= 0) {
    const pathPart = href.slice(0, hashIdx);
    const base =
      pathPart === "" || pathPart === "/"
        ? "/"
        : pathPart.replace(/\/$/, "") || "/";
    if (base === "/") return false;
    return pathname === base || pathname.startsWith(`${base}/`);
  }

  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
