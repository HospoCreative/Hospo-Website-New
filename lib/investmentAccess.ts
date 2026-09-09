import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "hospo_pt_investment_access";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function secret() {
  return process.env.INVESTMENT_ACCESS_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || null;
}

function signature(expiry: string, key: string) {
  return createHmac("sha256", key).update(`pricing_portugal:${expiry}`).digest("base64url");
}

export function createInvestmentAccessToken() {
  const key = secret();
  if (!key) return null;
  const expiry = String(Date.now() + MAX_AGE_SECONDS * 1000);
  return `${expiry}.${signature(expiry, key)}`;
}

export function hasValidInvestmentAccess(value?: string) {
  const key = secret();
  if (!value || !key) return false;
  const [expiry, received] = value.split(".");
  if (!expiry || !received || Number(expiry) < Date.now()) return false;
  const expected = signature(expiry, key);
  try {
    return timingSafeEqual(Buffer.from(received), Buffer.from(expected));
  } catch {
    return false;
  }
}

export const investmentAccess = { cookieName: COOKIE_NAME, maxAgeSeconds: MAX_AGE_SECONDS };
