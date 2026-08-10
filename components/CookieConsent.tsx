"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Check, ChevronDown, Cookie, X } from "lucide-react";
import {
  COOKIE_CONSENT_EVENT,
  COOKIE_CONSENT_MAX_AGE,
  COOKIE_CONSENT_NAME,
  GA_MEASUREMENT_ID,
  getConsentCookieValue,
  parseConsentCookie,
  type AnalyticsConsent
} from "@/lib/analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

type Copy = {
  title: string;
  body: string;
  accept: string;
  reject: string;
  manage: string;
  save: string;
  close: string;
  necessary: string;
  necessaryDescription: string;
  analytics: string;
  analyticsDescription: string;
  alwaysOn: string;
  enabled: string;
};

const copy: Record<"en" | "pt", Copy> = {
  en: {
    title: "Your privacy choices",
    body: "We use necessary cookies to keep the site working. With your permission, analytics cookies help us understand how visitors use the site.",
    accept: "Accept all",
    reject: "Reject non-essential",
    manage: "Manage preferences",
    save: "Save preferences",
    close: "Close cookie settings",
    necessary: "Necessary",
    necessaryDescription: "Required for core website functionality and security.",
    analytics: "Analytics",
    analyticsDescription: "Helps us measure visits and improve the website using Google Analytics.",
    alwaysOn: "Always on",
    enabled: "Enabled"
  },
  pt: {
    title: "As suas escolhas de privacidade",
    body: "Utilizamos cookies necessários para manter o website a funcionar. Com a sua autorização, os cookies de análise ajudam-nos a compreender como os visitantes utilizam o website.",
    accept: "Aceitar tudo",
    reject: "Rejeitar não essenciais",
    manage: "Gerir preferências",
    save: "Guardar preferências",
    close: "Fechar definições de cookies",
    necessary: "Necessários",
    necessaryDescription: "Necessários para a funcionalidade e segurança essenciais do website.",
    analytics: "Análise",
    analyticsDescription: "Ajuda-nos a medir as visitas e a melhorar o website com o Google Analytics.",
    alwaysOn: "Sempre ativos",
    enabled: "Ativado"
  }
};

function readConsentCookie() {
  if (typeof document === "undefined") return null;
  const value = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_CONSENT_NAME}=`))
    ?.split("=")[1];
  return parseConsentCookie(value ? decodeURIComponent(value) : undefined);
}

function ensureGoogleConsentMode() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => window.dataLayer?.push(args));
}

function updateGoogleConsent(analytics: AnalyticsConsent) {
  ensureGoogleConsentMode();
  window.gtag?.("consent", "update", {
    analytics_storage: analytics,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
}

export function CookieConsent({ locale = "en" }: { locale?: "en" | "pt" }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [ready, setReady] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isManaging, setIsManaging] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const t = copy[locale];
  const isAdmin = pathname?.startsWith("/admin");

  const applyConsent = useCallback((nextConsent: AnalyticsConsent) => {
    document.cookie = `${COOKIE_CONSENT_NAME}=${encodeURIComponent(getConsentCookieValue(nextConsent))}; Max-Age=${COOKIE_CONSENT_MAX_AGE}; Path=/; SameSite=Lax; Secure`;
    updateGoogleConsent(nextConsent);
    setAnalyticsEnabled(nextConsent === "granted");
    setConsent(nextConsent);
    setIsOpen(false);
    setIsManaging(false);
  }, []);

  useEffect(() => {
    if (isAdmin) return;
    ensureGoogleConsentMode();
    window.gtag?.("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500
    });

    const storedConsent = readConsentCookie();
    if (storedConsent) {
      updateGoogleConsent(storedConsent);
      setAnalyticsEnabled(storedConsent === "granted");
      setConsent(storedConsent);
    } else {
      setIsOpen(true);
    }
    setReady(true);
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin) return;
    const openSettings = () => {
      setAnalyticsEnabled(consent === "granted");
      setIsManaging(true);
      setIsOpen(true);
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, openSettings);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, openSettings);
  }, [consent, isAdmin]);

  useEffect(() => {
    if (!scriptReady || !analyticsEnabled || !pathname) return;
    window.gtag?.("config", GA_MEASUREMENT_ID, {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
      send_page_view: true
    });
  }, [analyticsEnabled, pathname, scriptReady]);

  if (isAdmin || !ready) return null;

  return (
    <>
      {analyticsEnabled ? (
        <Script
          id="hospo-google-analytics"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
          onLoad={() => {
            ensureGoogleConsentMode();
            window.gtag?.("js", new Date());
            setScriptReady(true);
          }}
        />
      ) : null}

      {isOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-[100] p-3 sm:p-5" role="presentation">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-consent-title"
            className="mx-auto w-full max-w-2xl rounded-[0.75rem] border border-white/20 bg-ink p-5 text-white shadow-2xl sm:p-6"
          >
            <div className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-yellow text-ink" aria-hidden="true">
                <Cookie size={19} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h2 id="cookie-consent-title" className="font-serif text-2xl font-semibold leading-none sm:text-3xl">{t.title}</h2>
                  {consent ? (
                    <button type="button" onClick={() => setIsOpen(false)} aria-label={t.close} className="grid size-10 shrink-0 place-items-center rounded-full border border-white/25 text-white transition hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">
                      <X aria-hidden="true" size={18} />
                    </button>
                  ) : null}
                </div>
                <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">{t.body}</p>

                {isManaging ? (
                  <div className="mt-5 border-y border-white/15 py-1">
                    <ConsentRow title={t.necessary} description={t.necessaryDescription} label={t.alwaysOn} />
                    <label className="flex cursor-pointer items-center justify-between gap-4 py-4">
                      <span>
                        <span className="block text-sm font-extrabold uppercase tracking-[0.12em]">{t.analytics}</span>
                        <span className="mt-1 block max-w-md text-sm leading-6 text-white/65">{t.analyticsDescription}</span>
                      </span>
                      <input
                        type="checkbox"
                        checked={analyticsEnabled}
                        onChange={(event) => setAnalyticsEnabled(event.target.checked)}
                        className="size-5 shrink-0 accent-[#ffcc53]"
                        aria-label={t.analytics}
                      />
                    </label>
                  </div>
                ) : null}

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  {!isManaging ? (
                    <>
                      <button type="button" onClick={() => applyConsent("granted")} className="button-primary min-h-11 bg-yellow text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                        <Check aria-hidden="true" size={16} /> {t.accept}
                      </button>
                      <button type="button" onClick={() => applyConsent("denied")} className="button-secondary min-h-11 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">
                        {t.reject}
                      </button>
                      <button type="button" onClick={() => setIsManaging(true)} className="inline-flex min-h-11 items-center justify-center gap-2 px-3 text-xs font-extrabold uppercase tracking-[0.12em] text-white/75 transition hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow">
                        {t.manage} <ChevronDown aria-hidden="true" size={15} />
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={() => applyConsent(analyticsEnabled ? "granted" : "denied")} className="button-primary min-h-11 bg-yellow text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
                      {t.save}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function ConsentRow({ title, description, label }: { title: string; description: string; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <span>
        <span className="block text-sm font-extrabold uppercase tracking-[0.12em]">{title}</span>
        <span className="mt-1 block max-w-md text-sm leading-6 text-white/65">{description}</span>
      </span>
      <span className="shrink-0 rounded-full border border-yellow/70 px-3 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-yellow">{label}</span>
    </div>
  );
}
