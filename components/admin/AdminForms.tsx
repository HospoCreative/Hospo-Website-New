import type { ContentStatus } from "@/types/caseStudy";
import { RichTextEditor } from "./RichTextEditor";

type FormAction = (formData: FormData) => void | Promise<void>;

type CaseStudyFormValues = {
  id?: string;
  title?: string;
  slug?: string;
  client_name?: string;
  location?: string | null;
  sector?: string | null;
  summary?: string;
  challenge?: string | null;
  solution?: string | null;
  result?: string | null;
  services?: string[] | null;
  hero_image?: string | null;
  hero_image_alt?: string | null;
  featured?: boolean;
  display_order?: number;
  status?: ContentStatus;
  case_study_media?: Array<{
    media_type?: string;
    src?: string;
    alt?: string | null;
    caption?: string | null;
    sort_order?: number | null;
    published?: boolean | null;
  }> | null;
};

type BlogFormValues = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  cover_image?: string | null;
  cover_image_alt?: string | null;
  author_name?: string | null;
  tags?: string[] | null;
  status?: ContentStatus;
};

type ClientLogoFormValues = {
  id?: string;
  client_name?: string;
  logo_url?: string;
  alternate_logo_url?: string | null;
  alt?: string;
  url?: string | null;
  sort_order?: number;
  published?: boolean;
  related_case_study_id?: string | null;
};

const inputClass =
  "mt-2 w-full rounded-[8px] border border-ink/14 px-4 py-3 text-base text-ink outline-none transition focus:border-yellow focus:ring-2 focus:ring-yellow/30";
const labelClass = "block text-sm font-bold text-ink";
const helpClass = "mt-2 block text-sm font-medium leading-6 text-ink/56";

function formatCaseStudyGallery(initial?: CaseStudyFormValues) {
  return (initial?.case_study_media ?? [])
    .filter(
      (item) =>
        (item.media_type === "image" || item.media_type === "video") &&
        item.src
    )
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((item) =>
      [item.src, item.alt ?? "", item.caption ?? ""]
        .map((part) => String(part).trim())
        .join(" | ")
        .replace(/\s+\|\s+$/g, "")
    )
    .join("\n");
}

function StatusSelect({ value = "draft" }: { value?: ContentStatus }) {
  return (
    <select name="status" defaultValue={value} className={inputClass}>
      <option value="draft">Draft</option>
      <option value="published">Published</option>
      <option value="archived">Archived</option>
    </select>
  );
}

export function CaseStudyForm({
  action,
  initial,
  submitLabel
}: {
  action: FormAction;
  initial?: CaseStudyFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-5 rounded-[8px] bg-white p-6 shadow-soft">
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <label className={labelClass}>
        Title
        <input name="title" required defaultValue={initial?.title} className={inputClass} />
      </label>
      <label className={labelClass}>
        Slug
        <input name="slug" defaultValue={initial?.slug} className={inputClass} />
      </label>
      <div className="grid gap-5 md:grid-cols-2">
        <label className={labelClass}>
          Client name
          <input name="client_name" required defaultValue={initial?.client_name} className={inputClass} />
        </label>
        <label className={labelClass}>
          Location
          <input name="location" defaultValue={initial?.location ?? ""} className={inputClass} />
        </label>
      </div>
      <label className={labelClass}>
        Sector
        <input name="sector" defaultValue={initial?.sector ?? ""} className={inputClass} />
      </label>
      <label className={labelClass}>
        Summary
        <textarea name="summary" required rows={4} defaultValue={initial?.summary} className={inputClass} />
      </label>
      <div className="grid gap-5 md:grid-cols-3">
        <label className={labelClass}>
          Challenge
          <textarea name="challenge" rows={4} defaultValue={initial?.challenge ?? ""} className={inputClass} />
        </label>
        <label className={labelClass}>
          Solution
          <textarea name="solution" rows={4} defaultValue={initial?.solution ?? ""} className={inputClass} />
        </label>
        <label className={labelClass}>
          Result
          <textarea name="result" rows={4} defaultValue={initial?.result ?? ""} className={inputClass} />
        </label>
      </div>
      <label className={labelClass}>
        Services
        <textarea
          name="services"
          rows={4}
          defaultValue={(initial?.services ?? []).join("\n")}
          className={inputClass}
          placeholder="Photography&#10;Social media direction"
        />
      </label>
      <div className="grid gap-5 md:grid-cols-2">
        <label className={labelClass}>
          Hero image URL
          <input name="hero_image" defaultValue={initial?.hero_image ?? ""} className={inputClass} />
        </label>
        <label className={labelClass}>
          Hero image alt
          <input name="hero_image_alt" defaultValue={initial?.hero_image_alt ?? ""} className={inputClass} />
        </label>
      </div>
      <label className={labelClass}>
        Gallery media URLs
        <textarea
          name="gallery_images"
          rows={7}
          defaultValue={formatCaseStudyGallery(initial)}
          className={inputClass}
          placeholder={"https://.../image-1.jpg | Alt text | Optional caption\nhttps://.../video-1.mp4 | Alt text | Optional caption"}
        />
        <span className={helpClass}>
          Add one image or video per line. Use: media URL | alt text | optional caption.
          Delete a line and save to remove it from this case-study gallery.
        </span>
      </label>
      <div className="grid gap-5 md:grid-cols-3">
        <label className={labelClass}>
          Display order
          <input name="display_order" type="number" defaultValue={initial?.display_order ?? 0} className={inputClass} />
        </label>
        <label className={labelClass}>
          Status
          <StatusSelect value={initial?.status} />
        </label>
        <label className="flex items-center gap-3 pt-8 text-sm font-bold text-ink">
          <input name="featured" type="checkbox" defaultChecked={initial?.featured} className="size-5 accent-ink" />
          Featured
        </label>
      </div>
      <button className="mt-2 rounded-full bg-ink px-6 py-4 text-sm font-black uppercase tracking-[0.17em] text-white transition hover:bg-ink/88">
        {submitLabel}
      </button>
    </form>
  );
}

