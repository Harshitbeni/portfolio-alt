import { cn } from "@/lib/utils";
import {
  IllustrationCanvas,
  IllustrationLettering,
} from "@/components/project-experimental/illustrations/canvas";
import {
  ConnectorBottomLeft,
  ConnectorBottomRight,
  ConnectorTopLeft,
  ConnectorTopRight,
  SketchIcon,
  UnderlineStrokeNarrow,
  UnderlineStrokeWide,
} from "@/components/project-experimental/illustrations/marks";

function Node({
  src,
  label,
  className,
  gapClassName = "gap-1.5",
}: {
  src: string;
  label: string;
  className?: string;
  gapClassName?: string;
}) {
  return (
    <div
      className={cn(
        "absolute flex h-6 -translate-x-1/2 -translate-y-1/2 items-center",
        gapClassName,
        className,
      )}
    >
      <SketchIcon src={src} />
      <IllustrationLettering className="whitespace-nowrap text-center">
        {label}
      </IllustrationLettering>
    </div>
  );
}

export function WhosTheUserIllustration({ label }: { label: string }) {
  return (
    <IllustrationCanvas label={label}>
      <div className="absolute left-[calc(50%+131.5px)] top-[calc(50%+68.32px)] flex h-[86.518px] w-[65px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="-rotate-[22.5deg]">
          <div className="relative h-[77.862px] w-[38.107px]">
            <ConnectorBottomRight className="absolute inset-[-0.96%_-1.97%] size-full max-w-none" />
          </div>
        </div>
      </div>
      <div className="absolute left-[calc(50%-134.5px)] top-[calc(50%+67.53px)] flex h-[93.052px] w-[82.997px] -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="-scale-y-100 -rotate-[163.2deg]">
          <div className="relative h-[78.147px] w-[63.101px]">
            <ConnectorBottomLeft className="absolute inset-[-0.96%_-1.19%] size-full max-w-none" />
          </div>
        </div>
      </div>

      <Node
        src="/work/project-experimental/icon-teams.svg"
        label="Teams"
        className="left-[calc(50%-194.5px)] top-[calc(50%-110px)] w-[67px]"
      />
      <Node
        src="/work/project-experimental/icon-legal.svg"
        label="Legal"
        className="left-[calc(50%+212px)] top-[calc(50%-107px)] w-[62px]"
      />
      <Node
        src="/work/project-experimental/icon-platforms.svg"
        label="Platforms"
        className="left-[calc(50%-198.25px)] top-[calc(50%+119px)] w-[89.5px]"
        gapClassName="gap-2"
      />
      <Node
        src="/work/project-experimental/icon-regions.svg"
        label="Regions"
        className="left-[calc(50%+212.25px)] top-[calc(50%+106px)] w-[78.5px]"
        gapClassName="gap-2"
      />

      <div className="absolute left-[calc(50%-116px)] top-[calc(50%-56px)] h-[84px] w-[64px] -translate-x-1/2 -translate-y-1/2">
        <ConnectorTopLeft className="absolute inset-[-0.89%_-1.17%] size-full max-w-none" />
      </div>
      <div className="absolute left-[calc(50%+132.5px)] top-[calc(50%-38px)] h-[86px] w-[73px] -translate-x-1/2 -translate-y-1/2">
        <ConnectorTopRight className="absolute inset-[-0.87%_-1.03%] size-full max-w-none" />
      </div>
      <div className="absolute left-[calc(50%-3.79px)] top-[calc(50%+32.64px)] h-[3.965px] w-[140.411px] -translate-x-1/2 -translate-y-1/2">
        <UnderlineStrokeWide className="absolute inset-[-18.92%_-0.53%] size-full max-w-none" />
      </div>
      <div className="absolute left-[calc(50%-4.64px)] top-[calc(50%+36.71px)] h-[3.06px] w-[115.959px] -translate-x-1/2 -translate-y-1/2">
        <UnderlineStrokeNarrow className="absolute inset-[-24.51%_-0.65%] size-full max-w-none" />
      </div>

      <p className="absolute left-[calc(50%+4px)] top-[calc(50%+4px)] -translate-x-1/2 whitespace-nowrap text-center text-xl font-semibold leading-[1.2] tracking-[-0.48px] text-gray-12 opacity-80">
        Privacy Teams
      </p>
    </IllustrationCanvas>
  );
}
