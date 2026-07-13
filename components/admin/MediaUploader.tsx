"use client";

import { useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { CopyField } from "@/components/admin/CopyField";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type MediaBucket = {
  name: string;
  label: string;
  accepts: string;
  maxBytes: number;
  maxSizeLabel: string;
};

type UploadResult = {
  bucket: string;
  path: string;
  publicUrl: string;
};

type MediaUploaderProps = {
  buckets: MediaBucket[];
};

function safeFileName(name: string) {
  const fallback = "media-upload";
  const cleaned = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return cleaned || fallback;
}

function formatBytes(bytes: number) {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(size >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export function MediaUploader({ buckets }: MediaUploaderProps) {
  const router = useRouter();
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [bucket, setBucket] = useState(buckets[0]?.name ?? "case-study-media");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<UploadResult | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFile(event.target.files?.[0] ?? null);
    setError("");
    setResult(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!file) {
      setError("Choose a file to upload.");
      return;
    }

    const selectedBucket = buckets.find((item) => item.name === bucket);

    if (selectedBucket && file.size > selectedBucket.maxBytes) {
      setError(
        `${file.name} is ${formatBytes(file.size)}. ${selectedBucket.label} accepts files up to ${selectedBucket.maxSizeLabel}. Compress the video or raise the Supabase bucket limit before uploading.`
      );
      return;
    }

    setUploading(true);
    setError("");
    setResult(null);

    const folder = new Date().toISOString().slice(0, 10);
    const path = `${folder}/${Date.now()}-${safeFileName(file.name)}`;

    const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type || undefined,
      upsert: false
    });

    setUploading(false);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from(bucket).getPublicUrl(path);

    setResult({ bucket, path, publicUrl });
    router.refresh();
  }

  return (
    <div className="mt-8 space-y-6">
      {error ? (
        <div className="rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-5 text-ink shadow-soft">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-emerald-700">
            Uploaded
          </p>
          <p className="mt-2 text-base leading-7 text-ink/70">
            Your file is in <strong>{result.bucket}</strong> at{" "}
            <strong>{result.path}</strong>.
          </p>
          <div className="mt-4">
            <CopyField label="Public media URL" value={result.publicUrl} />
          </div>
          <a
            href={result.publicUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex text-sm font-black uppercase tracking-[0.16em] text-ink transition hover:text-yellow"
          >
            Open uploaded file
          </a>
        </div>
      ) : null}

      <form
        onSubmit={handleSubmit}
        className="grid gap-5 rounded-[8px] bg-white p-6 shadow-soft lg:grid-cols-[1fr_1fr_auto] lg:items-end"
      >
        <label className="block text-sm font-bold text-ink">
          Destination
          <select
            value={bucket}
            onChange={(event) => setBucket(event.target.value)}
            className="mt-2 w-full rounded-[8px] border border-ink/14 px-4 py-3 text-base text-ink outline-none transition focus:border-yellow focus:ring-2 focus:ring-yellow/30"
          >
            {buckets.map((item) => (
              <option key={item.name} value={item.name}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-bold text-ink">
          File
          <input
            type="file"
            required
            accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml,video/mp4,video/webm,video/quicktime"
            onChange={handleFileChange}
            className="mt-2 w-full rounded-[8px] border border-ink/14 px-4 py-3 text-base text-ink file:mr-4 file:rounded-full file:border-0 file:bg-ink file:px-4 file:py-2 file:text-xs file:font-black file:uppercase file:tracking-[0.14em] file:text-white"
          />
          <span className="mt-2 block text-xs font-semibold text-ink/52">
            {buckets.find((item) => item.name === bucket)?.accepts} · max{" "}
            {buckets.find((item) => item.name === bucket)?.maxSizeLabel}
          </span>
        </label>
        <button
          type="submit"
          disabled={uploading}
          className="rounded-full bg-ink px-6 py-4 text-sm font-black uppercase tracking-[0.17em] text-white transition hover:bg-ink/88 disabled:cursor-wait disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload file"}
        </button>
      </form>
    </div>
  );
}
