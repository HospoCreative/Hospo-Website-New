export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-Z611TBYKCQ";
export const COOKIE_CONSENT_EVENT = "hospo:open-cookie-settings";
export const COOKIE_CONSENT_NAME = "hospo_cookie_consent";
export const COOKIE_CONSENT_VERSION = "v1";
export const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 180;

export type AnalyticsConsent = "granted" | "denied";

export function getConsentCookieValue(analytics: AnalyticsConsent) {
  return `${COOKIE_CONSENT_VERSION}:analytics:${analytics}`;
}

export function parseConsentCookie(value?: string): AnalyticsConsent | null {
  if (!value) return null;
  const [version, category, consent] = value.split(":");
  if (version !== COOKIE_CONSENT_VERSION || category !== "analytics") return null;
  return consent === "granted" || consent === "denied" ? consent : null;
}
