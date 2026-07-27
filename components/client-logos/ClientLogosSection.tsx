import type { ClientLogo } from "@/types/clientLogo";
import { Reveal } from "@/components/Reveal";

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
    <section
      className="border-t border-white/10 bg-ink px-5 py-12 text-white sm:px-8 lg:py-14"
      aria-labelledby="client-logos-title"
    >
      <Reveal className="mx-auto max-w-7xl">
        <div className="max-w-5xl">
          <span className="mb-5 block h-1 w-12 bg-yellow" aria-hidden="true" />
          <h2
            id="client-logos-title"
            className="max-w-4xl font-serif text-[clamp(1.8rem,3.2vw,2.8rem)] font-semibold leading-[1.05]"
          >
            <span className="text-yellow">Brands</span> we&apos;ve worked with:
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-white/68">
            We&apos;ve had a blast working with some incredible brands - from fine
            dining restaurants to the inviting charm of hotels, and the spirited
            world of beverage and food brands.
          </p>
        </div>

        <div className="mt-9 grid grid-cols-2 items-center gap-x-8 gap-y-7 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-12 lg:gap-y-8">
          {publishedLogos.map((logo) => (
            <div
              key={`${logo.clientName}-${logo.logoUrl}`}
              className="flex h-14 items-center justify-center sm:h-16"
            >
              <img
                src={logo.logoUrl}
                alt=""
                className="h-auto max-h-full w-auto max-w-full object-contain opacity-90 transition-opacity duration-300 hover:opacity-100"
              />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
