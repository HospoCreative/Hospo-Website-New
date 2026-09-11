import type { Metadata } from "next";
import { PrivateContentCreationLanding } from "@/components/PrivateContentCreationLanding";

export const metadata: Metadata = { title: "Content Creation Packages Preview | Hospo CMS", robots: { index: false, follow: false, nocache: true } };

export default function ContentCreationPackagesPreviewPage() {
  return <div><p className="section-eyebrow text-ink/55">Public landing page</p><h1 className="mt-3 font-serif text-5xl font-semibold leading-none">Content creation packages.</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-ink/70">This is the CMS preview for the public evergreen content-creation page. It is designed to be shared with hospitality businesses throughout the year and does not alter the global Commercial Library.</p><a href="/content-creation-packages" target="_blank" className="mt-5 inline-flex rounded-full border border-ink/20 px-4 py-2 text-xs font-black uppercase tracking-[.12em]">Open public page</a><div className="mt-10"><PrivateContentCreationLanding /></div></div>;
}
