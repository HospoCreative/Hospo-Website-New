import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  width?: "standard" | "wide";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  body,
  action,
  align = "left",
  tone = "dark",
  width = "standard",
  className = ""
}: SectionHeadingProps) {
  const light = tone === "light";

  return (
    <div
      className={`section-heading ${align === "center" ? "mx-auto text-center" : ""} ${className}`}
    >
      {eyebrow ? <p className={`section-eyebrow ${light ? "text-yellow" : "text-ink/55"}`}>{eyebrow}</p> : null}
      <h2 className={`mt-3 ${width === "wide" ? "max-w-none" : "max-w-[52rem]"} font-serif text-[clamp(2.35rem,4.1vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.025em] ${align === "center" ? "mx-auto" : ""} ${light ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {body ? <div className={`mt-5 max-w-[42rem] text-[1.05rem] leading-8 ${align === "center" ? "mx-auto" : ""} ${light ? "text-white/70" : "text-ink/70"}`}>{body}</div> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
