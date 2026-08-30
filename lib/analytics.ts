export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-Z611TBYKCQ";
export const COOKIE_CONSENT_EVENT = "hospo:open-cookie-settings";
export const COOKIE_CONSENT_NAME = "hospo_cookie_consent";
export const COOKIE_CONSENT_VERSION = "v1";
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

export type AnalyticsConsent = "granted" | "denied";
export type AnalyticsEventName = "generate_lead" | "contact_click" | "cta_click" | "proposal_view" | "proposal_cta_click";

export function getConsentCookieValue(analytics: AnalyticsConsent) {
  return `${COOKIE_CONSENT_VERSION}:analytics:${analytics}`;
}

export function parseConsentCookie(value?: string): AnalyticsConsent | null {
  if (!value) return null;
  const [version, category, consent] = value.split(":");
  if (version !== COOKIE_CONSENT_VERSION || category !== "analytics") return null;
  return consent === "granted" || consent === "denied" ? consent : null;
}

function hasAnalyticsConsent() {
  if (typeof document === "undefined") return false;
  const value = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_CONSENT_NAME}=`))
    ?.split("=")[1];
  return parseConsentCookie(value ? decodeURIComponent(value) : undefined) === "granted";
}

export function trackAnalyticsEvent(name: AnalyticsEventName, parameters: Record<string, string> = {}) {
  if (typeof window === "undefined" || !hasAnalyticsConsent()) return;
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  gtag?.("event", name, parameters);
}
