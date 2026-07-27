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
      className="border-t border-white/10 bg-ink px-5 py-20 text-white sm:px-8 lg:py-28"
      aria-labelledby="client-logos-title"
    >
      <Reveal className="mx-auto max-w-7xl">
        <div className="max-w-5xl">
          <span className="mb-7 block h-2 w-16 bg-yellow" aria-hidden="true" />
          <h2
            id="client-logos-title"
            className="max-w-6xl text-4xl font-extrabold uppercase leading-[0.96] tracking-[-0.04em] sm:text-5xl lg:text-7xl"
          >
            <span className="text-yellow">Brands</span> we&apos;ve worked with:
          </h2>
          <p className="mt-7 max-w-4xl text-lg leading-relaxed text-white/80 sm:text-xl">
            We&apos;ve had a blast working with some incredible brands - from fine
            dining restaurants to the inviting charm of hotels, and the spirited
            world of beverage and food brands.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 items-center gap-x-10 gap-y-12 sm:grid-cols-3 lg:mt-20 lg:grid-cols-4 lg:gap-x-16 lg:gap-y-16 xl:grid-cols-5">
          {publishedLogos.map((logo) => (
            <div
              key={`${logo.clientName}-${logo.logoUrl}`}
              className="flex h-24 items-center justify-center sm:h-28"
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
