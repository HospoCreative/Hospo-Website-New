import type { Metadata } from "next";
import { SeoStructuredData } from "@/components/SeoStructuredData";
import { getSiteContent } from "@/data/site";
import { getRequestLocale, getRequestPath } from "@/lib/locale-server";
import { buildPageMetadata, SITE_URL } from "@/lib/seo";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const siteContent = getSiteContent(locale);
  return buildPageMetadata({
    title: siteContent.metadata.title,
    description: siteContent.metadata.description,
    pathname: await getRequestPath(),
    locale
  });
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  const siteContent = getSiteContent(locale);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Hospo Creative",
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        email: siteContent.contact.email,
        description: siteContent.metadata.description,
        sameAs: siteContent.contact.socials.map((social) => social.href)
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Hospo Creative",
        inLanguage: ["en-GB", "pt-PT"],
        publisher: { "@id": `${SITE_URL}/#organization` }
      }
    ]
  };
  return (
    <html lang={locale === "pt" ? "pt-PT" : "en-GB"}>
      <body className="font-sans antialiased">
        <SeoStructuredData data={structuredData} />
        {children}
      </body>
    </html>
  );
}
