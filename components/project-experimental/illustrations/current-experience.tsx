import Image from "next/image";
import { IllustrationCanvas } from "@/components/project-experimental/illustrations/canvas";

export function CurrentExperienceIllustration({ label }: { label: string }) {
  return (
    <IllustrationCanvas label={label}>
      <div className="absolute left-1/2 top-1/2 h-[302.59px] w-[492.696px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[3px] bg-white shadow-[0_0_0_0.184px_rgba(0,0,0,0.25),0_15.458px_17.432px_rgba(0,0,0,0.07),0_6.458px_7.283px_rgba(0,0,0,0.05),0_3.453px_3.894px_rgba(0,0,0,0.04),0_1.936px_2.183px_rgba(0,0,0,0.04),0_1.028px_1.159px_rgba(0,0,0,0.03),0_0.428px_0.482px_rgba(0,0,0,0.02)]">
        <Image
          src="/work/project-experimental/spreadsheet.png"
          alt=""
          fill
          sizes="(max-width: 1023px) calc(100vw - 2rem), calc(100vw - 632px)"
          className="object-cover object-left-top"
        />
      </div>
    </IllustrationCanvas>
  );
}
