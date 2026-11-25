import { getSiteContent } from "@/data/site";
import { type Locale } from "@/lib/i18n";
import { HeaderClient } from "./HeaderClient";

export async function Header({ locale = "en", showLanguageSwitcher = true }: { locale?: Locale; showLanguageSwitcher?: boolean }) {
  const siteContent = getSiteContent(locale);

  return <HeaderClient locale={locale} navItems={[...siteContent.navItems]} showLanguageSwitcher={showLanguageSwitcher} />;
}
