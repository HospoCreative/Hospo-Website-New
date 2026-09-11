import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrivateContentCreationLanding } from "@/components/PrivateContentCreationLanding";

export const metadata: Metadata = {
  title: "Content Creation Packages | Photography & Video | HOSPO Creative",
  description: "Photography and short-form video content packages for restaurants, hotels, bars and hospitality brands. Build a professional content library for social media, websites and digital campaigns."
};

export default function ContentCreationPackagesPage() {
  return <><Header locale="en" showLanguageSwitcher={false}/><main id="main"><PrivateContentCreationLanding/></main><Footer locale="en"/></>;
}
