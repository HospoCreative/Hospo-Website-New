"use client";

import { ArrowUpRight, Check, ImagePlus, LoaderCircle, Printer, ShieldCheck } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";
import type { DigitalScanReport, ScanConfidence, SocialFeedMetrics } from "@/types/digitalScan";
import type { Locale } from "@/lib/i18n";
import { analyseSocialFeedScreenshot } from "@/lib/socialFeedAnalysis";

const copy = {
  en: {
    eyebrow: "Test your digital score",
    title: "See how your business appears online.",
    body: "Enter your public website and contact details. We will review how clearly customers can understand the offer, find the business and move towards a booking, order or purchase.",
    website: "Website URL",
    business: "Business name",
    businessType: "Type of business",
    businessTypePrompt: "Select the closest business type",
    hotelType: "Hotels and accommodation",
    restaurantType: "Restaurants, bars and coffee shops",
    productType: "Food and beverage products",
    businessOptional: "Optional",
    location: "Town or location",
    email: "Contact email",
    feedScreenshot: "Social feed screenshot",
    feedOptional: "Optional fallback",
    feedHelp: "We will scan linked public social profiles first. Add a screenshot showing at least nine recent posts only for fuller coverage when a platform blocks access. It is analysed privately in this browser and is never uploaded or stored.",
    feedChoose: "Choose feed screenshot",
    feedAnalysing: "Analysing screenshot",
    feedReady: "Feed screenshot analysed privately",
    feedRemove: "Remove",
    feedError: "The screenshot could not be analysed. Try a JPG, PNG or WebP image under 10 MB.",
    privacy: "I agree that Hospo Creative may store this scan and contact me about the results.",
    submit: "Run my free scan",
    scanning: "Scanning your public presence",
    honeypot: "Company website confirmation",
    security: "We only inspect public website information. Never enter account passwords or private platform credentials.",
    report: "Your public digital presence report",
    overview: "Quick overview",
    offerings: "Offerings detected",
    noOfferings: "No clear offering themes were confirmed from the public homepage.",
    score: "Overall score",
    whatWorks: "What is working",
    improveNext: "Improve next",
    priorities: "Immediate priorities",
    discovered: "Evidence checked",
    evidenceHelp: "These links provide supporting evidence only. OTA links are not required or scored because a strong direct booking journey is the priority.",
    directBooking: "Direct booking routes",
    enquiries: "Enquiry routes",
    socials: "Social profiles",
    socialCoverage: "Automatic social coverage",
    scanned: "Scanned",
    partial: "Partial",
    blocked: "Blocked",
    otas: "OTA listings found",
    google: "Google profile found",
    limitations: "What this scan does not access",
    print: "Print or save report",
    discuss: "Discuss the results",
    saved: "Your report has been saved securely for Hospo Creative to review.",
    emailed: "A copy of the report has also been sent to your email.",
    notEmailed: "Email delivery is not configured yet. You can print or save this report below.",
    notSaved: "Your report is ready, but lead storage was unavailable. Please contact Hospo directly if you would like follow-up.",
    strong: "Strong",
    opportunity: "Opportunity",
    priority: "Priority",
    review: "Needs review",
    error: "We could not complete the scan. Please check the website address and try again."
  },
  pt: {
    eyebrow: "Teste a sua presença digital",
    title: "Veja como o seu negócio aparece online.",
    body: "Introduza o website público e os dados de contacto. Vamos analisar se os clientes compreendem a oferta, encontram o negócio e avançam para uma reserva, pedido ou compra.",
    website: "URL do website",
    business: "Nome do negócio",
    businessType: "Tipo de negócio",
    businessTypePrompt: "Selecione o tipo de negócio mais próximo",
    hotelType: "Hotéis e alojamento",
    restaurantType: "Restaurantes, bares e cafés",
    productType: "Produtos de alimentação e bebidas",
    businessOptional: "Opcional",
    location: "Localidade",
    email: "Email de contacto",
    feedScreenshot: "Captura do feed das redes sociais",
    feedOptional: "Alternativa opcional",
    feedHelp: "Primeiro, vamos analisar automaticamente as redes sociais públicas ligadas ao website. Adicione uma captura com pelo menos nove publicações apenas para obter maior cobertura quando uma plataforma bloqueia o acesso. A imagem é analisada em privado neste navegador e nunca é enviada ou guardada.",
    feedChoose: "Escolher captura do feed",
    feedAnalysing: "A analisar a captura",
    feedReady: "Captura do feed analisada em privado",
    feedRemove: "Remover",
    feedError: "Não foi possível analisar a captura. Tente uma imagem JPG, PNG ou WebP com menos de 10 MB.",
    privacy: "Autorizo a Hospo Creative a guardar esta análise e a contactar-me sobre os resultados.",
    submit: "Fazer a minha análise gratuita",
    scanning: "A analisar a sua presença pública",
    honeypot: "Confirmação do website da empresa",
    security: "Analisamos apenas informação pública. Nunca introduza palavras-passe ou credenciais privadas de plataformas.",
    report: "Relatório da sua presença digital pública",
    overview: "Visão geral",
    offerings: "Ofertas identificadas",
    noOfferings: "Não foram confirmadas ofertas claras na página inicial pública.",
    score: "Pontuação geral",
    whatWorks: "O que está a funcionar",
    improveNext: "Melhorar a seguir",
    priorities: "Prioridades imediatas",
    discovered: "Elementos verificados",
    evidenceHelp: "Estas ligações servem apenas como evidência. As ligações a OTAs não são obrigatórias nem afetam a pontuação, porque a prioridade é um percurso de reserva direta forte.",
    directBooking: "Percursos de reserva direta",
    enquiries: "Percursos de contacto",
    socials: "Redes sociais",
    socialCoverage: "Cobertura automática das redes sociais",
    scanned: "Analisado",
    partial: "Parcial",
    blocked: "Bloqueado",
    otas: "Listagens OTA encontradas",
    google: "Perfil Google encontrado",
    limitations: "O que esta análise não consulta",
    print: "Imprimir ou guardar relatório",
    discuss: "Falar sobre os resultados",
    saved: "O relatório foi guardado em segurança para análise pela Hospo Creative.",
    emailed: "Uma cópia do relatório também foi enviada para o seu email.",
    notEmailed: "O envio por email ainda não está configurado. Pode imprimir ou guardar o relatório abaixo.",
    notSaved: "O relatório está pronto, mas não foi possível guardar o contacto. Contacte diretamente a Hospo se pretender acompanhamento.",
    strong: "Forte",
    opportunity: "Oportunidade",
    priority: "Prioridade",
    review: "Precisa de análise",
    error: "Não foi possível concluir a análise. Confirme o endereço do website e tente novamente."
  }
} as const;

