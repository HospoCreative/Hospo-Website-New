"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

type StorageItem = { id: string | null; name: string };
type MediaAsset = { path: string; name: string; publicUrl: string; isVideo: boolean };

const mediaExtensions = /\.(avif|gif|jpe?g|png|webp|mp4|webm|mov|m4v)$/i;
const videoExtensions = /\.(mp4|webm|mov|m4v)$/i;

function MediaPicker({
  bucket,
  selectedUrl,
  onSelect
}: {
  bucket: "case-study-media" | "blog-media";
  selectedUrl?: string;
  onSelect: (asset: MediaAsset) => void;
}) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAssets() {
      setLoading(true);
      setError("");

      async function findPaths(prefix = "", depth = 0): Promise<string[]> {
        const { data, error: listError } = await supabase.storage
          .from(bucket)
          .list(prefix, { limit: 100, offset: 0, sortBy: { column: "updated_at", order: "desc" } });

        if (listError) throw listError;

        const paths: string[] = [];
        for (const item of (data ?? []) as StorageItem[]) {
          const path = `${prefix}${item.name}`;
          if (item.id) paths.push(path);
          else if (depth < 3) paths.push(...(await findPaths(`${path}/`, depth + 1)));
        }
        return paths;
      }

      try {
        const paths = await findPaths();
        setAssets(
          paths
            .filter((path) => mediaExtensions.test(path))
            .map((path) => ({
              path,
              name: path.split("/").pop() ?? path,
              publicUrl: supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl,
              isVideo: videoExtensions.test(path)
            }))
        );
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not load media from Storage.");
      } finally {
        setLoading(false);
      }
    }

    void loadAssets();
  }, [bucket, supabase]);

  if (loading) {
    return <p className="mt-3 flex items-center gap-2 text-sm font-medium text-ink/60"><LoaderCircle className="size-4 animate-spin" /> Loading media…</p>;
  }

  if (error) return <p className="mt-3 text-sm font-semibold text-red-700">{error}</p>;
  if (!assets.length) return <p className="mt-3 text-sm font-medium text-ink/60">No media files are available in this library yet.</p>;

  return (
    <div className="mt-3 grid max-h-64 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3">
      {assets.map((asset) => {
        const isSelected = selectedUrl === asset.publicUrl;
        return (
          <button
            key={asset.path}
            type="button"
            onClick={() => onSelect(asset)}
            className={`relative overflow-hidden rounded-[6px] border text-left transition ${isSelected ? "border-yellow ring-2 ring-yellow/45" : "border-ink/15 hover:border-ink/40"}`}
            aria-pressed={isSelected}
            title={`Select ${asset.name}`}
          >
            {asset.isVideo ? (
              <video src={asset.publicUrl} muted playsInline preload="metadata" className="aspect-[4/3] w-full bg-ink object-cover" />
            ) : (
              <span className="relative block aspect-[4/3] w-full bg-ink/[0.05]">
                <Image src={asset.publicUrl} alt="" fill sizes="(min-width: 640px) 14rem, 50vw" className="object-cover" />
              </span>
            )}
            <span className="relative z-10 block truncate px-2 py-1.5 text-xs font-bold text-ink">{asset.name}</span>
            {isSelected ? <span className="absolute right-1.5 top-1.5 z-10 grid size-5 place-items-center rounded-full bg-yellow text-ink"><Check className="size-3" strokeWidth={3} /></span> : null}
          </button>
        );
      })}
    </div>
  );
}

const inputClass = "mt-2 w-full rounded-[8px] border border-ink/14 px-4 py-3 text-base text-ink outline-none transition focus:border-yellow focus:ring-2 focus:ring-yellow/30";
const labelClass = "block text-sm font-bold text-ink";
const helpClass = "mt-2 block text-sm font-medium leading-6 text-ink/56";

export function CaseStudyMediaFields({ heroImage = "", heroImageAlt = "", gallery = "" }: { heroImage?: string; heroImageAlt?: string; gallery?: string }) {
  const [hero, setHero] = useState(heroImage);
  const [galleryValue, setGalleryValue] = useState(gallery);

  function selectHero(asset: MediaAsset) {
    setHero(asset.publicUrl);
    setGalleryValue((current) => current.split("\n").filter((line) => line.trim().split("|")[0]?.trim() !== asset.publicUrl).join("\n"));
  }

  function addToGallery(asset: MediaAsset) {
    setGalleryValue((current) => {
      const urls = current.split("\n").map((line) => line.trim().split("|")[0]?.trim());
      return urls.includes(asset.publicUrl) ? current : [current.trim(), asset.publicUrl].filter(Boolean).join("\n");
    });
  }

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[8px] border border-ink/10 p-4">
          <label className={labelClass}>Hero media URL<input name="hero_image" value={hero} onChange={(event) => setHero(event.target.value)} className={inputClass} /></label>
          <span className={helpClass}>Choose a separate hero from your case-study media. Video heroes play automatically without controls.</span>
          <MediaPicker bucket="case-study-media" selectedUrl={hero} onSelect={selectHero} />
        </div>
        <label className={labelClass}>Hero media alt<input name="hero_image_alt" defaultValue={heroImageAlt} className={inputClass} /></label>
      </div>
      <div className="rounded-[8px] border border-ink/10 p-4">
        <label className={labelClass}>Gallery media URLs<textarea name="gallery_images" rows={7} value={galleryValue} onChange={(event) => setGalleryValue(event.target.value)} className={inputClass} placeholder={"https://.../image-1.jpg | Alt text | Optional caption\nhttps://.../video-1.mp4 | Alt text | Optional caption"} /></label>
        <span className={helpClass}>Select media below to add its URL automatically. Add one item per line; you can optionally add alt text and a caption after pipes.</span>
        <MediaPicker bucket="case-study-media" onSelect={addToGallery} />
      </div>
    </>
  );
}

export function BlogCoverMediaFields({ coverImage = "", coverImageAlt = "" }: { coverImage?: string; coverImageAlt?: string }) {
  const [cover, setCover] = useState(coverImage);
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="rounded-[8px] border border-ink/10 p-4">
        <label className={labelClass}>Cover image URL<input name="cover_image" value={cover} onChange={(event) => setCover(event.target.value)} className={inputClass} /></label>
        <MediaPicker bucket="blog-media" selectedUrl={cover} onSelect={(asset) => setCover(asset.publicUrl)} />
      </div>
      <label className={labelClass}>Cover image alt<input name="cover_image_alt" defaultValue={coverImageAlt} className={inputClass} /></label>
    </div>
  );
}
