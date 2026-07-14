"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminUser } from "@/lib/supabase/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const statusSchema = z.enum(["draft", "published", "archived"]);

const caseStudySchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  client_name: z.string().min(2),
  location: z.string().optional(),
  sector: z.string().optional(),
  summary: z.string().min(10),
  challenge: z.string().optional(),
  solution: z.string().optional(),
  result: z.string().optional(),
  services: z.array(z.string()),
  hero_image: z.string().optional(),
  hero_image_alt: z.string().optional(),
  featured: z.boolean(),
  display_order: z.number(),
  status: statusSchema
});

const blogPostSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  excerpt: z.string().min(10),
  content: z.string().min(10),
  cover_image: z.string().optional(),
  cover_image_alt: z.string().optional(),
  author_name: z.string().optional(),
  tags: z.array(z.string()),
  status: statusSchema
});

const clientLogoSchema = z.object({
  client_name: z.string().min(2),
  logo_url: z.string().min(2),
  alternate_logo_url: z.string().optional(),
  alt: z.string().min(2),
  url: z.string().optional(),
  sort_order: z.number(),
  published: z.boolean(),
  related_case_study_id: z.string().optional()
});

const mediaBucketSchema = z.enum(["case-study-media", "blog-media", "client-logos"]);
const mediaSelectionSchema = z.object({
  path: z.string().min(1).max(2000),
  publicUrl: z.string().min(1).max(5000)
});
const enquiryStatusSchema = z.enum(["new", "read", "replied", "archived"]);

type SupabaseServerClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

type ParsedCaseStudyMedia = {
  media_type: "image" | "video";
  src: string;
  alt: string;
  caption: string | null;
  sort_order: number;
  published: true;
};

function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function formBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function formNumber(formData: FormData, key: string) {
  const value = Number(formData.get(key) ?? 0);
  return Number.isFinite(value) ? value : 0;
}

function formList(formData: FormData, key: string) {
  return formText(formData, key)
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function optionalNull(value: string) {
  return value.length ? value : null;
}

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

async function mutateTable() {
  await requireAdminUser();
  return createSupabaseServerClient();
}

function parseCaseStudyGallery(formData: FormData, fallbackAlt: string) {
  return formText(formData, "gallery_images")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index): ParsedCaseStudyMedia | null => {
      const [src = "", alt = "", caption = ""] = line
        .split("|")
        .map((part) => part.trim());

      if (!src) {
        return null;
      }

      const mediaType = /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(src)
        ? "video"
        : "image";

      return {
        media_type: mediaType,
        src,
        alt: alt || fallbackAlt,
        caption: optionalNull(caption),
        sort_order: index,
        published: true
      };
    })
    .filter((item): item is ParsedCaseStudyMedia => item !== null);
}

async function replaceCaseStudyMedia(
  supabase: SupabaseServerClient,
  caseStudyId: string,
  media: ParsedCaseStudyMedia[]
) {
  const deleteResult = await supabase
    .from("case_study_media")
    .delete()
    .eq("case_study_id", caseStudyId);

  if (deleteResult.error) {
    return deleteResult.error.message;
  }

  if (!media.length) {
    return null;
  }

  const insertResult = await supabase.from("case_study_media").insert(
    media.map((item) => ({
      ...item,
      case_study_id: caseStudyId
    }))
  );

  return insertResult.error?.message ?? null;
}

