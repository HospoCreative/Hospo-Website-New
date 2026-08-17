import { getSiteContent } from "@/data/site";
import { type Locale } from "@/lib/i18n";
import { getPublishedBlogPosts } from "@/lib/supabase/queries";
import { HeaderClient } from "./HeaderClient";

export async function Header({ locale = "en" }: { locale?: Locale }) {
  const [siteContent, publishedArticles] = await Promise.all([
    Promise.resolve(getSiteContent(locale)),
    getPublishedBlogPosts(locale)
  ]);
  const navItems = siteContent.navItems.filter(
    (item) => publishedArticles.length > 0 || item.href !== "/blog"
  );

  return <HeaderClient locale={locale} navItems={navItems} />;
}
