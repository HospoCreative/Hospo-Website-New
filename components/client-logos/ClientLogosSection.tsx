import Image from "next/image";
import type { ClientLogo } from "@/types/clientLogo";
import { Reveal } from "@/components/Reveal";
import { translate, type Locale } from "@/lib/i18n";

type ClientLogosSectionProps = {
  logos: ClientLogo[];
  locale?: Locale;
};

export function ClientLogosSection({ logos, locale = "en" }: ClientLogosSectionProps) {
  const publishedLogos = logos
    .filter((logo) => logo.published && logo.logoUrl)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (!publishedLogos.length) {
    return null;
  }

  return (
    <section
      className="overflow-hidden border-y border-white/14 bg-ink py-10 text-white sm:py-12"
      aria-labelledby="client-logos-title"
    >
      <Reveal className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="section-eyebrow text-yellow">{translate(locale, "Clients & partners")}</p>
          <h2
            id="client-logos-title"
            className="max-w-4xl font-serif text-[clamp(1.8rem,3.2vw,2.8rem)] font-semibold leading-[1.05] text-white"
          >
            {translate(locale, "Brands we have supported.")}
          </h2>
        </div>
      </Reveal>

      <div className="mt-8 border-y border-white/14 py-6 sm:mt-10 sm:py-7">
        <div className="marquee-track flex w-max items-center gap-12 px-6 sm:gap-16 sm:px-8 lg:gap-24">
          {publishedLogos.map((logo) => (
            <div key={`${logo.clientName}-${logo.logoUrl}`} className="flex h-20 w-44 shrink-0 items-center justify-center sm:h-24 sm:w-52 lg:h-28 lg:w-60">
              <Image
                src={logo.logoUrl}
                alt={logo.alt || `${logo.clientName} logo`}
                width={320}
                height={160}
                sizes="(min-width: 1024px) 240px, (min-width: 640px) 208px, 176px"
                className="h-16 w-auto max-w-full object-contain sm:h-20 lg:h-24"
              />
            </div>
          ))}
          <div className="flex items-center gap-12 sm:gap-16 lg:gap-24" aria-hidden="true">
            {publishedLogos.map((logo) => (
              <div key={`duplicate-${logo.clientName}-${logo.logoUrl}`} className="flex h-20 w-44 shrink-0 items-center justify-center sm:h-24 sm:w-52 lg:h-28 lg:w-60">
                <Image
                  src={logo.logoUrl}
                  alt=""
                  width={320}
                  height={160}
                  sizes="(min-width: 1024px) 240px, (min-width: 640px) 208px, 176px"
                  className="h-16 w-auto max-w-full object-contain sm:h-20 lg:h-24"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
