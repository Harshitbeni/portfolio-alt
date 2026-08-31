import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const ILLUSTRATION_WIDTH = 568;
export const ILLUSTRATION_HEIGHT = 360;

export function IllustrationCanvas({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative size-full"
      style={{ containerType: "size" }}
    >
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: ILLUSTRATION_WIDTH,
          height: ILLUSTRATION_HEIGHT,
          transform:
            "translate(-50%, -50%) scale(min(100cqw / 568px, 100cqh / 360px))",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function IllustrationLettering({
  children,
  className,
  style,
  ...props
}: ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-shantell text-[12px] font-medium leading-[1.34] tracking-[-0.06px] text-gray-9 [font-variation-settings:'BNCE'_100]",
        className,
      )}
      style={style}
      {...props}
    >
      {children}
    </p>
  );
}
