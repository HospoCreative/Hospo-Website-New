import { headers } from "next/headers";
import type { Locale } from "./i18n";

export async function getRequestLocale(): Promise<Locale> {
  return (await headers()).get("x-hospo-locale") === "pt" ? "pt" : "en";
}

export async function getRequestPath() {
  return (await headers()).get("x-hospo-path") || "/";
}
