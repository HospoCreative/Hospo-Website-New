"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { Check, LoaderCircle, Upload } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type LogoAsset = {
  path: string;
  publicUrl: string;
  name: string;
};

type StorageItem = {
  id: string | null;
  name: string;
};

const acceptedExtensions = /\.(avif|gif|jpe?g|png|svg|webp)$/i;

function safeFileName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-").replace(/-+/g, "-");
}

export function LogoPoolPicker({ initialValue = "" }: { initialValue?: string }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [assets, setAssets] = useState<LogoAsset[]>([]);
  const [selected, setSelected] = useState(initialValue);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    async function loadAssets() {
      setLoading(true);
      setError("");

      async function findPaths(prefix = "", depth = 0): Promise<string[]> {
        const { data, error: listError } = await supabase.storage
          .from("client-logos")
          .list(prefix, { limit: 100, offset: 0, sortBy: { column: "updated_at", order: "desc" } });

        if (listError) throw listError;

        const paths: string[] = [];
        for (const item of (data ?? []) as StorageItem[]) {
          const path = `${prefix}${item.name}`;
          if (item.id) {
            paths.push(path);
          } else if (depth < 3) {
            paths.push(...(await findPaths(`${path}/`, depth + 1)));
          }
        }
        return paths;
      }

      try {
        const paths = await findPaths();
        setAssets(
          paths
            .filter((path) => acceptedExtensions.test(path))
            .map((path) => ({
              path,
              name: path.split("/").pop() ?? path,
              publicUrl: supabase.storage.from("client-logos").getPublicUrl(path).data.publicUrl
            }))
        );
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not load the logo pool.");
      } finally {
        setLoading(false);
      }
    }

    void loadAssets();
  }, [supabase]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    setFile(nextFile);
    setError("");
    setNotice("");
  }

  async function handleUpload() {
    if (!file) {
      setError("Choose a logo file first.");
      return;
    }
    if (!acceptedExtensions.test(file.name)) {
      setError("Choose an image file: SVG, PNG, JPG, WebP, GIF, or AVIF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Logo files must be 10 MB or smaller.");
      return;
    }

    setUploading(true);
    setError("");
    setNotice("");
    const path = `${new Date().toISOString().slice(0, 10)}/${Date.now()}-${safeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from("client-logos")
      .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const publicUrl = supabase.storage.from("client-logos").getPublicUrl(path).data.publicUrl;
    setAssets((current) => [{ path, name: file.name, publicUrl }, ...current]);
    setSelected(publicUrl);
    setFile(null);
    setNotice("Logo added to the pool and selected.");
    setUploading(false);
  }

  return (
    <div className="grid gap-4 rounded-[8px] border border-ink/10 bg-ink/[0.02] p-4">
      <input type="hidden" name="logo_url" required value={selected} readOnly />
      <div>
        <p className="text-sm font-black uppercase tracking-[0.14em] text-ink">Logo pool</p>
        <p className="mt-1 text-sm leading-6 text-ink/65">
          Upload a white logo or choose one already in your pool. Nothing else is required.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          accept="image/*,.svg"
          onChange={handleFileChange}
          className="block w-full text-sm text-ink file:mr-4 file:rounded-[6px] file:border-0 file:bg-white file:px-3 file:py-2 file:font-bold file:text-ink"
        />
        <button
          type="button"
          onClick={() => void handleUpload()}
          disabled={uploading}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[6px] bg-ink px-4 py-2.5 text-sm font-black uppercase tracking-[0.1em] text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />}
          {uploading ? "Uploading" : "Add logo"}
        </button>
      </div>

      {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
      {notice ? <p className="text-sm font-semibold text-emerald-700">{notice}</p> : null}

      {loading ? (
        <p className="text-sm text-ink/60">Loading logo pool...</p>
      ) : assets.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {assets.map((asset) => {
            const isSelected = selected === asset.publicUrl;
            return (
              <button
                key={asset.path}
                type="button"
                onClick={() => {
                  setSelected(asset.publicUrl);
                  setNotice("Logo selected.");
                }}
                className={`relative flex h-24 items-center justify-center rounded-[6px] border p-4 transition ${
                  isSelected ? "border-yellow bg-ink ring-2 ring-yellow/45" : "border-ink/15 bg-ink"
                }`}
                aria-pressed={isSelected}
                title={asset.name}
              >
                <img src={asset.publicUrl} alt="" className="max-h-full max-w-full object-contain" />
                {isSelected ? (
                  <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-yellow text-ink">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-ink/60">No logo files in the pool yet. Upload the first one above.</p>
      )}
    </div>
  );
}
