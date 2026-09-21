"use client";

import { FileDown } from "lucide-react";

export function PrintPortfolioButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print-hidden inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/35 px-6 text-xs font-black uppercase tracking-[.14em] text-white transition hover:-translate-y-0.5 hover:border-yellow hover:text-yellow"
    >
      <FileDown size={16} aria-hidden="true" />
      {label}
    </button>
  );
}