function domainLabel(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
}

function statusPresentation(score: number, confidence: ScanConfidence, t: typeof copy.en | typeof copy.pt) {
  if (confidence === "not_confirmed") return { label: t.review, className: "border border-white/20 text-white/65" };
  if (score >= 75) return { label: t.strong, className: "bg-yellow text-ink" };
  if (score >= 50) return { label: t.opportunity, className: "border border-yellow/60 text-white" };
  return { label: t.priority, className: "border border-yellow/60 text-white" };
}

export function DigitalScanTool({ locale = "en" }: { locale?: Locale }) {
  const t = copy[locale];
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [report, setReport] = useState<DigitalScanReport | null>(null);
  const [stored, setStored] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [feedMetrics, setFeedMetrics] = useState<SocialFeedMetrics | null>(null);
  const [feedState, setFeedState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [feedFileName, setFeedFileName] = useState("");

  async function analyseFeed(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFeedState("loading");
    setFeedMetrics(null);
    setFeedFileName(file.name);
    try {
      const metrics = await analyseSocialFeedScreenshot(file);
      setFeedMetrics(metrics);
      setFeedState("ready");
    } catch {
      setFeedFileName("");
      setFeedState("error");
      event.target.value = "";
    }
  }

  function removeFeed() {
    setFeedMetrics(null);
    setFeedFileName("");
    setFeedState("idle");
    const input = document.querySelector<HTMLInputElement>("#social-feed-screenshot");
    if (input) input.value = "";
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    setReport(null);

    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/digital-scan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          websiteUrl: form.get("websiteUrl"),
          businessName: form.get("businessName"),
          businessType: form.get("businessType"),
          location: form.get("location"),
          email: form.get("email"),
          companyWebsite: form.get("companyWebsite"),
          privacy: form.get("privacy") === "on",
          socialFeedMetrics: feedMetrics,
          locale
        })
      });
      const payload = (await response.json()) as {
        report?: DigitalScanReport;
        stored?: boolean;
        emailSent?: boolean;
        error?: string;
      };
      if (!response.ok || !payload.report) throw new Error(payload.error || t.error);
      setReport(payload.report);
      setStored(Boolean(payload.stored));
      setEmailSent(Boolean(payload.emailSent));
      setStatus("success");
      window.setTimeout(() => document.querySelector("#scan-report")?.scrollIntoView({ behavior: "smooth" }), 80);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : t.error);
      setStatus("error");
    }
  }

  return (
    <>
      <section className="bg-ink px-5 py-14 text-white sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:items-start lg:gap-16">
          <div className="lg:sticky lg:top-28">
            <p className="section-eyebrow text-yellow">{t.eyebrow}</p>
            <h1 className="mt-5 text-balance font-serif text-[clamp(2.8rem,6vw,5rem)] font-semibold leading-[0.96]">
              {t.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72">{t.body}</p>
            <div className="mt-8 flex gap-3 border-t border-white/14 pt-6 text-sm leading-6 text-white/58">
              <ShieldCheck className="mt-0.5 shrink-0 text-yellow" size={19} aria-hidden="true" />
              <p>{t.security}</p>
            </div>
          </div>

          <form onSubmit={submit} className="grid gap-5 rounded-[8px] bg-white p-5 text-ink shadow-editorial sm:p-8">
            <label className="text-sm font-bold">
              {t.website}
              <input name="websiteUrl" type="text" inputMode="url" required placeholder="https://example.com" className="mt-2 min-h-12 w-full rounded-[8px] border border-ink/18 px-4 py-3 text-base outline-none focus:border-yellow focus:ring-2 focus:ring-yellow/30" />
            </label>
            <label className="text-sm font-bold">
              {t.businessType}
              <select name="businessType" required defaultValue="" className="mt-2 min-h-12 w-full rounded-[8px] border border-ink/18 bg-white px-4 py-3 text-base outline-none focus:border-yellow focus:ring-2 focus:ring-yellow/30">
                <option value="" disabled>{t.businessTypePrompt}</option>
                <option value="hotel_accommodation">{t.hotelType}</option>
                <option value="restaurant_venue">{t.restaurantType}</option>
                <option value="fnb_product">{t.productType}</option>
              </select>
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold">
                {t.business} <span className="font-medium text-ink/45">({t.businessOptional})</span>
                <input name="businessName" type="text" autoComplete="organization" className="mt-2 min-h-12 w-full rounded-[8px] border border-ink/18 px-4 py-3 text-base outline-none focus:border-yellow focus:ring-2 focus:ring-yellow/30" />
              </label>
              <label className="text-sm font-bold">
                {t.location} <span className="font-medium text-ink/45">({t.businessOptional})</span>
                <input name="location" type="text" autoComplete="address-level2" className="mt-2 min-h-12 w-full rounded-[8px] border border-ink/18 px-4 py-3 text-base outline-none focus:border-yellow focus:ring-2 focus:ring-yellow/30" />
              </label>
            </div>
            <label className="text-sm font-bold">
              {t.email}
              <input name="email" type="email" autoComplete="email" required className="mt-2 min-h-12 w-full rounded-[8px] border border-ink/18 px-4 py-3 text-base outline-none focus:border-yellow focus:ring-2 focus:ring-yellow/30" />
            </label>
            <div className="border-t border-ink/12 pt-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-bold">{t.feedScreenshot}</p>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink/45">{t.feedOptional}</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-ink/58">{t.feedHelp}</p>
              <label htmlFor="social-feed-screenshot" className="mt-4 inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-ink/25 px-5 py-3 text-xs font-black uppercase tracking-[0.13em] transition hover:border-yellow">
                {feedState === "loading" ? <LoaderCircle className="animate-spin" size={17} /> : <ImagePlus size={17} />}
                {feedState === "loading" ? t.feedAnalysing : t.feedChoose}
              </label>
              <input id="social-feed-screenshot" type="file" accept="image/jpeg,image/png,image/webp" onChange={analyseFeed} disabled={feedState === "loading"} className="sr-only" />
              {feedState === "ready" && feedMetrics ? (
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-l-2 border-yellow bg-yellow/10 px-4 py-3 text-sm">
                  <div><p className="font-bold">{t.feedReady}</p><p className="mt-1 max-w-md truncate text-xs text-ink/55">{feedFileName}</p></div>
                  <button type="button" onClick={removeFeed} className="min-h-11 px-3 text-xs font-black uppercase tracking-[0.12em] underline decoration-yellow decoration-2 underline-offset-4">{t.feedRemove}</button>
                </div>
              ) : null}
              {feedState === "error" ? <p role="alert" className="mt-3 text-sm font-bold text-red-700">{t.feedError}</p> : null}
            </div>
            <label className="sr-only" aria-hidden="true">
              {t.honeypot}
              <input name="companyWebsite" type="text" tabIndex={-1} autoComplete="off" />
            </label>
            <label className="flex min-h-11 items-start gap-3 text-sm leading-6 text-ink/70">
              <input name="privacy" type="checkbox" required className="mt-1 size-4 accent-ink" />
              <span>{t.privacy}</span>
            </label>
            <button type="submit" disabled={status === "loading"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-black uppercase tracking-[0.15em] text-white transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-65">
              {status === "loading" ? <><LoaderCircle className="animate-spin" size={17} />{t.scanning}</> : <>{t.submit}<ArrowUpRight size={17} /></>}
            </button>
            {status === "error" ? <p role="alert" className="rounded-[8px] border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{error || t.error}</p> : null}
          </form>
        </div>
      </section>

      {report ? (
        <section id="scan-report" className="bg-white px-5 py-[var(--hc-section)] text-ink sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 border-b border-ink/15 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="section-eyebrow text-ink/50">{t.report}</p>
                <h2 className="mt-4 max-w-4xl font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-none">{report.businessName}</h2>
                <p className="mt-4 break-all text-sm font-semibold text-ink/55">{report.finalUrl}</p>
              </div>
              <div className="flex size-36 flex-col items-center justify-center rounded-full border-4 border-yellow bg-ink text-white">
                <span className="text-4xl font-black">{report.overallScore}</span>
                <span className="mt-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-white/60">{t.score}</span>
              </div>
            </div>

            <div className="mt-10 grid gap-6 border border-ink/15 bg-ink p-6 text-white sm:p-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-10">
              <div>
                <p className="section-eyebrow text-yellow">{t.overview}</p>
                <p className="mt-4 text-sm font-black uppercase tracking-[0.14em] text-white/60">{report.overview.typeLabel}</p>
                {report.location ? <p className="mt-2 text-sm text-white/65">{report.location}</p> : null}
              </div>
              <div>
                <h3 className="font-serif text-3xl font-semibold leading-tight sm:text-4xl">{report.overview.headline}</h3>
                <p className="mt-4 max-w-3xl text-base leading-7 text-white/75">{report.overview.summary}</p>
                <p className="mt-6 text-[0.62rem] font-black uppercase tracking-[0.14em] text-yellow">{t.offerings}</p>
                {report.overview.offerings.length ? <div className="mt-3 flex flex-wrap gap-2">{report.overview.offerings.map((offering) => <span key={offering} className="rounded-full border border-white/25 px-3 py-2 text-xs font-bold text-white">{offering}</span>)}</div> : <p className="mt-3 text-sm text-white/65">{t.noOfferings}</p>}
              </div>
            </div>

            <div className="mt-10 grid auto-rows-fr gap-5 md:grid-cols-2 xl:grid-cols-4">
              {report.areas.map((item) => {
                const presentation = statusPresentation(item.score, item.confidence, t);
                return (
                <article key={item.key} className="flex min-h-[25rem] h-full flex-col bg-ink p-6 text-white">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-serif text-2xl font-semibold leading-tight">{item.title}</h3>
                    <span className="text-3xl font-black text-yellow">{item.score}</span>
                  </div>
                  <span className={`mt-4 w-fit rounded-full px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-[0.14em] ${presentation.className}`}>
                    {presentation.label}
                  </span>
                  <p className="mt-4 text-sm leading-6 text-white/70">{item.summary}</p>
                  {(item.strengths?.length || item.improvements?.length) ? (
                    <div className="mt-5 space-y-5 border-t border-white/12 pt-5 text-sm leading-6">
                      {item.strengths?.length ? <div><p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-yellow">{t.whatWorks}</p><ul className="mt-2 space-y-2 text-white/82">{item.strengths.slice(0, 2).map((strength) => <li key={strength} className="flex gap-2"><Check className="mt-1 shrink-0 text-yellow" size={14} />{strength}</li>)}</ul></div> : null}
                      {item.improvements?.length ? <div><p className="text-[0.62rem] font-black uppercase tracking-[0.14em] text-yellow">{t.improveNext}</p><ul className="mt-2 space-y-2 text-white/82">{item.improvements.slice(0, 2).map((improvement) => <li key={improvement} className="flex gap-2"><ArrowUpRight className="mt-1 shrink-0 text-yellow" size={14} />{improvement}</li>)}</ul></div> : null}
                    </div>
                  ) : (
                    <ul className="mt-5 space-y-3 border-t border-white/12 pt-5 text-sm leading-6 text-white/76">
                      {item.findings.slice(0, 3).map((finding) => <li key={finding} className="flex gap-2"><Check className="mt-1 shrink-0 text-yellow" size={14} />{finding}</li>)}
                    </ul>
                  )}
                </article>
              );})}
            </div>

            <div className="mt-12 grid gap-10 border-y border-ink/15 py-10 lg:grid-cols-2">
              <div>
                <h3 className="font-serif text-3xl font-semibold">{t.priorities}</h3>
                <ol className="mt-6 space-y-4">
                  {report.priorities.map((priority) => <li key={priority} className="border-l-2 border-yellow pl-4 text-base leading-7">{priority}</li>)}
                </ol>
              </div>
              <div className="border border-ink/15 p-6 sm:p-8">
                <h3 className="font-serif text-3xl font-semibold">{t.discovered}</h3>
                <p className="mt-3 max-w-xl text-sm leading-6 text-ink/60">{t.evidenceHelp}</p>
                {(report.discovered.socialProfiles ?? []).length ? (
                  <div className="mt-5">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-ink/48">{t.socialCoverage}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {(report.discovered.socialProfiles ?? []).map((profile) => (
                        <a key={`${profile.platform}-${profile.url}`} href={profile.url} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-between gap-3 border border-ink/15 px-3 py-2 text-xs font-bold hover:border-yellow">
                          <span>{profile.platform}</span>
                          <span className={profile.status === "scanned" ? "bg-yellow px-2 py-1 text-ink" : profile.status === "partial" ? "border border-yellow px-2 py-1 text-ink" : "border border-ink/20 px-2 py-1 text-ink/55"}>
                            {profile.status === "scanned" ? t.scanned : profile.status === "partial" ? t.partial : t.blocked}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
                {[
                  [report.businessType === "hotel_accommodation" ? t.directBooking : report.businessType === "restaurant_venue" ? (locale === "pt" ? "Reservas e pedidos" : "Reservation and ordering routes") : (locale === "pt" ? "Compra e produtos" : "Purchase and product routes"), report.discovered.directBookingLinks ?? []],
                  [t.enquiries, report.discovered.enquiryLinks ?? []],
                  [t.socials, report.discovered.socialLinks],
                  [t.google, report.discovered.googleLinks],
                  [t.otas, report.discovered.otaLinks]
                ].filter(([, values]) => (values as string[]).length > 0).map(([label, values]) => (
                  <div key={label as string} className="mt-5">
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-ink/48">{label as string}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(values as string[]).map((value) => (
                        <a key={value} href={value} target="_blank" rel="noreferrer" className="rounded-full border border-ink/15 px-3 py-2 text-xs font-bold hover:border-yellow">{domainLabel(value)}</a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h3 className="font-serif text-2xl font-semibold">{t.limitations}</h3>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-ink/62">
                  {report.limitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
                </ul>
                <p className="mt-5 text-sm font-bold text-ink/70">{stored ? t.saved : t.notSaved}</p>
                <p className="mt-2 text-sm text-ink/60">{emailSent ? t.emailed : t.notEmailed}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => window.print()} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/30 px-5 text-xs font-black uppercase tracking-[0.14em]"><Printer size={16} />{t.print}</button>
                <a href={`mailto:info@hospoagency.com?subject=${encodeURIComponent(`Digital scan: ${report.businessName}`)}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-5 text-xs font-black uppercase tracking-[0.14em] text-white">{t.discuss}<ArrowUpRight size={16} /></a>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
