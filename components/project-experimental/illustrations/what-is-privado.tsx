import Image from "next/image";
import {
  IllustrationCanvas,
  IllustrationLettering,
} from "@/components/project-experimental/illustrations/canvas";
import {
  ArrowCodebase,
  ArrowDataMaps,
  ArrowPrivacyRisks,
  ArrowThirdParties,
} from "@/components/project-experimental/illustrations/marks";

export function WhatIsPrivadoIllustration({ label }: { label: string }) {
  return (
    <IllustrationCanvas label={label}>
      <div className="absolute left-[254px] top-[150px] size-[60px] overflow-hidden rounded-full shadow-[0px_18px_60px_16px_rgba(138,103,232,0.2)]">
        <Image
          src="/work/project-experimental/privado-orb.png"
          alt=""
          width={60}
          height={60}
          className="size-[60px] object-cover"
        />
        <div className="absolute inset-0 bg-white/20" />
      </div>

      <IllustrationLettering className="absolute left-[140.5px] top-[172px] -translate-x-1/2 whitespace-nowrap text-center">
        Codebase
      </IllustrationLettering>
      <IllustrationLettering className="absolute left-[439px] top-[114px] -translate-x-1/2 whitespace-nowrap text-center">
        Third Parties
      </IllustrationLettering>
      <IllustrationLettering className="absolute left-[432.5px] top-[170px] -translate-x-1/2 whitespace-nowrap text-center">
        Data Maps
      </IllustrationLettering>
      <IllustrationLettering className="absolute left-[439px] top-[226px] -translate-x-1/2 whitespace-nowrap text-center">
        Privacy Risks
      </IllustrationLettering>

      <div className="absolute left-[179.5px] top-[177.88px] h-[7.807px] w-[39.914px]">
        <ArrowCodebase className="absolute inset-[-9.61%_-1.88%] size-full max-w-none" />
      </div>
      <div className="absolute left-[347.28px] top-[118px] h-[7.951px] w-[39.156px]">
        <ArrowThirdParties className="absolute inset-[-9.43%_-1.92%] size-full max-w-none" />
      </div>
      <div className="absolute left-[348.73px] top-[175px] h-[6.386px] w-[36.495px]">
        <ArrowDataMaps className="absolute inset-[-11.74%_-2.05%] size-full max-w-none" />
      </div>
      <div className="absolute left-[353.89px] top-[230px] h-[8.196px] w-[34.684px]">
        <ArrowPrivacyRisks className="absolute inset-[-9.15%_-2.16%] size-full max-w-none" />
      </div>
    </IllustrationCanvas>
  );
}
