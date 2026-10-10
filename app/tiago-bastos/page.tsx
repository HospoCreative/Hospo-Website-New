import { getRequestLocale } from "@/lib/locale-server";
import { permanentRedirect } from "next/navigation";

const destination = "/tiago-bastos-commercial-photographer-videographer";

export default async function LegacyTiagoBastosPage() {
  const locale = await getRequestLocale();
  permanentRedirect(`${locale === "pt" ? "/pt" : ""}${destination}`);
}
