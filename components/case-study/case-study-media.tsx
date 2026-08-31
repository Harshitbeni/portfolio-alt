import Image from "next/image";
import type { CaseStudyImage, CaseStudyVideo } from "@/lib/case-studies/types";
import { cn } from "@/lib/utils";

const mediaClassName =
  "h-auto w-full rounded-md border border-gray-a6";

export function CaseStudyImageMedia({
  image,
  className,
  priority,
}: {
  image: CaseStudyImage;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      className={cn(mediaClassName, className)}
      sizes="(max-width: 600px) calc(100vw - 2rem), 568px"
      priority={priority}
    />
  );
}

export function CaseStudyVideoMedia({
  video,
  className,
  controls = true,
}: {
  video: CaseStudyVideo;
  className?: string;
  controls?: boolean;
}) {
  return (
    <video
      src={video.src}
      className={cn(mediaClassName, className)}
      controls={controls}
      playsInline
      preload="metadata"
      aria-label={video.alt}
    />
  );
}

export function CaseStudyYouTubeEmbed({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md border border-gray-a6">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 size-full"
      />
    </div>
  );
}