export async function createCaseStudyAction(formData: FormData) {
  const supabase = await mutateTable();
  const title = formText(formData, "title");
  const parsed = caseStudySchema.parse({
    title,
    slug: slugify(formText(formData, "slug") || title),
    client_name: formText(formData, "client_name"),
    location: formText(formData, "location"),
    sector: formText(formData, "sector"),
    summary: formText(formData, "summary"),
    challenge: formText(formData, "challenge"),
    solution: formText(formData, "solution"),
    result: formText(formData, "result"),
    services: formList(formData, "services"),
    hero_image: formText(formData, "hero_image"),
    hero_image_alt: formText(formData, "hero_image_alt"),
    featured: formBoolean(formData, "featured"),
    display_order: formNumber(formData, "display_order"),
    status: formText(formData, "status")
  });
  const galleryImages = parseCaseStudyGallery(
    formData,
    parsed.hero_image_alt || parsed.title
  );

  const { data, error } = await supabase
    .from("case_studies")
    .insert({
      ...parsed,
      location: optionalNull(parsed.location ?? ""),
      sector: optionalNull(parsed.sector ?? ""),
      challenge: optionalNull(parsed.challenge ?? ""),
      solution: optionalNull(parsed.solution ?? ""),
      result: optionalNull(parsed.result ?? ""),
      hero_image: optionalNull(parsed.hero_image ?? ""),
      hero_image_alt: optionalNull(parsed.hero_image_alt ?? ""),
      published_at: parsed.status === "published" ? new Date().toISOString() : null
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/admin/case-studies/new?error=${encodeURIComponent(error.message)}`);
  }

  const mediaError = await replaceCaseStudyMedia(supabase, data.id, galleryImages);

  if (mediaError) {
    redirect(`/admin/case-studies/${data.id}?error=${encodeURIComponent(mediaError)}`);
  }

  revalidatePath("/");
  revalidatePath("/case-studies/[slug]", "page");
  redirect(`/admin/case-studies/${data.id}`);
}

export async function updateCaseStudyAction(formData: FormData) {
  const supabase = await mutateTable();
  const id = formText(formData, "id");
  const title = formText(formData, "title");
  const parsed = caseStudySchema.parse({
    title,
    slug: slugify(formText(formData, "slug") || title),
    client_name: formText(formData, "client_name"),
    location: formText(formData, "location"),
    sector: formText(formData, "sector"),
    summary: formText(formData, "summary"),
    challenge: formText(formData, "challenge"),
    solution: formText(formData, "solution"),
    result: formText(formData, "result"),
    services: formList(formData, "services"),
    hero_image: formText(formData, "hero_image"),
    hero_image_alt: formText(formData, "hero_image_alt"),
    featured: formBoolean(formData, "featured"),
    display_order: formNumber(formData, "display_order"),
    status: formText(formData, "status")
  });
  const galleryImages = parseCaseStudyGallery(
    formData,
    parsed.hero_image_alt || parsed.title
  );

  const { error } = await supabase
    .from("case_studies")
    .update({
      ...parsed,
      location: optionalNull(parsed.location ?? ""),
      sector: optionalNull(parsed.sector ?? ""),
      challenge: optionalNull(parsed.challenge ?? ""),
      solution: optionalNull(parsed.solution ?? ""),
      result: optionalNull(parsed.result ?? ""),
      hero_image: optionalNull(parsed.hero_image ?? ""),
      hero_image_alt: optionalNull(parsed.hero_image_alt ?? ""),
      published_at: parsed.status === "published" ? new Date().toISOString() : null
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/case-studies/${id}?error=${encodeURIComponent(error.message)}`);
  }

  const mediaError = await replaceCaseStudyMedia(supabase, id, galleryImages);

  if (mediaError) {
    redirect(`/admin/case-studies/${id}?error=${encodeURIComponent(mediaError)}`);
  }

  revalidatePath("/");
  revalidatePath("/case-studies/[slug]", "page");
  revalidatePath(`/case-studies/${parsed.slug}`);
  redirect(`/admin/case-studies/${id}?message=saved`);
}

