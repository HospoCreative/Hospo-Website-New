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

      <div className="mt-4 sm:mt-5">
        <div className="marquee-track flex w-max items-center gap-14 px-6 sm:gap-20 sm:px-8 lg:gap-28">
          {publishedLogos.map((logo) => (
            <div key={`${logo.clientName}-${logo.logoUrl}`} className="flex h-40 w-72 shrink-0 items-center justify-center sm:h-48 sm:w-96 lg:h-56 lg:w-[30rem]">
              <Image
                src={logo.logoUrl}
                alt={logo.alt || `${logo.clientName} logo`}
                width={640}
                height={320}
                sizes="(min-width: 1024px) 480px, (min-width: 640px) 384px, 288px"
                className="h-40 w-auto max-w-full object-contain sm:h-48 lg:h-56"
              />
            </div>
          ))}
          <div className="flex items-center gap-14 sm:gap-20 lg:gap-28" aria-hidden="true">
            {publishedLogos.map((logo) => (
              <div key={`duplicate-${logo.clientName}-${logo.logoUrl}`} className="flex h-40 w-72 shrink-0 items-center justify-center sm:h-48 sm:w-96 lg:h-56 lg:w-[30rem]">
                <Image
                  src={logo.logoUrl}
                  alt=""
                  width={640}
                  height={320}
                  sizes="(min-width: 1024px) 480px, (min-width: 640px) 384px, 288px"
                  className="h-40 w-auto max-w-full object-contain sm:h-48 lg:h-56"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
