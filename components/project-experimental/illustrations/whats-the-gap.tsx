import { IllustrationCanvas } from "@/components/project-experimental/illustrations/canvas";
import {
  FailureXBadge,
  SuccessTickBadge,
} from "@/components/project-experimental/illustrations/marks";
import { cn } from "@/lib/utils";

const deviceShadow =
  "shadow-[0px_0.5px_1.5px_0px_rgba(0,0,0,0.1),0px_0.5px_1px_0px_rgba(0,0,0,0.06)]";

export function WhatsTheGapIllustration({ label }: { label: string }) {
  return (
    <IllustrationCanvas label={label}>
      <div className="absolute inset-0 flex items-center gap-4">
        <div className="relative h-full min-w-px flex-1">
          <div
            className={cn(
              "absolute left-1/2 top-1/2 h-[160px] w-[200px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[8px] bg-white",
              deviceShadow,
            )}
          >
            <div className="absolute left-0 top-0 h-[34.5px] w-[200px] bg-gray-3" />
            <div className="absolute left-[32.5px] top-[3px] h-[31.5px] w-[53.5px] rounded-[6px] bg-white" />
            <div className="absolute left-[88px] top-[3px] h-[31.5px] w-[53.5px] rounded-[6px] bg-gray-5" />
            <div className="absolute left-[143.5px] top-[3px] h-[31.5px] w-[53.5px] rounded-[6px] bg-gray-5" />
            <div className="absolute left-0 top-[22.5px] h-[31.5px] w-[200px] bg-white" />
            <div className="absolute left-[8px] top-[9.5px] flex items-center gap-[2px]">
              <span className="size-1 rounded-full bg-red-9" />
              <span className="size-1 rounded-full bg-yellow-8" />
              <span className="size-1 rounded-full bg-green-9" />
            </div>
          </div>
          <SuccessTickBadge className="absolute left-[calc(50%+96px)] top-[calc(50%+76px)] size-6 -translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="relative h-full min-w-px flex-1">
          <div
            className={cn(
              "absolute left-1/2 top-1/2 h-[200px] w-[120px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[16px] border-4 border-black bg-gray-2",
              deviceShadow,
            )}
          >
            <div className="absolute left-1/2 top-[6px] h-[12px] w-[40px] -translate-x-1/2 rounded-[16px] bg-black" />
          </div>
          <FailureXBadge className="absolute left-[calc(50%+56px)] top-[calc(50%+96px)] size-6 -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </IllustrationCanvas>
  );
}
