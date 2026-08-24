"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import type { TypeTokenName } from "@/lib/type-tokens"
import { cn } from "@/lib/utils"

const TOOLTIP_DELAY_MS = 700
const TOOLTIP_NO_ARROW_OFFSET = 8
const TOOLTIP_PADDING_X = 8
const TOOLTIP_PADDING_Y = 6
const TOOLTIP_TEXT_TOKEN: TypeTokenName = "xs"

const TOOLTIP_TEXT_TOKEN_CLASS: Record<TypeTokenName, string> = {
  sm: "text-sm leading-5",
  xs: "text-xs leading-4",
  xxs: "text-xxs leading-4",
}

const TooltipInstantContext = React.createContext(true)

function resolveTooltipDelayDuration(instant: boolean, delay: boolean): number {
  if (delay) return TOOLTIP_DELAY_MS
  if (instant) return 0
  return TOOLTIP_DELAY_MS
}

function resolveTooltipSideOffset(arrow: boolean, sideOffset?: number): number {
  if (sideOffset != null) return sideOffset
  return arrow ? 0 : TOOLTIP_NO_ARROW_OFFSET
}

const tooltipAnimatedClassName =
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  instant = true,
  delay = false,
  delayDuration,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root> & {
  instant?: boolean
  delay?: boolean
}) {
  const resolvedDelayDuration =
    delayDuration ?? resolveTooltipDelayDuration(instant, delay)

  return (
    <TooltipInstantContext.Provider value={instant}>
      <TooltipPrimitive.Root
        data-slot="tooltip"
        delayDuration={resolvedDelayDuration}
        {...props}
      />
    </TooltipInstantContext.Provider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset,
  arrow = false,
  instant,
  children,
  style,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  arrow?: boolean
  instant?: boolean
}) {
  const instantFromTooltip = React.useContext(TooltipInstantContext)
  const isInstant = instant ?? instantFromTooltip
  const resolvedSideOffset = resolveTooltipSideOffset(arrow, sideOffset)

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={resolvedSideOffset}
        style={{
          paddingInline: `${TOOLTIP_PADDING_X}px`,
          paddingBlock: `${TOOLTIP_PADDING_Y}px`,
          ...style,
        }}
        className={cn(
          "z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md bg-foreground text-background has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm",
          TOOLTIP_TEXT_TOKEN_CLASS[TOOLTIP_TEXT_TOKEN],
          !isInstant && tooltipAnimatedClassName,
          className
        )}
        {...props}
      >
        {children}
        {arrow ? (
          <TooltipPrimitive.Arrow
            className="z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground"
          />
        ) : null}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
