"use client";

import { Trash2 } from "lucide-react";
import { PendingSubmitButton } from "./PendingSubmitButton";

type FormAction = (formData: FormData) => void | Promise<void>;

export function DeleteContentButton({
  action,
  id,
  label,
  compact = false
}: {
  action: FormAction;
  id: string;
  label: string;
  compact?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(`Delete ${label}? This cannot be undone.`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <PendingSubmitButton
        label={compact ? "Delete" : "Delete permanently"}
        pendingLabel="Deleting..."
        className={`!bg-red-700 hover:!bg-red-800 ${compact ? "px-4 py-2 text-xs tracking-[0.13em]" : "mt-4"}`}
      />
      {!compact ? <span className="sr-only"><Trash2 aria-hidden="true" /></span> : null}
    </form>
  );
}
