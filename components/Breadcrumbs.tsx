import Link from "next/link";
import { localizedPath, type Locale } from "@/lib/i18n";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items, locale, tone = "light" }: { items: BreadcrumbItem[]; locale: Locale; tone?: "light" | "dark" }) {
  const colour = tone === "dark" ? "text-white/62" : "text-ink/58";
  return (
    <nav aria-label={locale === "pt" ? "Navegação estrutural" : "Breadcrumb"} className={`flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold ${colour}`}>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="inline-flex items-center gap-2">
          {index > 0 ? <span aria-hidden="true">/</span> : null}
          {item.href ? <Link href={localizedPath(item.href, locale)} className="transition hover:text-yellow">{item.label}</Link> : <span aria-current="page">{item.label}</span>}
        </span>
      ))}
    </nav>
  );
}
