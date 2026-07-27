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
    <section className="bg-ink px-5 py-16 sm:px-8 lg:py-24" aria-label="Client logos">
      <Reveal className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 items-center gap-x-10 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {publishedLogos.map((logo) => (
            <div
              key={`${logo.clientName}-${logo.logoUrl}`}
              className="flex h-24 items-center justify-center sm:h-28"
            >
              <img
                src={logo.logoUrl}
                alt=""
                className="h-auto max-h-full w-auto max-w-full object-contain"
              />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
