"use client";

import type { ComponentProps } from "react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useIcons, type IconName } from "@/lib/icon-context";

export type DropdownMenuItemWithIconProps = ComponentProps<
  typeof DropdownMenuItem
> & {
  icon?: IconName;
};

export function DropdownMenuItemWithIcon({
  icon,
  children,
  ...props
}: DropdownMenuItemWithIconProps) {
  const icons = useIcons();
  const Icon = icon ? icons[icon] : undefined;

  return (
    <DropdownMenuItem {...props}>
      {Icon ? <Icon strokeWidth={1.5} /> : null}
      {children}
    </DropdownMenuItem>
  );
}
