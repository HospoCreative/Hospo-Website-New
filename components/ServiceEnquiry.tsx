"use client";

import { ArrowUpRight, Mail } from "lucide-react";
import { type FormEvent, useState } from "react";
import { siteContent } from "@/data/site";

const serviceOptions = [
  "Marketing Strategy",
  "Social Media Management",
  "Content Creation",
  "Photography",
  "Videography",
  "Campaign Development",
  "Google Ads",
  "Meta Ads",
  "Website Creation",
  "Website Optimisation",
  "SEO",
  "Google Business Profile",
  "OTA Optimisation",
  "Email Marketing",
  "Other"
] as const;

const businessTypes = [
  "Hotel",
  "Restaurant",
  "Bar",
  "Cafe",
  "Hospitality group",
  "Food and beverage brand",
  "Accommodation business",
  "Other"
] as const;

const timeframes = ["This month", "1-3 months", "3-6 months", "Planning ahead"] as const;

type EnquiryForm = {
  name: string;
  businessName: string;
  email: string;
  website: string;
  businessType: string;
  location: string;
  services: string[];
  challenge: string;
  timeframe: string;
  message: string;
  privacy: boolean;
};

const initialForm: EnquiryForm = {
  name: "",
  businessName: "",
  email: "",
  website: "",
  businessType: "",
  location: "",
  services: [],
  challenge: "",
  timeframe: "",
  message: "",
  privacy: false
};

