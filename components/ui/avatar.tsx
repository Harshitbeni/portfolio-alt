import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "relative inline-flex shrink-0 overflow-hidden rounded-full bg-gray-a3 after:pointer-events-none after:absolute after:inset-0 after:z-10 after:rounded-full after:border after:border-gray-a4 after:content-['']",
  {
    variants: {
      size: {
        xs: "size-5",
        sm: "size-8",
        default: "size-10",
        lg: "size-12",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof avatarVariants>) {
  return (
    <span
      data-slot="avatar"
      data-size={size}
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  );
}

function AvatarImage({
  src,
  alt = "",
  className,
  size = 40,
}: {
  src: string;
  alt?: string;
  className?: string;
  size?: number;
}) {
  return (
    <Image
      data-slot="avatar-image"
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("size-full object-cover", className)}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-fallback"
      aria-hidden="true"
      className={cn("block size-full", className)}
      {...props}
    />
  );
}

function avatarImageSize(
  size: VariantProps<typeof avatarVariants>["size"],
) {
  return size === "xs" ? 20 : size === "sm" ? 32 : size === "lg" ? 48 : 40;
}

function AvatarFace({
  name,
  src,
  alt,
  size = "default",
}: {
  name: string;
  src?: string;
  alt?: string;
  size?: VariantProps<typeof avatarVariants>["size"];
}) {
  return (
    <Avatar size={size}>
      {src ? (
        <AvatarImage
          src={src}
          alt={alt ?? name}
          size={avatarImageSize(size)}
        />
      ) : (
        <AvatarFallback />
      )}
    </Avatar>
  );
}

function AvatarPerson({
  name,
  role,
  src,
  alt,
  size = "xs",
  className,
}: {
  name: string;
  role: string;
  src?: string;
  alt?: string;
  size?: VariantProps<typeof avatarVariants>["size"];
  className?: string;
}) {
  return (
    <div
      data-slot="avatar-person"
      className={cn(
        "flex items-center gap-2",
        size === "xs" && "h-6",
        className,
      )}
    >
      <AvatarFace name={name} src={src} alt={alt} size={size} />
      <p className="text-sm">
        <span className="font-normal text-gray-12">{name}</span>
        <span className="text-gray-11">, {role}</span>
      </p>
    </div>
  );
}

function AvatarRow({
  name,
  role,
  src,
  alt,
  size = "default",
  className,
}: {
  name: string;
  role: string;
  src?: string;
  alt?: string;
  size?: VariantProps<typeof avatarVariants>["size"];
  className?: string;
}) {
  return (
    <div
      data-slot="avatar-row"
      className={cn("flex items-start gap-3", className)}
    >
      <AvatarFace name={name} src={src} alt={alt} size={size} />
      <div className="flex min-w-0 flex-col items-start gap-0">
        <p className="text-sm font-medium text-gray-a12">{name}</p>
        <p className="text-xs text-gray-a10">{role}</p>
      </div>
    </div>
  );
}

function AvatarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  AvatarPerson,
  AvatarRow,
  avatarVariants,
};
