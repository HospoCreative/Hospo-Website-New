import { MediaUploader } from "@/components/admin/MediaUploader";
import { MediaSelectionGrid } from "@/components/admin/MediaSelectionGrid";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const buckets = [
  {
    name: "case-study-media",
    label: "Case study media",
    purpose: "Portfolio photography, campaign assets and case-study images or videos",
    accepts: "JPG, PNG, WebP, AVIF, MP4, WebM, MOV",
    maxBytes: 524288000,
    maxSizeLabel: "500 MB"
  },
  {
    name: "blog-media",
    label: "Blog media",
    purpose: "Article cover images and supporting blog visuals",
    accepts: "JPG, PNG, WebP, AVIF",
    maxBytes: 52428800,
    maxSizeLabel: "50 MB"
  },
  {
    name: "client-logos",
    label: "Client logos",
    purpose: "Client logo files for the logo strip",
    accepts: "SVG, PNG, JPG, WebP",
    maxBytes: 10485760,
    maxSizeLabel: "10 MB"
  }
];

type StorageMetadata = {
  size?: number;
  mimetype?: string;
  [key: string]: unknown;
};

type StorageListItem = {
  id: string | null;
  name: string;
  updated_at: string | null;
  created_at: string | null;
  metadata: StorageMetadata | null;
};

type MediaFile = {
  bucket: string;
  path: string;
  name: string;
  publicUrl: string;
  updatedAt: string | null;
  size: number | null;
  mimeType: string | null;
};

async function listBucketFiles(
  bucket: string,
  prefix = "",
  depth = 0
): Promise<MediaFile[]> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage.from(bucket).list(prefix, {
    limit: 100,
    offset: 0,
    sortBy: { column: "updated_at", order: "desc" }
  });

  if (error || !data?.length) {
    return [];
  }

  const files: MediaFile[] = [];

  for (const item of data as StorageListItem[]) {
    const itemPath = `${prefix}${item.name}`;

    if (!item.id && depth < 3) {
      const nestedFiles = await listBucketFiles(bucket, `${itemPath}/`, depth + 1);
      files.push(...nestedFiles);
      continue;
    }

    if (!item.id) {
      continue;
    }

    const {
      data: { publicUrl }
    } = supabase.storage.from(bucket).getPublicUrl(itemPath);

    files.push({
      bucket,
      path: itemPath,
      name: item.name,
      publicUrl,
      updatedAt: item.updated_at ?? item.created_at,
      size: typeof item.metadata?.size === "number" ? item.metadata.size : null,
      mimeType: typeof item.metadata?.mimetype === "string" ? item.metadata.mimetype : null
    });
  }

  return files.sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
    return dateB - dateA;
  });
}

async function getMediaLibrary() {
  const entries = await Promise.all(
    buckets.map(async (bucket) => ({
      ...bucket,
      files: await listBucketFiles(bucket.name)
    }))
  );

  return entries;
}

type AdminMediaPageProps = {
  searchParams: Promise<{ message?: string; error?: string; count?: string }>;
};

export default async function AdminMediaPage({ searchParams }: AdminMediaPageProps) {
  const params = await searchParams;
  const mediaLibrary = await getMediaLibrary();
  const deletedCount = Number(params.count ?? 0);

  return (
    <div>
      <p className="section-eyebrow text-ink/55">Media</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold leading-none sm:text-6xl">
        Upload media.
      </h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">
        Upload files directly to Supabase Storage, copy the public URL, then paste it into the relevant
        case study, blog or client logo form.
      </p>

      {params.error ? (
        <div className="mt-6 rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm font-bold leading-6 text-red-700">
          <strong>Deletion failed:</strong> {params.error}
        </div>
      ) : null}

      {params.message === "deleted" ? (
        <div className="mt-6 rounded-[8px] border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-800">
          Deleted {deletedCount || 1} file{deletedCount === 1 ? "" : "s"} successfully. Linked website content was updated too.
        </div>
      ) : null}

      <MediaUploader buckets={buckets} />

      <div className="mt-12 space-y-10">
        {mediaLibrary.map((bucket) => (
          <section key={bucket.name} className="rounded-[8px] bg-white p-6 shadow-soft">
            <div className="flex flex-col justify-between gap-4 border-b border-ink/10 pb-5 lg:flex-row lg:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-ink/45">
                  {bucket.name}
                </p>
                <h2 className="mt-2 font-serif text-4xl font-semibold leading-none">
                  {bucket.label}
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-ink/68">
                  {bucket.purpose}
                </p>
              </div>
              <p className="rounded-full bg-ink/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.13em] text-ink/55">
                {bucket.files.length} file{bucket.files.length === 1 ? "" : "s"} · max {bucket.maxSizeLabel}
              </p>
            </div>

            {bucket.files.length ? (
              <MediaSelectionGrid bucket={bucket.name} files={bucket.files} />
            ) : (
              <div className="mt-6 rounded-[8px] border border-dashed border-ink/18 p-6 text-base leading-7 text-ink/62">
                No uploads in this bucket yet.
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
