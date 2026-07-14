"use client";

import { useState, type FormEvent } from "react";
import { Check, CheckSquare, LoaderCircle, Trash2 } from "lucide-react";
import { CopyField } from "@/components/admin/CopyField";
import { deleteMediaBatchAction } from "@/app/admin/(protected)/actions";

export type SelectableMediaFile = {
  bucket: string;
  path: string;
  name: string;
  publicUrl: string;
  updatedAt: string | null;
  size: number | null;
  mimeType: string | null;
};

type MediaSelectionGridProps = {
  bucket: string;
  files: SelectableMediaFile[];
};

function fileExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function isImageFile(file: SelectableMediaFile) {
  return (
    file.mimeType?.startsWith("image/") ||
    ["avif", "gif", "jpg", "jpeg", "png", "svg", "webp"].includes(
      fileExtension(file.name)
    )
  );
}

function isVideoFile(file: SelectableMediaFile) {
  return (
    file.mimeType?.startsWith("video/") ||
    ["mp4", "webm", "mov"].includes(fileExtension(file.name))
  );
}

function formatBytes(bytes: number | null) {
  if (!bytes) return "Unknown size";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatDate(value: string | null) {
  if (!value) return "No date";

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

export function MediaSelectionGrid({ bucket, files }: MediaSelectionGridProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const allSelected = selected.size === files.length && files.length > 0;

  function toggleFile(path: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(files.map((file) => file.path)));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!selected.size) {
      event.preventDefault();
      return;
    }

    const confirmed = window.confirm(
      `Permanently delete ${selected.size} selected file${selected.size === 1 ? "" : "s"}? This cannot be undone.`
    );

    if (!confirmed) {
      event.preventDefault();
      return;
    }

    setSubmitting(true);
  }

  return (
    <form action={deleteMediaBatchAction} onSubmit={handleSubmit} className="mt-6">
      <input type="hidden" name="bucket" value={bucket} />

      <div className="sticky top-20 z-20 mb-5 flex flex-col gap-3 rounded-[8px] border border-ink/10 bg-white/95 p-3 shadow-soft backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleAll}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-ink transition hover:border-ink disabled:cursor-wait disabled:opacity-50"
          >
            <CheckSquare className="h-4 w-4" aria-hidden="true" />
            {allSelected ? "Clear all" : "Select all"}
          </button>
          <span className="text-sm font-bold text-ink/58" aria-live="polite">
            {selected.size} selected
          </span>
        </div>

        <button
          type="submit"
          disabled={!selected.size || submitting}
          className="inline-flex min-w-52 items-center justify-center gap-2 rounded-full bg-red-700 px-5 py-3 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-ink/12 disabled:text-ink/42"
        >
          {submitting ? (
            <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          )}
          {submitting ? `Deleting ${selected.size}...` : "Delete selected"}
        </button>
      </div>

      {submitting ? (
        <div
          className="mb-5 flex items-center gap-3 rounded-[8px] border border-yellow/50 bg-yellow/10 p-4 text-sm font-bold text-ink"
          role="status"
        >
          <LoaderCircle className="h-5 w-5 animate-spin text-yellow" aria-hidden="true" />
          Deleting files and updating linked website content. Please keep this page open.
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {files.map((file) => {
          const image = isImageFile(file);
          const video = isVideoFile(file);
          const isSelected = selected.has(file.path);
          const value = JSON.stringify({ path: file.path, publicUrl: file.publicUrl });

          return (
            <article
              key={`${file.bucket}/${file.path}`}
              className={`relative overflow-hidden rounded-[8px] border bg-white transition ${
                isSelected
                  ? "border-yellow ring-4 ring-yellow/25"
                  : "border-ink/10 hover:border-ink/25"
              }`}
            >
              <label className="absolute left-3 top-3 z-10 flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-ink shadow-soft">
                <input
                  type="checkbox"
                  name="selected_media"
                  value={value}
                  checked={isSelected}
                  disabled={submitting}
                  onChange={() => toggleFile(file.path)}
                  className="sr-only"
                />
                <span
                  className={`grid h-5 w-5 place-items-center rounded border ${
                    isSelected ? "border-yellow bg-yellow text-ink" : "border-ink/30 bg-white"
                  }`}
                >
                  {isSelected ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : null}
                </span>
                {isSelected ? "Selected" : "Select"}
              </label>

              <a
                href={file.publicUrl}
                target="_blank"
                rel="noreferrer"
                className="block bg-ink/[0.04]"
              >
                {image ? (
                  <div
                    className="aspect-[4/3] bg-cover bg-center"
                    role="img"
                    aria-label={file.name}
                    style={{ backgroundImage: `url("${file.publicUrl}")` }}
                  />
                ) : video ? (
                  <video
                    src={file.publicUrl}
                    muted
                    playsInline
                    preload="metadata"
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="grid aspect-[4/3] place-items-center bg-ink text-center text-sm font-black uppercase tracking-[0.18em] text-white">
                    {fileExtension(file.name) || "File"}
                  </div>
                )}
              </a>

              <div className="space-y-4 p-4">
                <div>
                  <h3 className="line-clamp-2 text-base font-bold leading-6 text-ink">
                    {file.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-ink/50">
                    {formatDate(file.updatedAt)} · {formatBytes(file.size)}
                  </p>
                  <p className="mt-1 break-all text-xs font-semibold text-ink/42">
                    {file.path}
                  </p>
                </div>
                <CopyField label="Public URL" value={file.publicUrl} />
              </div>
            </article>
          );
        })}
      </div>
    </form>
  );
}