function createMailto(form: EnquiryForm, email: string) {
  const subject = `Hospo service enquiry - ${form.businessName || form.name}`;
  const body = [
    `Name: ${form.name}`,
    `Business: ${form.businessName}`,
    `Email: ${form.email}`,
    `Website: ${form.website || "Not supplied"}`,
    `Business type: ${form.businessType || "Not supplied"}`,
    `Location: ${form.location || "Not supplied"}`,
    `Services required: ${form.services.join(", ")}`,
    `Preferred timeframe: ${form.timeframe || "Not supplied"}`,
    "",
    "Main marketing challenge:",
    form.challenge,
    "",
    "Message:",
    form.message || "Not supplied"
  ].join("\n");

  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ServiceEnquiry() {
  const { contact, cta } = siteContent;
  const [form, setForm] = useState<EnquiryForm>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const updateField = (field: keyof EnquiryForm, value: string | boolean | string[]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const toggleService = (service: string) => {
    const nextServices = form.services.includes(service)
      ? form.services.filter((item) => item !== service)
      : [...form.services, service];

    updateField("services", nextServices);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      nextErrors.name = "Please add your name.";
    }

    if (!form.businessName.trim()) {
      nextErrors.businessName = "Please add your business name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Please add a valid email address.";
    }

    if (form.services.length === 0) {
      nextErrors.services = "Choose at least one service.";
    }

    if (!form.challenge.trim()) {
      nextErrors.challenge = "Please describe your main marketing challenge.";
    }

    if (!form.privacy) {
      nextErrors.privacy = "Please confirm you are happy for us to reply.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setStatus("loading");
    const mailto = createMailto(form, contact.email);

    window.setTimeout(() => {
      window.location.href = mailto;
      setStatus("success");
    }, 250);
  };

  const inputClass =
    "mt-2 w-full rounded-[8px] border border-ink/14 bg-white px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink/36 focus:border-yellow focus:ring-2 focus:ring-yellow/35";
  const labelClass = "text-sm font-bold text-ink";

  return (
    <section
      id="contact"
      className="border-t border-ink/10 bg-white px-5 py-20 text-ink sm:px-8 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-6xl">
          <p className="section-eyebrow text-ink/55">{cta.eyebrow}</p>
          <h2 className="mt-5 font-serif text-[clamp(2.75rem,12vw,6rem)] font-semibold leading-[0.94]">
            {cta.title}
          </h2>
          <p className="mt-7 max-w-3xl text-xl leading-9 text-ink/72 sm:text-2xl sm:leading-10">
            {cta.body}
          </p>
          <a
            href={`mailto:${contact.email}`}
            className="mt-8 inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em] text-ink transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
          >
            <Mail aria-hidden="true" size={17} />
            {contact.email}
          </a>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-12 rounded-[8px] border border-ink/10 bg-white p-4 shadow-editorial sm:p-6 lg:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              Name
              <input
                className={inputClass}
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <span className="mt-2 block text-sm text-yellow">{errors.name}</span>}
            </label>

            <label className={labelClass}>
              Business name
              <input
                className={inputClass}
                value={form.businessName}
                onChange={(event) => updateField("businessName", event.target.value)}
                aria-invalid={Boolean(errors.businessName)}
              />
              {errors.businessName && (
                <span className="mt-2 block text-sm text-yellow">{errors.businessName}</span>
              )}
            </label>

            <label className={labelClass}>
              Email
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <span className="mt-2 block text-sm text-yellow">{errors.email}</span>}
            </label>

            <label className={labelClass}>
              Website
              <input
                type="url"
                className={inputClass}
                value={form.website}
                onChange={(event) => updateField("website", event.target.value)}
                placeholder="https://"
              />
            </label>

            <label className={labelClass}>
              Business type
              <select
                className={inputClass}
                value={form.businessType}
                onChange={(event) => updateField("businessType", event.target.value)}
              >
                <option value="">Select a type</option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Business location
              <input
                className={inputClass}
                value={form.location}
                onChange={(event) => updateField("location", event.target.value)}
              />
            </label>
          </div>

          <fieldset className="mt-6">
            <legend className={labelClass}>Services required</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {serviceOptions.map((service) => {
                const checked = form.services.includes(service);

                return (
                  <label
                    key={service}
                    className={`cursor-pointer rounded-full border px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.13em] transition ${
                      checked
                        ? "border-ink bg-ink text-white"
                        : "border-ink/14 text-ink/68 hover:border-yellow/70 hover:text-ink"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleService(service)}
                      className="sr-only"
                    />
                    {service}
                  </label>
                );
              })}
            </div>
            {errors.services && (
              <span className="mt-2 block text-sm text-ink/70">{errors.services}</span>
            )}
          </fieldset>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className={`${labelClass} sm:col-span-2`}>
              Main marketing challenge
              <textarea
                className={`${inputClass} min-h-32 resize-y`}
                value={form.challenge}
                onChange={(event) => updateField("challenge", event.target.value)}
                aria-invalid={Boolean(errors.challenge)}
              />
              {errors.challenge && (
                <span className="mt-2 block text-sm text-yellow">{errors.challenge}</span>
              )}
            </label>

            <label className={labelClass}>
              Preferred timeframe
              <select
                className={inputClass}
                value={form.timeframe}
                onChange={(event) => updateField("timeframe", event.target.value)}
              >
                <option value="">Select a timeframe</option>
                {timeframes.map((timeframe) => (
                  <option key={timeframe} value={timeframe}>
                    {timeframe}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Message
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
              />
            </label>
          </div>

          <label className="mt-6 flex gap-3 text-sm leading-6 text-ink/72">
            <input
              type="checkbox"
              checked={form.privacy}
              onChange={(event) => updateField("privacy", event.target.checked)}
              className="mt-1 size-4 accent-yellow"
            />
            <span>
              I am happy for Hospo Creative to use these details to reply to this
              enquiry.
              {errors.privacy && (
                <span className="mt-1 block text-ink/70">{errors.privacy}</span>
              )}
            </span>
          </label>

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-8 inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-6 py-4 text-sm font-black uppercase tracking-[0.17em] text-white transition hover:-translate-y-0.5 hover:bg-ink/88 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-wait disabled:opacity-70 sm:w-auto"
          >
            {status === "loading" ? "Preparing enquiry" : cta.primaryCta}
            <ArrowUpRight aria-hidden="true" size={18} />
          </button>

          {status === "success" && (
            <p className="mt-4 text-sm leading-6 text-ink/70">
              Your enquiry has been prepared in your email app. Send it from there
              so Hospo can reply.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
