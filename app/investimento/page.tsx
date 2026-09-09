import type { Metadata } from "next";
import { cookies } from "next/headers";
import { PortugalInvestmentPage } from "@/components/PortugalInvestmentPage";
import { hasValidInvestmentAccess, investmentAccess } from "@/lib/investmentAccess";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function PortugalInvestment() {
  const cookieStore = await cookies();
  const accessGranted = hasValidInvestmentAccess(cookieStore.get(investmentAccess.cookieName)?.value);
  return <PortugalInvestmentPage accessGranted={accessGranted}/>;
}
