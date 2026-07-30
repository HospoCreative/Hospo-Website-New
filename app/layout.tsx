import type { Metadata } from "next";
import { getSiteContent } from "@/data/site";
import { getRequestLocale } from "@/lib/locale-server";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const siteContent = getSiteContent(await getRequestLocale());
  return {
    metadataBase: new URL("https://www.hospoagency.com"),
    title: siteContent.metadata.title,
    description: siteContent.metadata.description,
    openGraph: {
      title: siteContent.metadata.title,
      description: siteContent.metadata.description,
      images: [siteContent.hero.backgroundImage.src]
    }
  };
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();
  return (
    <html lang={locale === "pt" ? "pt-PT" : "en-GB"}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
