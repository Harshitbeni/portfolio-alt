import NextImage, { type ImageProps as NextImageProps } from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export const IMAGE_GLOW_DEFAULTS = {
  offsetY: 24,
  blur: 24,
  opacity: 0.24,
} as const;

export type ImageGlowStyle = {
  offsetY: number;
  blur: number;
  opacity: number;
};

const strokeClassName =
  "pointer-events-none absolute inset-0 z-10 rounded-[inherit] border border-black/10 dark:border-white/10";

export type ImageProps = NextImageProps & {
  caption?: string;
  captionAlign?: "start" | "center";
  glow?: boolean;
  glowStyle?: ImageGlowStyle;
  objectFit?: "contain" | "cover";
  overlay?: boolean;
  radius?: number;
  stroke?: boolean;
};

export function Image({
  alt,
  caption,
  captionAlign = "center",
  className,
  fill,
  glow = false,
  glowStyle,
  objectFit = "cover",
  overlay = false,
  radius,
  sizes,
  src,
  stroke = true,
  ...props
}: ImageProps) {
  const resolvedGlow = glowStyle ?? IMAGE_GLOW_DEFAULTS;
  const glowLayerStyle = {
    transform: `translateY(${resolvedGlow.offsetY}px)`,
    filter: `blur(${resolvedGlow.blur}px)`,
    opacity: resolvedGlow.opacity,
  } satisfies CSSProperties;
  const radiusStyle =
    radius !== undefined
      ? ({ borderRadius: radius } satisfies CSSProperties)
      : undefined;
  const imageClassName = fill
    ? objectFit === "contain"
      ? "object-contain"
      : "object-cover"
    : "block h-auto w-full";

  const frame = (
    <div
      className={cn(
        "relative isolate",
        radius === undefined && "rounded-md",
        fill ? "size-full" : undefined,
      )}
      style={radiusStyle}
    >
      {glow && src ? (
        <NextImage
          aria-hidden
          alt=""
          src={src}
          fill
          sizes={sizes ?? "100vw"}
          className="pointer-events-none z-0 object-cover rounded-[inherit]"
          style={glowLayerStyle}
        />
      ) : null}
      <div
        className={cn(
          "relative z-10 overflow-hidden rounded-[inherit]",
          overlay && "group/image",
          fill ? "size-full" : undefined,
        )}
      >
        <NextImage
          alt={alt}
          fill={fill}
          src={src}
          sizes={sizes}
          className={imageClassName}
          {...props}
        />
        {overlay ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-20 bg-gray-a3 opacity-0 transition-opacity duration-200 ease-out group-hover/image:opacity-100"
          />
        ) : null}
        {stroke ? <span aria-hidden className={strokeClassName} /> : null}
      </div>
    </div>
  );

  if (caption) {
    return (
      <figure
        data-slot="image"
        className={cn(
          "m-0 flex w-full flex-col items-start gap-1.5",
          fill ? "size-full" : undefined,
          className,
        )}
      >
        {frame}
        <figcaption
          data-slot="image-caption"
          className="m-0 w-full text-sm leading-5 text-gray-a10"
          style={{ textAlign: captionAlign }}
        >
          {caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <div
      data-slot="image"
      className={cn("w-full", fill ? "size-full" : undefined, className)}
    >
      {frame}
    </div>
  );
}
