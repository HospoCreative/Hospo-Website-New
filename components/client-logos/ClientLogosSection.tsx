import Image from "next/image";
import type { ClientLogo } from "@/types/clientLogo";
import { Reveal } from "@/components/Reveal";
import { translate, type Locale } from "@/lib/i18n";
import { SectionHeading } from "@/components/SectionHeading";

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
      className="overflow-hidden bg-ink py-[var(--hc-section-compact)] text-white"
      aria-labelledby="client-logos-title"
    >
      <Reveal className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          tone="light"
          eyebrow={translate(locale, "Clients & partners")}
          title={<span id="client-logos-title">{translate(locale, "Brands we have supported.")}</span>}
        />
      </Reveal>

      <div className="mt-8 sm:mt-10">
        <div className="marquee-track flex w-max items-center gap-12 px-6 sm:gap-16 sm:px-8 lg:gap-24">
          {publishedLogos.map((logo) => (
            <div key={`${logo.clientName}-${logo.logoUrl}`} className="flex h-24 w-48 shrink-0 items-center justify-center sm:h-28 sm:w-56 lg:h-32 lg:w-64">
              <Image
                src={logo.logoUrl}
                alt={logo.alt || `${logo.clientName} logo`}
                width={320}
                height={160}
                sizes="(min-width: 1024px) 256px, (min-width: 640px) 224px, 192px"
                className="h-20 w-auto max-w-full object-contain sm:h-24 lg:h-28"
              />
            </div>
          ))}
          <div className="flex items-center gap-12 sm:gap-16 lg:gap-24" aria-hidden="true">
            {publishedLogos.map((logo) => (
              <div key={`duplicate-${logo.clientName}-${logo.logoUrl}`} className="flex h-24 w-48 shrink-0 items-center justify-center sm:h-28 sm:w-56 lg:h-32 lg:w-64">
                <Image
                  src={logo.logoUrl}
                  alt=""
                  width={320}
                  height={160}
                  sizes="(min-width: 1024px) 256px, (min-width: 640px) 224px, 192px"
                  className="h-20 w-auto max-w-full object-contain sm:h-24 lg:h-28"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
