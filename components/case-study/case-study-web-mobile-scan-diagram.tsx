"use client";

import { createElement } from "react";
import { useIcons, type IconName } from "@/lib/icon-context";
import { cn } from "@/lib/utils";

type FlowRowProps = {
  label: string;
  firstLabel: string;
  secondLabel: string;
  result: string;
  destinationIcon: IconName;
  blocked?: boolean;
};

function FlowNode({ icon }: { icon: IconName }) {
  const icons = useIcons();

  return (
    <div className="flex size-8 items-center justify-center rounded-md bg-gray-9 text-gray-1">
      {createElement(icons[icon], { size: 18 })}
    </div>
  );
}

function FlowArrow({ label, blocked }: { label: string; blocked?: boolean }) {
  return (
    <div className="relative flex min-w-0 items-center justify-center pt-9">
      <span className="absolute top-0 rounded-md border border-gray-a6 bg-gray-3 px-2 py-1 text-center text-xxs leading-4 text-gray-a11">
        {label}
      </span>
      <span className="h-px w-full bg-gray-a6" aria-hidden />
      {blocked ? (
        <span className="absolute text-lg-medium text-red-9" aria-hidden>
          ×
        </span>
      ) : null}
      <span
        className="size-2 -translate-x-1 rotate-45 border-r border-t border-gray-a7"
        aria-hidden
      />
    </div>
  );
}

function FlowRow({
  label,
  firstLabel,
  secondLabel,
  result,
  destinationIcon,
  blocked,
}: FlowRowProps) {
  const icons = useIcons();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[32px_minmax(64px,1fr)_32px_minmax(64px,1fr)_32px] items-center gap-3">
        <FlowNode icon="components" />
        <FlowArrow label={firstLabel} />
        <div className="flex size-8 items-center justify-center rounded-full bg-gray-12 text-gray-1">
          {createElement(icons.folder, { size: 18 })}
        </div>
        <FlowArrow label={secondLabel} blocked={blocked} />
        <FlowNode icon={destinationIcon} />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span
          className={cn(
            "rounded-md px-3 py-1 text-center text-xxs leading-4",
            blocked
              ? "bg-purple-a2 text-purple-11"
              : "bg-purple-9 text-gray-1",
          )}
        >
          {result}
        </span>
        <p className="text-md-medium text-gray-a12">{label}</p>
      </div>
    </div>
  );
}

function MobileFlowArrow({ label, blocked }: { label: string; blocked?: boolean }) {
  return (
    <div className="relative flex h-[76px] w-full justify-center">
      <span className="absolute top-1 max-w-[150px] rounded-md border border-gray-a6 bg-gray-3 px-2 py-1 text-center text-xxs leading-4 text-gray-a11">
        {label}
      </span>
      <span className="absolute bottom-0 top-8 w-px bg-gray-a6" aria-hidden />
      {blocked ? (
        <span className="absolute bottom-4 z-10 bg-gray-2 px-1 text-lg-medium text-red-9" aria-hidden>
          ×
        </span>
      ) : null}
      <span
        className="absolute bottom-0 size-2 rotate-[135deg] border-r border-t border-gray-a7"
        aria-hidden
      />
    </div>
  );
}

function MobileFlowRow(props: FlowRowProps) {
  const icons = useIcons();

  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <FlowNode icon="components" />
      <MobileFlowArrow label={props.firstLabel} />
      <div className="flex size-8 items-center justify-center rounded-full bg-gray-12 text-gray-1">
        {createElement(icons.folder, { size: 18 })}
      </div>
      <MobileFlowArrow label={props.secondLabel} blocked={props.blocked} />
      <FlowNode icon={props.destinationIcon} />
      <div className="mt-5 flex flex-col items-center gap-1.5">
        <span
          className={cn(
            "rounded-md px-3 py-1 text-center text-xxs leading-4",
            props.blocked
              ? "bg-purple-a2 text-purple-11"
              : "bg-purple-9 text-gray-1",
          )}
        >
          {props.result}
        </span>
        <p className="text-md-medium text-gray-a12">{props.label}</p>
      </div>
    </div>
  );
}

export function CaseStudyWebMobileScanDiagram() {
  return (
    <>
      <div className="flex h-[920px] flex-col rounded-md border border-gray-a6 bg-gray-a2 px-10 py-6 shadow-sm sm:hidden">
        <MobileFlowRow
          label="Web"
          firstLabel="Changes made in codebase"
          secondLabel="Update deployed"
          result="Privado Code-Scan"
          destinationIcon="globe"
        />
        <div className="h-px bg-gray-a6" />
        <MobileFlowRow
          label="Mobile"
          firstLabel="Changes made in codebase"
          secondLabel="Packaged into .apk or .ipa"
          result="Privado is locked out"
          destinationIcon="play"
          blocked
        />
      </div>
      <div className="hidden rounded-md border border-gray-a6 bg-gray-a2 px-20 py-14 shadow-sm sm:block">
        <FlowRow
          label="Web"
          firstLabel="Changes made in codebase"
          secondLabel="Update deployed"
          result="Privado Code-Scan"
          destinationIcon="globe"
        />
        <div className="my-6 h-px bg-gray-a6" />
        <FlowRow
          label="Mobile"
          firstLabel="Changes made in codebase"
          secondLabel="Packaged into .apk or .ipa"
          result="Privado is locked out"
          destinationIcon="play"
          blocked
        />
      </div>
    </>
  );
}
