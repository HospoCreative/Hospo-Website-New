import { MediaUploader } from "@/components/admin/MediaUploader";
import { CopyField } from "@/components/admin/CopyField";
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

function fileExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() ?? "";
}

function isImageFile(file: MediaFile) {
  const extension = fileExtension(file.name);
  return (
    file.mimeType?.startsWith("image/") ||
    ["avif", "gif", "jpg", "jpeg", "png", "svg", "webp"].includes(extension)
  );
}

function isVideoFile(file: MediaFile) {
  const extension = fileExtension(file.name);
  return file.mimeType?.startsWith("video/") || ["mp4", "webm", "mov"].includes(extension);
}

function formatBytes(bytes: number | null) {
  if (!bytes) {
    return "Unknown size";
  }

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
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(value));
}

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

export default async function AdminMediaPage() {
  const mediaLibrary = await getMediaLibrary();

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
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {bucket.files.map((file) => {
                  const image = isImageFile(file);
                  const video = isVideoFile(file);

                  return (
                    <article
                      key={`${file.bucket}/${file.path}`}
                      className="overflow-hidden rounded-[8px] border border-ink/10 bg-white"
                    >
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
                        ) : (
                          <div className="grid aspect-[4/3] place-items-center bg-ink text-center text-sm font-black uppercase tracking-[0.18em] text-white">
                            {video ? "Video file" : fileExtension(file.name) || "File"}
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
