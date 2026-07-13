"use client";

import { useState } from "react";

type CopyFieldProps = {
  label: string;
  value: string;
};

export function CopyField({ label, value }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  async function copyValue() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div>
      <label className="block text-sm font-bold text-ink">
        {label}
        <input
          value={value}
          readOnly
          className="mt-2 w-full rounded-[8px] border border-ink/14 bg-white px-4 py-3 text-sm text-ink outline-none"
          onFocus={(event) => event.currentTarget.select()}
        />
      </label>
      <button
        type="button"
        onClick={copyValue}
        className="mt-3 rounded-full bg-ink px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-ink/88"
      >
        {copied ? "Copied" : "Copy URL"}
      </button>
    </div>
  );
}
