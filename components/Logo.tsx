import Image from "next/image";

type LogoProps = {
  variant?: "yellow" | "white";
  className?: string;
  priority?: boolean;
};

export function Logo({
  variant = "yellow",
  className = "h-10 w-auto",
  priority = false
}: LogoProps) {
  const src =
    variant === "white"
      ? "/logos/hospo-logo-white-transparent.png"
      : "/logos/hospo-logo-navy-transparent.png";

  return (
    <Image
      src={src}
      alt="Hospo Creative"
      width={512}
      height={512}
      className={`${className} min-w-[7.5rem] object-cover object-center`}
      priority={priority}
    />
  );
}
