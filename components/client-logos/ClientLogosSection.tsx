import type { ClientLogo } from "@/types/clientLogo";
import { Reveal } from "@/components/Reveal";
import { SmartImage } from "@/components/SmartImage";

type ClientLogosSectionProps = {
  logos: ClientLogo[];
};

export function ClientLogosSection({ logos }: ClientLogosSectionProps) {
  const publishedLogos = logos
    .filter((logo) => logo.published && logo.logoUrl)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (!publishedLogos.length) {
    return null;
  }

  return (
    <section className="bg-white px-5 py-20 text-ink sm:px-8 lg:py-28" aria-label="Selected clients">
      <div className="mx-auto max-w-7xl">
        <Reveal className="max-w-5xl">
          <p className="section-eyebrow text-ink/55">Selected Clients</p>
          <h2 className="mt-5 font-serif text-[clamp(2.7rem,9vw,5.4rem)] font-semibold leading-[0.98]">
            Brands we’ve worked with.
          </h2>
          <p className="mt-7 max-w-3xl text-xl leading-9 text-ink/72 sm:text-2xl sm:leading-10">
            A selection of hospitality brands, venues and guest-experience businesses supported through strategy, content, campaigns and digital visibility.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[8px] border border-ink/10 bg-ink/10 sm:grid-cols-3 lg:grid-cols-4">
          {publishedLogos.map((logo) => {
            const image = (
              <div className="relative flex min-h-36 items-center justify-center bg-white p-8 transition duration-300 hover:bg-ink/[0.035] sm:min-h-44">
                <SmartImage
                  src={logo.logoUrl}
                  alt={logo.alt}
                  width={220}
                  height={110}
                  className="h-auto max-h-20 w-full max-w-44 object-contain"
                  fallbackLabel={logo.clientName}
                />
              </div>
            );

            return logo.url ? (
              <a key={logo.clientName} href={logo.url} target="_blank" rel="noreferrer">
                {image}
              </a>
            ) : (
              <div key={logo.clientName}>{image}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
