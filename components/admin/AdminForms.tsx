import type { ContentStatus } from "@/types/caseStudy";
import { RichTextEditor } from "./RichTextEditor";
import { PendingSubmitButton } from "./PendingSubmitButton";
import { LogoPoolPicker } from "./LogoPoolPicker";
import { BlogCoverMediaFields, CaseStudyMediaFields } from "./MediaFormFields";

type FormAction = (formData: FormData) => void | Promise<void>;

type CaseStudyFormValues = {
  id?: string;
  title?: string;
  title_pt?: string | null;
  slug?: string;
  client_name?: string;
  location?: string | null;
  sector?: string | null;
  sector_pt?: string | null;
  summary?: string;
  summary_pt?: string | null;
  challenge?: string | null;
  challenge_pt?: string | null;
  solution?: string | null;
  solution_pt?: string | null;
  result?: string | null;
  result_pt?: string | null;
  services?: string[] | null;
  services_pt?: string[] | null;
  hero_image?: string | null;
  hero_image_alt?: string | null;
  hero_image_alt_pt?: string | null;
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
  title_pt?: string | null;
  slug?: string;
  excerpt?: string;
  excerpt_pt?: string | null;
  content?: string;
  content_pt?: string | null;
  cover_image?: string | null;
  cover_image_alt?: string | null;
  cover_image_alt_pt?: string | null;
  author_name?: string | null;
  tags?: string[] | null;
  tags_pt?: string[] | null;
  status?: ContentStatus;
};

type ClientLogoFormValues = {
  id?: string;
  logo_url?: string;
  sort_order?: number;
  published?: boolean;
};

const inputClass =
  "mt-2 w-full rounded-[8px] border border-ink/14 px-4 py-3 text-base text-ink outline-none transition focus:border-yellow focus:ring-2 focus:ring-yellow/30";
const labelClass = "block text-sm font-bold text-ink";

function formatCaseStudyGallery(initial?: CaseStudyFormValues) {
  return (initial?.case_study_media ?? [])
    .filter(
      (item) =>
        (item.media_type === "image" || item.media_type === "video") &&
        item.src
    )
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .filter((item) => item.src !== initial?.hero_image)
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
      <fieldset className="grid gap-5 rounded-[8px] border border-ink/14 p-5">
        <legend className="px-2 font-serif text-2xl font-semibold text-ink">Portuguese content</legend>
        <p className="text-sm leading-6 text-ink/60">
          Optional. Empty fields automatically use the English version on the Portuguese website.
        </p>
        <label className={labelClass}>
          Title in Portuguese
          <input name="title_pt" defaultValue={initial?.title_pt ?? ""} className={inputClass} lang="pt-PT" />
        </label>
        <label className={labelClass}>
          Sector in Portuguese
          <input name="sector_pt" defaultValue={initial?.sector_pt ?? ""} className={inputClass} lang="pt-PT" />
        </label>
        <label className={labelClass}>
          Summary in Portuguese
          <textarea name="summary_pt" rows={4} defaultValue={initial?.summary_pt ?? ""} className={inputClass} lang="pt-PT" />
        </label>
        <div className="grid gap-5 md:grid-cols-3">
          <label className={labelClass}>
            Challenge in Portuguese
            <textarea name="challenge_pt" rows={5} defaultValue={initial?.challenge_pt ?? ""} className={inputClass} lang="pt-PT" />
          </label>
          <label className={labelClass}>
            Solution in Portuguese
            <textarea name="solution_pt" rows={5} defaultValue={initial?.solution_pt ?? ""} className={inputClass} lang="pt-PT" />
          </label>
          <label className={labelClass}>
            Result in Portuguese
            <textarea name="result_pt" rows={5} defaultValue={initial?.result_pt ?? ""} className={inputClass} lang="pt-PT" />
          </label>
        </div>
        <label className={labelClass}>
          Services in Portuguese
          <textarea
            name="services_pt"
            rows={4}
            defaultValue={(initial?.services_pt ?? []).join("\n")}
            className={inputClass}
            placeholder={"Fotografia\nEstratégia de redes sociais"}
            lang="pt-PT"
          />
        </label>
        <label className={labelClass}>
          Hero image alt text in Portuguese
          <input name="hero_image_alt_pt" defaultValue={initial?.hero_image_alt_pt ?? ""} className={inputClass} lang="pt-PT" />
        </label>
      </fieldset>
      <CaseStudyMediaFields
        heroImage={initial?.hero_image ?? ""}
        heroImageAlt={initial?.hero_image_alt ?? ""}
        gallery={formatCaseStudyGallery(initial)}
      />
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
      <PendingSubmitButton label={submitLabel} pendingLabel="Saving case study..." className="mt-2" />
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
      <fieldset className="grid gap-5 rounded-[8px] border border-ink/14 p-5">
        <legend className="px-2 font-serif text-2xl font-semibold text-ink">Portuguese content</legend>
        <p className="text-sm leading-6 text-ink/60">
          Optional. Empty fields automatically use the English version on the Portuguese website.
        </p>
        <label className={labelClass}>
          Title in Portuguese
          <input name="title_pt" defaultValue={initial?.title_pt ?? ""} className={inputClass} lang="pt-PT" />
        </label>
        <label className={labelClass}>
          Excerpt in Portuguese
          <textarea name="excerpt_pt" rows={3} defaultValue={initial?.excerpt_pt ?? ""} className={inputClass} lang="pt-PT" />
        </label>
        <RichTextEditor
          name="content_pt"
          label="Article content in Portuguese"
          defaultValue={initial?.content_pt ?? ""}
        />
        <label className={labelClass}>
          Cover image alt text in Portuguese
          <input name="cover_image_alt_pt" defaultValue={initial?.cover_image_alt_pt ?? ""} className={inputClass} lang="pt-PT" />
        </label>
        <label className={labelClass}>
          Tags in Portuguese
          <textarea name="tags_pt" rows={3} defaultValue={(initial?.tags_pt ?? []).join("\n")} className={inputClass} lang="pt-PT" />
        </label>
      </fieldset>
      <BlogCoverMediaFields coverImage={initial?.cover_image ?? ""} coverImageAlt={initial?.cover_image_alt ?? ""} />
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
      <PendingSubmitButton label={submitLabel} pendingLabel="Saving article..." className="mt-2" />
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
      <LogoPoolPicker initialValue={initial?.logo_url} />
      <label className={labelClass}>
        Sort order
        <input
          name="sort_order"
          type="number"
          defaultValue={initial?.sort_order ?? 0}
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
        Show this logo on the website
      </label>
      <PendingSubmitButton label={submitLabel} pendingLabel="Saving logo..." />
    </form>
  );
}
