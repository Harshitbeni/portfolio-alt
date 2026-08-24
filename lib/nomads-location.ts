export type NomadsLocation = {
  city: string;
  region: string;
  country: string;
};

export const DEFAULT_NOMADS_LOCATION: NomadsLocation = {
  city: "San Francisco",
  region: "CA",
  country: "US",
};

export const DEFAULT_NOMADS_USER = "harshitbeni";

const NOMADS_URL = `https://nomads.com/@${DEFAULT_NOMADS_USER}`;

const COUNTRY_SLUG_TO_ISO: Record<string, string> = {
  "united-states": "US",
  "united-kingdom": "GB",
  "united-arab-emirates": "AE",
  india: "IN",
  thailand: "TH",
  indonesia: "ID",
  vietnam: "VN",
  "south-korea": "KR",
  japan: "JP",
  germany: "DE",
  france: "FR",
  spain: "ES",
  portugal: "PT",
  netherlands: "NL",
  italy: "IT",
  mexico: "MX",
  canada: "CA",
  brazil: "BR",
  australia: "AU",
  singapore: "SG",
  malaysia: "MY",
  philippines: "PH",
  taiwan: "TW",
  turkey: "TR",
  greece: "GR",
};

type Trip = {
  trip_id?: string;
  epoch_start?: number;
  epoch_end?: number;
  city_slug?: string;
  city?: string;
};

function titleCase(value: string): string {
  return value
    .split(" ")
    .map((word) =>
      word.length ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""
    )
    .join(" ");
}

function stripTags(value: string): string {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countryNameToIso(name: string): string {
  const slug = name.trim().toLowerCase().replace(/\s+/g, "-");
  return COUNTRY_SLUG_TO_ISO[slug] ?? "";
}

function parseNameAndRegion(rawName: string): { city: string; region: string } {
  const [city, maybeRegion = ""] = rawName
    .split(",")
    .map((part) => part.trim());

  if (maybeRegion.length === 2) {
    return { city, region: maybeRegion.toUpperCase() };
  }

  return { city: city || rawName, region: "" };
}

function parseCitySlug(slug: string): { region: string; country: string } {
  const parts = slug.split("-");

  for (let take = Math.min(3, parts.length); take >= 1; take--) {
    const candidate = parts.slice(parts.length - take).join("-");
    const iso = COUNTRY_SLUG_TO_ISO[candidate];

    if (iso) {
      const beforeCountry = parts.slice(0, parts.length - take);
      const last = beforeCountry[beforeCountry.length - 1] ?? "";
      const region = last.length === 2 ? last.toUpperCase() : "";

      return { region, country: iso };
    }
  }

  return { region: "", country: "" };
}

function extractTripsArray(html: string): Trip[] | null {
  const marker = "var tripsCoords=";
  const idx = html.indexOf(marker);

  if (idx < 0) {
    return null;
  }

  let i = idx + marker.length;

  while (i < html.length && html[i] !== "{") {
    i++;
  }

  if (i >= html.length) {
    return null;
  }

  let depth = 0;
  let end = -1;
  let inString = false;
  let stringQuote: '"' | "'" | null = null;
  let escape = false;

  for (let j = i; j < html.length; j++) {
    const ch = html[j];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (ch === "\\") {
        escape = true;
      } else if (ch === stringQuote) {
        inString = false;
        stringQuote = null;
      }

      continue;
    }

    if (ch === '"' || ch === "'") {
      inString = true;
      stringQuote = ch as '"' | "'";
      continue;
    }

    if (ch === "{") {
      depth++;
    } else if (ch === "}") {
      depth--;

      if (depth === 0) {
        end = j + 1;
        break;
      }
    }
  }

  if (end < 0) {
    return null;
  }

  try {
    const obj = JSON.parse(html.slice(i, end)) as Record<string, Trip[]>;
    const firstKey = Object.keys(obj)[0];

    if (!firstKey) {
      return null;
    }

    return obj[firstKey] ?? null;
  } catch {
    return null;
  }
}

function pickCurrentTrip(trips: Trip[]): Trip | null {
  const now = Math.floor(Date.now() / 1000);
  const active = trips.filter((trip) => {
    if (!trip.epoch_start || trip.epoch_start > now) {
      return false;
    }

    if (trip.epoch_end && trip.epoch_end <= now) {
      return false;
    }

    return true;
  });

  if (!active.length) {
    return null;
  }

  return active.reduce((best, current) =>
    (current.epoch_start ?? 0) > (best.epoch_start ?? 0) ? current : best
  );
}

function parseCurrentTripRow(html: string): NomadsLocation | null {
  const row = html.match(
    /<tr[^>]*class=["'][^"']*\btrip\b[^"']*\bcurrent\b[^"']*["'][^>]*>([\s\S]*?)<\/tr>/i
  );

  if (!row?.[1]) {
    return null;
  }

  const nameMatch = row[1].match(
    /<td[^>]*class=["']name["'][^>]*>[\s\S]*?<h2>([\s\S]*?)<\/h2>/i
  );
  const countryMatch = row[1].match(
    /<td[^>]*class=["']country["'][^>]*>([\s\S]*?)<\/td>/i
  );
  const rawName = nameMatch?.[1] ? stripTags(nameMatch[1]) : "";

  if (!rawName) {
    return null;
  }

  const { city, region } = parseNameAndRegion(rawName);
  const rawCountry = countryMatch?.[1] ? stripTags(countryMatch[1]) : "";

  return {
    city,
    region,
    country: countryNameToIso(rawCountry),
  };
}

export function parseNomadsProfileHtml(
  html: string,
  fallback: NomadsLocation = DEFAULT_NOMADS_LOCATION
): NomadsLocation {
  const fromRow = parseCurrentTripRow(html);

  if (fromRow) {
    return {
      ...fromRow,
      country: fromRow.country || fallback.country,
    };
  }

  const trips = extractTripsArray(html);
  const current = trips ? pickCurrentTrip(trips) : null;

  if (current?.city_slug) {
    const { region, country } = parseCitySlug(current.city_slug);
    const rawCity = current.city ?? "";
    const cityOnly = rawCity.split(",")[0]?.trim() || "";

    if (cityOnly) {
      return {
        city: cityOnly,
        region,
        country: country || fallback.country,
      };
    }
  }

  const meta = html.match(/is now in ([^.]+?) for /);

  if (meta?.[1]) {
    const cityRaw = meta[1].trim();

    return {
      city: titleCase(cityRaw),
      region: cityRaw.toLowerCase() === "san francisco" ? "CA" : "",
      country: cityRaw.toLowerCase() === "san francisco" ? "US" : "",
    };
  }

  throw new Error("Could not parse nomads.com profile");
}

export async function fetchNomadsLocation(): Promise<NomadsLocation> {
  const response = await fetch(NOMADS_URL, {
    headers: {
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      accept: "text/html",
    },
    cache: "force-cache",
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`nomads.com responded ${response.status}`);
  }

  return parseNomadsProfileHtml(
    await response.text(),
    DEFAULT_NOMADS_LOCATION
  );
}

export function formatNomadsLocation(location: NomadsLocation): string {
  return [location.city, location.region, location.country]
    .filter(Boolean)
    .join(", ");
}

export function isNomadsLocation(value: unknown): value is NomadsLocation {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.city === "string" &&
    typeof candidate.region === "string" &&
    typeof candidate.country === "string"
  );
}