export function BlogPostForm({
  action,
  initial,
  submitLabel
}: {
  action: FormAction;
  initial?: BlogFormValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="grid gap-5 rounded-[8px] bg-white p-6 shadow-soft">
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <label className={labelClass}>
        Title
        <input name="title" required defaultValue={initial?.title} className={inputClass} />
      </label>
      <label className={labelClass}>
        Slug
        <input name="slug" defaultValue={initial?.slug} className={inputClass} />
      </label>
      <label className={labelClass}>
        Excerpt
        <textarea name="excerpt" required rows={3} defaultValue={initial?.excerpt} className={inputClass} />
      </label>
      <RichTextEditor
        name="content"
        label="Article content"
        required
        defaultValue={initial?.content}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <label className={labelClass}>
          Cover image URL
          <input name="cover_image" defaultValue={initial?.cover_image ?? ""} className={inputClass} />
        </label>
        <label className={labelClass}>
          Cover image alt
          <input name="cover_image_alt" defaultValue={initial?.cover_image_alt ?? ""} className={inputClass} />
        </label>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <label className={labelClass}>
          Author
          <input name="author_name" defaultValue={initial?.author_name ?? ""} className={inputClass} />
        </label>
        <label className={labelClass}>
          Tags
          <textarea name="tags" rows={3} defaultValue={(initial?.tags ?? []).join("\n")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Status
          <StatusSelect value={initial?.status} />
        </label>
      </div>
      <button className="mt-2 rounded-full bg-ink px-6 py-4 text-sm font-black uppercase tracking-[0.17em] text-white transition hover:bg-ink/88">
        {submitLabel}
      </button>
    </form>
  );
}

export function ClientLogoForm({
  action,
  initial,
  submitLabel = "Add logo"
}: {
  action: FormAction;
  initial?: ClientLogoFormValues;
  submitLabel?: string;
}) {
  return (
    <form action={action} className="grid gap-5 rounded-[8px] bg-white p-6 shadow-soft">
      {initial?.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <div className="grid gap-5 md:grid-cols-2">
        <label className={labelClass}>
          Client name
          <input
            name="client_name"
            required
            defaultValue={initial?.client_name ?? ""}
            className={inputClass}
          />
        </label>
        <label className={labelClass}>
          Sort order
          <input
            name="sort_order"
            type="number"
            defaultValue={initial?.sort_order ?? 0}
            className={inputClass}
          />
        </label>
      </div>
      <label className={labelClass}>
        Logo image URL
        <input
          name="logo_url"
          required
          defaultValue={initial?.logo_url ?? ""}
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Alternate logo URL
        <input
          name="alternate_logo_url"
          defaultValue={initial?.alternate_logo_url ?? ""}
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Alt text
        <input
          name="alt"
          required
          defaultValue={initial?.alt ?? ""}
          className={inputClass}
        />
      </label>
      <label className={labelClass}>
        Client website URL
        <input name="url" defaultValue={initial?.url ?? ""} className={inputClass} />
      </label>
      <label className={labelClass}>
        Related case study ID
        <input
          name="related_case_study_id"
          defaultValue={initial?.related_case_study_id ?? ""}
          className={inputClass}
        />
      </label>
      <label className="flex items-center gap-3 text-sm font-bold text-ink">
        <input
          name="published"
          type="checkbox"
          defaultChecked={initial?.published}
          className="size-5 accent-ink"
        />
        Published
      </label>
      <button className="rounded-full bg-ink px-6 py-4 text-sm font-black uppercase tracking-[0.17em] text-white transition hover:bg-ink/88">
        {submitLabel}
      </button>
    </form>
  );
}
