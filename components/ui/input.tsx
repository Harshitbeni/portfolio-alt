"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { Button, buttonVariants } from "@/components/ui/button"
import { defaultIcons } from "@/lib/icon-context"
import { cn } from "@/lib/utils"

const DEFAULT_RADIUS = 6
const PILL_RADIUS = 9999
const Search = defaultIcons.search

const inputVariants = cva(
  "w-full min-w-0 border border-input bg-transparent py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:outline-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:outline-destructive/40",
  {
    variants: {
      size: {
        default: "h-8",
        sm: "h-7",
      },
      nested: {
        true: "h-full border-0 bg-transparent focus-visible:border-transparent focus-visible:outline-none disabled:bg-transparent disabled:opacity-100 dark:bg-transparent dark:disabled:bg-transparent aria-invalid:border-transparent",
        false: "",
      },
    },
    compoundVariants: [
      { size: "default", nested: false, class: "px-2.5" },
      { size: "sm", nested: false, class: "px-2" },
      { size: "default", nested: true, class: "ps-2.5 pe-8" },
      { size: "sm", nested: true, class: "ps-2 pe-7" },
    ],
    defaultVariants: {
      size: "default",
      nested: false,
    },
  }
)

const inputShellVariants = cva(
  "relative w-full min-w-0 border border-input bg-transparent transition-colors has-[input:focus-visible]:border-ring has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ring has-[:disabled]:pointer-events-none has-[:disabled]:bg-input/50 has-[:disabled]:opacity-50 has-[[aria-invalid=true]]:border-destructive has-[[aria-invalid=true]]:outline-destructive/20 dark:bg-input/30 dark:has-[:disabled]:bg-input/80 dark:has-[[aria-invalid=true]]:border-destructive/50 dark:has-[[aria-invalid=true]]:outline-destructive/40",
  {
    variants: {
      size: {
        default: "h-8",
        sm: "h-7",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function resolveRadius(
  rounded: boolean | number | undefined,
  pill: boolean | undefined
) {
  if (pill) return PILL_RADIUS
  if (rounded === false) return 0
  if (typeof rounded === "number") return Math.max(0, rounded)
  return DEFAULT_RADIUS
}

function Input({
  className,
  type,
  size = "default",
  rounded = true,
  pill = false,
  button,
  buttonLabel,
  buttonType = "button",
  buttonVariant = "default",
  onButtonClick,
  disabled,
  style,
  ref,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  Omit<VariantProps<typeof inputVariants>, "nested"> & {
    /** Corner radius. Default follows `--radius` (6px). `false` is square. Pass a number for a custom radius. */
    rounded?: boolean | number
    /** Capsule ends. Wins over `rounded`. */
    pill?: boolean
    /** Show a trailing icon button inside the field (right). `true` uses a search icon. */
    button?: boolean | React.ReactNode
    /** Accessible name for the trailing icon button. Defaults to `"Search"` or `"Action"`. */
    buttonLabel?: string
    /** Native type of the trailing icon button. Defaults to `"button"`. */
    buttonType?: "button" | "submit"
    /** Variant of the trailing icon button. Defaults to Button `"default"`. */
    buttonVariant?: VariantProps<typeof buttonVariants>["variant"]
    onButtonClick?: () => void
  }) {
  const radius = resolveRadius(rounded, pill)
  const showButton = Boolean(button)
  const borderRadius =
    pill || typeof rounded === "number" || rounded === false
      ? radius
      : "var(--radius)"

  const input = (
    <input
      type={type}
      data-slot="input"
      data-size={size}
      {...props}
      disabled={disabled}
      className={cn(
        inputVariants({ size, nested: showButton }),
        showButton && "rounded-[inherit]",
        !showButton && className
      )}
      style={showButton ? undefined : { ...style, borderRadius }}
      ref={ref}
    />
  )

  if (!showButton) {
    return input
  }

  return (
    <div
      className={cn(inputShellVariants({ size }), "overflow-hidden", className)}
      style={{ ...style, borderRadius }}
    >
      {input}
      <Button
        type={buttonType}
        variant={buttonVariant}
        size="icon-xs"
        rounded
        disabled={disabled}
        aria-label={buttonLabel ?? (button === true ? "Search" : "Action")}
        onClick={onButtonClick}
        className={cn(
          "absolute inset-y-0 my-auto border-0 disabled:opacity-100",
          size === "sm" ? "end-px" : "end-1"
        )}
      >
        {button === true ? <Search /> : button}
      </Button>
    </div>
  )
}

export { Input, inputVariants }
