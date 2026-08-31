import { ProductDesignerShimmer } from "@/components/product-designer-shimmer";
import { Suspense } from "react";
import { HomeTabs } from "@/components/home-tabs";
import { NavCard } from "@/components/nav-card";
import { NotesPanel } from "@/components/notes-panel";
import { TimeModeToggle } from "@/components/time-mode-toggle";
import { getMusicPreview } from "@/lib/music";
import {
  DEFAULT_NOMADS_LOCATION,
  fetchNomadsLocation,
  formatNomadsLocation,
} from "@/lib/nomads-location";

async function getLocationLabel() {
  try {
    return formatNomadsLocation(await fetchNomadsLocation());
  } catch {
    return formatNomadsLocation(DEFAULT_NOMADS_LOCATION);
  }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  const { tab } = await searchParams;
  const tabValue = Array.isArray(tab) ? tab[0] : tab;
  const [location, musicPreview] = await Promise.all([
    getLocationLabel(),
    tabValue === "music" ? getMusicPreview() : Promise.resolve(null),
  ]);
  const initialMusicSections = musicPreview?.sections?.length
    ? musicPreview.sections
    : null;

  return (
    <>
      <h1 className="sr-only">Harshit Beniwal</h1>
      <div className="flex w-full flex-col items-start px-3">
        <NavCard location={location} liveLocation={false} />
      </div>
      <div className="flex w-full flex-col items-start gap-12">
        <div className="px-4">
          <p className="text-pretty text-sm leading-5 text-muted-foreground">
            Hello, I am a <ProductDesignerShimmer /> who leads with curiosity and thoughtfulness in everything I do, design
            or otherwise. My expertise lies in interaction design, systems
            thinking, and putting uncommon care.
          </p>
        </div>
        <Suspense fallback={null}>
          <HomeTabs
            initialMusicSections={initialMusicSections}
            initialMusicTotalTracks={musicPreview?.totalTracks}
            notesPanel={<NotesPanel />}
          />
        </Suspense>
      </div>
      <TimeModeToggle />
    </>
  );
}
