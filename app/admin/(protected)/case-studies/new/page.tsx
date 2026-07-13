import { CaseStudyForm } from "@/components/admin/AdminForms";
import { createCaseStudyAction } from "../../actions";

export default function NewCaseStudyPage() {
  return (
    <div className="max-w-5xl">
      <p className="section-eyebrow text-ink/55">New Case Study</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold leading-none">
        Create selected work.
      </h1>
      <div className="mt-8">
        <CaseStudyForm action={createCaseStudyAction} submitLabel="Create case study" />
      </div>
    </div>
  );
}
