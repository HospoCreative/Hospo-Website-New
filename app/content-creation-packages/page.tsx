import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrivateContentCreationLanding } from "@/components/PrivateContentCreationLanding";

export const metadata: Metadata = {
  title: "Content Creation Packages | Hospo Creative",
  description: "Flexible photography and short-form video packages for hospitality and lifestyle businesses.",
  robots: { index: false, follow: false, nocache: true }
};

export default function ContentCreationPackagesPage() {
  return <><Header locale="en"/><main id="main"><PrivateContentCreationLanding/></main><Footer locale="en"/></>;
}