export async function createBlogPostAction(formData: FormData) {
  const supabase = await mutateTable();
  const title = formText(formData, "title");
  const parsed = blogPostSchema.parse({
    title,
    slug: slugify(formText(formData, "slug") || title),
    excerpt: formText(formData, "excerpt"),
    content: formText(formData, "content"),
    cover_image: formText(formData, "cover_image"),
    cover_image_alt: formText(formData, "cover_image_alt"),
    author_name: formText(formData, "author_name"),
    tags: formList(formData, "tags"),
    status: formText(formData, "status")
  });

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      ...parsed,
      cover_image: optionalNull(parsed.cover_image ?? ""),
      cover_image_alt: optionalNull(parsed.cover_image_alt ?? ""),
      author_name: optionalNull(parsed.author_name ?? ""),
      published_at: parsed.status === "published" ? new Date().toISOString() : null
    })
    .select("id")
    .single();

  if (error) {
    redirect(`/admin/blog/new?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/blog");
  redirect(`/admin/blog/${data.id}`);
}

export async function updateBlogPostAction(formData: FormData) {
  const supabase = await mutateTable();
  const id = formText(formData, "id");
  const title = formText(formData, "title");
  const parsed = blogPostSchema.parse({
    title,
    slug: slugify(formText(formData, "slug") || title),
    excerpt: formText(formData, "excerpt"),
    content: formText(formData, "content"),
    cover_image: formText(formData, "cover_image"),
    cover_image_alt: formText(formData, "cover_image_alt"),
    author_name: formText(formData, "author_name"),
    tags: formList(formData, "tags"),
    status: formText(formData, "status")
  });

  const { error } = await supabase
    .from("blog_posts")
    .update({
      ...parsed,
      cover_image: optionalNull(parsed.cover_image ?? ""),
      cover_image_alt: optionalNull(parsed.cover_image_alt ?? ""),
      author_name: optionalNull(parsed.author_name ?? ""),
      published_at: parsed.status === "published" ? new Date().toISOString() : null
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/blog/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  redirect(`/admin/blog/${id}?message=saved`);
}

export async function createClientLogoAction(formData: FormData) {
  const supabase = await mutateTable();
  const parsed = clientLogoSchema.parse({
    client_name: formText(formData, "client_name"),
    logo_url: formText(formData, "logo_url"),
    alternate_logo_url: formText(formData, "alternate_logo_url"),
    alt: formText(formData, "alt"),
    url: formText(formData, "url"),
    sort_order: formNumber(formData, "sort_order"),
    published: formBoolean(formData, "published"),
    related_case_study_id: formText(formData, "related_case_study_id")
  });

  const { error } = await supabase.from("client_logos").insert({
    ...parsed,
    alternate_logo_url: optionalNull(parsed.alternate_logo_url ?? ""),
    url: optionalNull(parsed.url ?? ""),
    related_case_study_id: optionalNull(parsed.related_case_study_id ?? "")
  });

  if (error) {
    redirect(`/admin/clients?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  redirect("/admin/clients?message=saved");
}

export async function updateClientLogoAction(formData: FormData) {
  const supabase = await mutateTable();
  const id = formText(formData, "id");
  const parsed = clientLogoSchema.parse({
    client_name: formText(formData, "client_name"),
    logo_url: formText(formData, "logo_url"),
    alternate_logo_url: formText(formData, "alternate_logo_url"),
    alt: formText(formData, "alt"),
    url: formText(formData, "url"),
    sort_order: formNumber(formData, "sort_order"),
    published: formBoolean(formData, "published"),
    related_case_study_id: formText(formData, "related_case_study_id")
  });

  const { error } = await supabase
    .from("client_logos")
    .update({
      ...parsed,
      alternate_logo_url: optionalNull(parsed.alternate_logo_url ?? ""),
      url: optionalNull(parsed.url ?? ""),
      related_case_study_id: optionalNull(parsed.related_case_study_id ?? "")
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/clients?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  redirect("/admin/clients?message=updated");
}

export async function deleteClientLogoAction(formData: FormData) {
  const supabase = await mutateTable();
  const id = formText(formData, "id");

  const { error } = await supabase.from("client_logos").delete().eq("id", id);

  if (error) {
    redirect(`/admin/clients?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  redirect("/admin/clients?message=deleted");
}

export async function uploadMediaAction(formData: FormData) {
  const supabase = await mutateTable();
  const bucket = mediaBucketSchema.parse(formText(formData, "bucket"));
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/media?error=Choose a file to upload");
  }

  const folder = new Date().toISOString().slice(0, 10);
  const filename = `${Date.now()}-${safeFileName(file.name)}`;
  const path = `${folder}/${filename}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || undefined,
    upsert: false
  });

  if (error) {
    redirect(`/admin/media?error=${encodeURIComponent(error.message)}`);
  }

  const {
    data: { publicUrl }
  } = supabase.storage.from(bucket).getPublicUrl(path);

  const params = new URLSearchParams({
    message: "uploaded",
    bucket,
    path,
    url: publicUrl
  });

  redirect(`/admin/media?${params.toString()}`);
}

export async function deleteMediaAction(formData: FormData) {
  const supabase = await mutateTable();
  const bucket = mediaBucketSchema.parse(formText(formData, "bucket"));
  const path = formText(formData, "path");
  const publicUrl = formText(formData, "public_url");

  if (!path) {
    redirect("/admin/media?error=Missing media path");
  }

  const { data, error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    redirect(`/admin/media?error=${encodeURIComponent(error.message)}`);
  }

  if (!data?.length) {
    redirect(
      "/admin/media?error=Supabase did not confirm that the file was deleted. Please try again."
    );
  }

  if (publicUrl) {
    if (bucket === "case-study-media") {
      await supabase.from("case_study_media").delete().eq("src", publicUrl);
      await supabase
        .from("case_studies")
        .update({ hero_image: null })
        .eq("hero_image", publicUrl);
      revalidatePath("/");
      revalidatePath("/case-studies/[slug]", "page");
    }

    if (bucket === "blog-media") {
      await supabase
        .from("blog_posts")
        .update({ cover_image: null })
        .eq("cover_image", publicUrl);
      revalidatePath("/blog");
      revalidatePath("/blog/[slug]", "page");
    }
  }

  revalidatePath("/admin/media");
  redirect("/admin/media?message=deleted&count=1");
}

export async function deleteMediaBatchAction(formData: FormData) {
  const supabase = await mutateTable();
  const bucket = mediaBucketSchema.parse(formText(formData, "bucket"));
  const rawSelections = formData.getAll("selected_media");

  if (!rawSelections.length) {
    redirect("/admin/media?error=Select at least one file to delete");
  }

  let selections: z.infer<typeof mediaSelectionSchema>[];

  try {
    selections = rawSelections.map((value) =>
      mediaSelectionSchema.parse(JSON.parse(String(value)))
    );
  } catch {
    redirect("/admin/media?error=The selected media list was invalid. Refresh and try again.");
  }

  const uniqueSelections = Array.from(
    new Map(selections.map((selection) => [selection.path, selection])).values()
  );

  if (uniqueSelections.length > 100) {
    redirect("/admin/media?error=Delete a maximum of 100 files at a time");
  }

  const paths = uniqueSelections.map((selection) => selection.path);
  const publicUrls = uniqueSelections.map((selection) => selection.publicUrl);
  const { data, error } = await supabase.storage.from(bucket).remove(paths);

  if (error) {
    redirect(`/admin/media?error=${encodeURIComponent(error.message)}`);
  }

  if (!data?.length) {
    redirect(
      "/admin/media?error=Supabase did not confirm any deletions. Check storage permissions and try again."
    );
  }

  const cleanupErrors: string[] = [];

  if (bucket === "case-study-media") {
    const { error: galleryError } = await supabase
      .from("case_study_media")
      .delete()
      .in("src", publicUrls);
    const { error: heroError } = await supabase
      .from("case_studies")
      .update({ hero_image: null })
      .in("hero_image", publicUrls);

    if (galleryError) cleanupErrors.push(galleryError.message);
    if (heroError) cleanupErrors.push(heroError.message);

    revalidatePath("/");
    revalidatePath("/case-studies/[slug]", "page");
  }

  if (bucket === "blog-media") {
    const { error: blogError } = await supabase
      .from("blog_posts")
      .update({ cover_image: null })
      .in("cover_image", publicUrls);

    if (blogError) cleanupErrors.push(blogError.message);

    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
  }

  if (bucket === "client-logos") {
    const { error: alternateLogoError } = await supabase
      .from("client_logos")
      .update({ alternate_logo_url: null })
      .in("alternate_logo_url", publicUrls);
    const { error: primaryLogoError } = await supabase
      .from("client_logos")
      .delete()
      .in("logo_url", publicUrls);

    if (alternateLogoError) cleanupErrors.push(alternateLogoError.message);
    if (primaryLogoError) cleanupErrors.push(primaryLogoError.message);

    revalidatePath("/");
  }

  revalidatePath("/admin/media");

  if (cleanupErrors.length) {
    redirect(
      `/admin/media?error=${encodeURIComponent(
        `Files were deleted, but linked content could not be fully updated: ${cleanupErrors[0]}`
      )}`
    );
  }

  const deletedCount = data.length;
  redirect(`/admin/media?message=deleted&count=${deletedCount}`);
}

export async function updateEnquiryAction(formData: FormData) {
  const supabase = await mutateTable();
  const id = z.string().uuid().parse(formText(formData, "id"));
  const status = enquiryStatusSchema.parse(formText(formData, "status"));
  const adminNotes = z.string().max(5000).parse(formText(formData, "admin_notes"));

  const { error } = await supabase
    .from("contact_enquiries")
    .update({
      status,
      admin_notes: optionalNull(adminNotes)
    })
    .eq("id", id);

  if (error) {
    redirect(`/admin/inbox?id=${id}&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/inbox");
  redirect(`/admin/inbox?id=${id}&message=saved`);
}
