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
  if (!trips.length) {
    return null;
  }

  return trips.reduce<Trip | null>((best, current) => {
    if (!current.epoch_start) {
      return best;
    }

    if (!best || (best.epoch_start ?? 0) < (current.epoch_start ?? 0)) {
      return current;
    }

    return best;
  }, null);
}

export function parseNomadsProfileHtml(
  html: string,
  fallback: NomadsLocation = DEFAULT_NOMADS_LOCATION
): NomadsLocation {
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
