"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

type PendingSubmitButtonProps = {
  label: string;
  pendingLabel?: string;
  className?: string;
};

export function PendingSubmitButton({
  label,
  pendingLabel = "Saving...",
  className = ""
}: PendingSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-black uppercase tracking-[0.17em] text-white transition hover:bg-ink/88 disabled:cursor-wait disabled:opacity-65 ${className}`}
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : null}
      {pending ? pendingLabel : label}
    </button>
  );
}
