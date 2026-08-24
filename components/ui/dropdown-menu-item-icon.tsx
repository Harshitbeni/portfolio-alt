"use client";

import type { ComponentProps } from "react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useIcons, type IconName } from "@/lib/icon-context";

export type DropdownMenuItemWithIconProps = ComponentProps<
  typeof DropdownMenuItem
> & {
  icon?: IconName;
  iconClassName?: string;
};

export function DropdownMenuItemWithIcon({
  icon,
  iconClassName,
  children,
  ...props
}: DropdownMenuItemWithIconProps) {
  const icons = useIcons();
  const Icon = icon ? icons[icon] : undefined;

  return (
    <DropdownMenuItem {...props}>
      {Icon ? <Icon className={iconClassName} strokeWidth={1.5} /> : null}
      {children}
    </DropdownMenuItem>
  );
}
