import "server-only";

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type {
  DigitalScanReport,
  ScanArea,
  ScanAreaKey,
  ScanConfidence,
  SocialFeedMetrics
} from "@/types/digitalScan";
import type { Locale } from "@/lib/i18n";

const MAX_HTML_BYTES = 2_000_000;
const MAX_REDIRECTS = 4;
const FETCH_TIMEOUT_MS = 14_000;

const socialDomains = [
  "instagram.com",
  "facebook.com",
  "tiktok.com",
  "youtube.com",
  "linkedin.com",
  "pinterest.com"
];

const otaDomains = [
  "booking.com",
  "expedia.com",
  "hotels.com",
  "tripadvisor.com",
  "airbnb.com",
  "vrbo.com",
  "opentable.com",
  "thefork.com",
  "resy.com"
];

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function decodeEntities(value: string) {
  return value
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function tagAttribute(tag: string, attribute: string) {
  const match = tag.match(new RegExp(`\\b${attribute}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match ? decodeEntities(match[2]) : "";
}

function metaContent(html: string, name: string) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    const key = tagAttribute(tag, "name") || tagAttribute(tag, "property");
    if (key.toLowerCase() === name.toLowerCase()) return tagAttribute(tag, "content");
  }
  return "";
}

function linkHref(html: string, rel: string) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  for (const tag of tags) {
    if (tagAttribute(tag, "rel").toLowerCase().split(/\s+/).includes(rel)) {
      return tagAttribute(tag, "href");
    }
  }
  return "";
}

function textContent(html: string, tagName: string) {
  const match = html.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match ? decodeEntities(match[1].replace(/<[^>]+>/g, " ")) : "";
}

function unique<T>(values: T[]) {
  return Array.from(new Set(values));
}

function normaliseLink(raw: string, base: URL) {
  try {
    const url = new URL(raw, base);
    return ["http:", "https:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
}

function extractLinks(html: string, base: URL) {
  return unique(
    (html.match(/<a\b[^>]*>/gi) ?? [])
      .map((tag) => tagAttribute(tag, "href"))
      .filter(Boolean)
      .map((href) => normaliseLink(href, base))
      .filter(Boolean)
  );
}

function linksForDomains(links: string[], domains: string[]) {
  return links.filter((link) => {
    try {
      const host = new URL(link).hostname.toLowerCase();
      return domains.some((domain) => host === domain || host.endsWith(`.${domain}`));
    } catch {
      return false;
    }
  });
}

function imageSignals(html: string) {
  const images = html.match(/<img\b[^>]*>/gi) ?? [];
  const withAlt = images.filter((tag) => tagAttribute(tag, "alt").trim().length >= 3).length;
  const withDimensions = images.filter(
    (tag) => Boolean(tagAttribute(tag, "width") && tagAttribute(tag, "height"))
  ).length;
  return {
    count: images.length,
    altCoverage: images.length ? withAlt / images.length : 0,
    dimensionCoverage: images.length ? withDimensions / images.length : 0
  };
}

function structuredData(html: string) {
  const blocks = Array.from(
    html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)
  ).map((match) => match[1].trim());
  const serialised = blocks.join(" ").toLowerCase();
  return {
    found: blocks.length > 0,
    localBusiness:
      serialised.includes("localbusiness") ||
      serialised.includes('"hotel"') ||
      serialised.includes('"restaurant"') ||
      serialised.includes('"lodgingbusiness"'),
    hasAddress: serialised.includes('"address"'),
    hasTelephone: serialised.includes('"telephone"'),
    hasSameAs: serialised.includes('"sameas"')
  };
}

function isPrivateIpv4(address: string) {
  const parts = address.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part))) return true;
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

function isPrivateAddress(address: string) {
  if (isIP(address) === 4) return isPrivateIpv4(address);
  if (isIP(address) === 6) {
    const normalised = address.toLowerCase();
    return (
      normalised === "::" ||
      normalised === "::1" ||
      normalised.startsWith("fc") ||
      normalised.startsWith("fd") ||
      normalised.startsWith("fe8") ||
      normalised.startsWith("fe9") ||
      normalised.startsWith("fea") ||
      normalised.startsWith("feb") ||
      normalised.startsWith("::ffff:127.") ||
      normalised.startsWith("::ffff:10.") ||
      normalised.startsWith("::ffff:192.168.")
    );
  }
  return true;
}

async function assertPublicUrl(url: URL) {
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only public HTTP and HTTPS websites can be scanned.");
  if (url.username || url.password) throw new Error("Website credentials are not accepted.");
  if (url.hostname === "localhost" || url.hostname.endsWith(".local") || url.hostname.endsWith(".internal")) {
    throw new Error("Private or local websites cannot be scanned.");
  }

  if (isIP(url.hostname)) {
    if (isPrivateAddress(url.hostname)) throw new Error("Private or local websites cannot be scanned.");
    return;
  }

  const addresses = await lookup(url.hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw new Error("The website address does not resolve to a public server.");
  }
}

async function readLimitedHtml(response: Response) {
  const declaredSize = Number(response.headers.get("content-length") || 0);
  if (declaredSize > MAX_HTML_BYTES) throw new Error("The website homepage is too large to scan safely.");
  if (!response.body) throw new Error("The website returned no readable content.");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let html = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_HTML_BYTES) {
      await reader.cancel();
      throw new Error("The website homepage is too large to scan safely.");
    }
    html += decoder.decode(value, { stream: true });
  }

  return html + decoder.decode();
}

async function fetchPublicHomepage(initialUrl: URL) {
  let current = initialUrl;

  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect += 1) {
    await assertPublicUrl(current);
    const response = await fetch(current, {
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "user-agent": "HospoCreativePublicScan/1.0 (+https://www.hospoagency.com)"
      }
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("The website returned an invalid redirect.");
      current = new URL(location, current);
      continue;
    }

    if (!response.ok) throw new Error(`The website returned HTTP ${response.status}.`);
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.includes("text/html")) throw new Error("The website did not return an HTML page.");

    return {
      html: await readLimitedHtml(response),
      finalUrl: current,
      status: response.status
    };
  }

  throw new Error("The website redirected too many times.");
}

type PageSpeedScores = {
  performance?: number;
  accessibility?: number;
  seo?: number;
  bestPractices?: number;
};

async function pageSpeed(url: string): Promise<PageSpeedScores | null> {
  try {
    const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
    endpoint.searchParams.set("url", url);
    endpoint.searchParams.set("strategy", "mobile");
    ["performance", "accessibility", "seo", "best-practices"].forEach((category) =>
      endpoint.searchParams.append("category", category)
    );
    if (process.env.GOOGLE_PAGESPEED_API_KEY) {
      endpoint.searchParams.set("key", process.env.GOOGLE_PAGESPEED_API_KEY);
    }

    const response = await fetch(endpoint, { signal: AbortSignal.timeout(25_000) });
    if (!response.ok) return null;
    const data = (await response.json()) as {
      lighthouseResult?: { categories?: Record<string, { score?: number }> };
    };
    const categories = data.lighthouseResult?.categories ?? {};
    const score = (key: string) =>
      typeof categories[key]?.score === "number" ? Math.round((categories[key].score ?? 0) * 100) : undefined;
    return {
      performance: score("performance"),
      accessibility: score("accessibility"),
      seo: score("seo"),
      bestPractices: score("best-practices")
    };
  } catch {
    return null;
  }
}

function area(
  key: ScanAreaKey,
  title: string,
  score: number,
  confidence: ScanConfidence,
  summary: string,
  findings: string[]
): ScanArea {
  return { key, title, score: clamp(score), confidence, summary, findings };
}

function portugueseReport(report: DigitalScanReport): DigitalScanReport {
  const exact = new Map<string, string>([
    ["Website health", "Saúde do website"],
    ["Technical foundations and mobile readiness.", "Fundamentos técnicos e preparação para dispositivos móveis."],
    ["SEO and performance", "SEO e desempenho"],
    ["Search foundations and mobile performance signals.", "Fundamentos de pesquisa e sinais de desempenho móvel."],
    ["Booking journey", "Percurso de reserva"],
    ["How clearly the website guides a guest towards action.", "Clareza com que o website orienta o hóspede para uma ação."],
    ["Public Google listing match", "Correspondência com a presença pública no Google"],
    ["Public Google and local business signals linked from the website.", "Sinais públicos do Google e do negócio local ligados a partir do website."],
    ["Social and OTA links", "Ligações a redes sociais e OTAs"],
    ["Public platform links that support discovery and comparison.", "Ligações públicas que apoiam a descoberta e comparação."],
    ["Social feed visual consistency", "Consistência visual do feed"],
    ["Rules-based visual signals from a privately analysed feed screenshot.", "Sinais visuais calculados a partir de uma captura do feed analisada em privado."],
    ["A feed screenshot was analysed privately in the browser. The image was not uploaded.", "Uma captura do feed foi analisada em privado no navegador. A imagem não foi enviada."],
    ["No feed screenshot was supplied, so visual branding could not be measured.", "Não foi fornecida uma captura do feed, por isso não foi possível medir a consistência visual da marca."],
    ["Public social profile links were found on the website.", "Foram encontradas no website ligações públicas para redes sociais."],
    ["No public social profile links were found on the website.", "Não foram encontradas no website ligações públicas para redes sociais."],
    ["Upload a feed screenshot to add a free visual consistency check without connecting an account.", "Carregue uma captura do feed para adicionar uma análise visual gratuita sem ligar qualquer conta."],
    ["This free rules-based check measures visual consistency but does not recognise logos, read post copy or identify content subjects.", "Esta análise gratuita baseada em regras mede a consistência visual, mas não reconhece logótipos, não lê o texto das publicações nem identifica o conteúdo das imagens."],
    ["Use a more consistent colour treatment or recurring branded graphic system across the feed.", "Use um tratamento de cor mais consistente ou um sistema gráfico de marca recorrente em todo o feed."],
    ["Balance very dark and very bright posts so the feed feels more intentional as a whole.", "Equilibre publicações muito escuras e muito claras para que o feed pareça mais intencional no seu conjunto."],
    ["Use higher-resolution feed imagery and export graphics at platform-ready dimensions.", "Use imagens de maior resolução e exporte os grafismos com dimensões adequadas à plataforma."],
    ["Increase the variety of recent visuals so repeated-looking posts do not weaken the feed.", "Aumente a variedade visual das publicações recentes para evitar que imagens demasiado semelhantes enfraqueçam o feed."],
    ["Brand and contact consistency", "Consistência da marca e contactos"],
    ["Contact, location and sharing signals available to guests.", "Sinais de contacto, localização e partilha disponíveis para os hóspedes."],
    ["Photography presentation", "Apresentação fotográfica"],
    ["Image quantity, accessibility and technical presentation.", "Quantidade, acessibilidade e apresentação técnica das imagens."],
    ["The website uses HTTPS.", "O website utiliza HTTPS."],
    ["The website is not using HTTPS.", "O website não utiliza HTTPS."],
    ["A mobile viewport is configured.", "A visualização para dispositivos móveis está configurada."],
    ["A mobile viewport declaration was not found.", "Não foi encontrada uma configuração de visualização móvel."],
    ["The page language is not declared.", "O idioma da página não está declarado."],
    ["Live accessibility scoring was unavailable during this scan.", "A pontuação de acessibilidade em tempo real não estava disponível durante esta análise."],
    ["A meta description is present.", "Existe uma descrição meta."],
    ["A meta description was not found.", "Não foi encontrada uma descrição meta."],
    ["A primary page heading is present.", "Existe um título principal na página."],
    ["A primary H1 heading was not found.", "Não foi encontrado um título principal H1."],
    ["A canonical URL is declared.", "Está declarado um URL canónico."],
    ["A canonical URL was not found.", "Não foi encontrado um URL canónico."],
    ["Structured data was detected.", "Foram detetados dados estruturados."],
    ["No JSON-LD structured data was detected.", "Não foram detetados dados estruturados JSON-LD."],
    ["Live PageSpeed data was unavailable during this scan.", "Os dados PageSpeed em tempo real não estavam disponíveis durante esta análise."],
    ["No clear booking, reservation or enquiry link was detected.", "Não foi detetada uma ligação clara para reserva ou contacto."],
    ["At least one external booking or hospitality platform is linked.", "Existe uma ligação a pelo menos uma plataforma externa de reservas ou hotelaria."],
    ["No supported OTA or reservation platform link was detected.", "Não foi detetada uma ligação a uma OTA ou plataforma de reservas suportada."],
    ["A telephone contact signal is present.", "Existe um sinal de contacto telefónico."],
    ["A telephone contact signal was not found.", "Não foi encontrado um sinal de contacto telefónico."],
    ["A public Google Maps or Business Profile link was found on the website.", "Foi encontrada no website uma ligação pública ao Google Maps ou Perfil de Empresa."],
    ["A direct Google Maps or Business Profile link was not found on the website.", "Não foi encontrada no website uma ligação direta ao Google Maps ou Perfil de Empresa."],
    ["Local hospitality business structured data was detected.", "Foram detetados dados estruturados de um negócio local de hotelaria."],
    ["LocalBusiness, Hotel, Restaurant or LodgingBusiness schema was not detected.", "Não foi detetado esquema LocalBusiness, Hotel, Restaurant ou LodgingBusiness."],
    ["This public scan does not access private Google Business Profile analytics.", "Esta análise pública não acede a dados privados do Perfil de Empresa no Google."],
    ["No supported social profile links were detected.", "Não foram detetadas ligações a redes sociais suportadas."],
    ["No supported OTA or reservation links were detected.", "Não foram detetadas ligações a OTAs ou plataformas de reservas suportadas."],
    ["Profiles that are not linked from the website may require a connected or licensed platform search.", "Perfis que não estejam ligados a partir do website podem exigir uma pesquisa numa plataforma ligada ou licenciada."],
    ["An email contact signal was found.", "Foi encontrado um sinal de contacto por email."],
    ["A public email contact signal was not found.", "Não foi encontrado um email de contacto público."],
    ["A telephone contact signal was found.", "Foi encontrado um sinal de contacto telefónico."],
    ["A public telephone contact signal was not found.", "Não foi encontrado um contacto telefónico público."],
    ["An address or location signal was found.", "Foi encontrado um sinal de endereço ou localização."],
    ["An address or location signal was not found.", "Não foi encontrado um sinal de endereço ou localização."],
    ["Social sharing title and image metadata are present.", "Estão presentes o título e a imagem para partilha social."],
    ["Complete social sharing metadata was not detected.", "Não foram detetados metadados completos para partilha social."],
    ["Creative quality and brand suitability still require human review.", "A qualidade criativa e adequação à marca continuam a exigir avaliação humana."],
    ["Add one prominent booking or enquiry action in the header and key landing sections.", "Adicione uma ação de reserva ou contacto bem visível no cabeçalho e nas secções principais."],
    ["Write a clear meta description that communicates the hospitality experience and location.", "Escreva uma descrição meta clara que comunique a experiência e a localização."],
    ["Add appropriate hospitality business structured data with address, contact and profile links.", "Adicione dados estruturados adequados ao negócio, com endereço, contactos e ligações aos perfis."],
    ["Link the verified Google Business Profile clearly from the website.", "Ligue claramente o Perfil de Empresa no Google verificado a partir do website."],
    ["Connect the website to the active social profiles guests use to assess the experience.", "Ligue o website às redes sociais ativas que os hóspedes usam para avaliar a experiência."],
    ["Review and link the principal OTA or reservation listing where it supports the guest journey.", "Reveja e ligue a principal OTA ou plataforma de reservas quando apoiar o percurso do hóspede."],
    ["Improve image alt text so photography is accessible and easier for search engines to understand.", "Melhore o texto alternativo das imagens para tornar a fotografia acessível e mais clara para os motores de pesquisa."],
    ["Use a stronger, curated photography sequence to communicate rooms, food, atmosphere and guest experience.", "Use uma sequência fotográfica mais forte e cuidada para comunicar espaços, gastronomia, ambiente e experiência."],
    ["Add complete social sharing metadata so links present consistently when shared.", "Adicione metadados completos para que as ligações tenham uma apresentação consistente quando são partilhadas."],
    ["Prioritise mobile performance, especially image weight and loading behaviour.", "Dê prioridade ao desempenho móvel, especialmente ao peso e carregamento das imagens."],
    ["Maintain the current foundations and complete a human review of content quality and conversion.", "Mantenha os fundamentos atuais e complete uma avaliação humana da qualidade do conteúdo e conversão."],
    ["This scan reviews public signals available from the submitted website.", "Esta análise avalia sinais públicos disponíveis no website submetido."],
    ["It does not access private analytics, account dashboards or unpublished platform information.", "Não acede a análises privadas, painéis de conta ou informação não publicada das plataformas."],
    ["Creative quality, review sentiment and listing accuracy should be confirmed by a human specialist.", "A qualidade criativa, o sentimento das avaliações e a exatidão das listagens devem ser confirmados por um especialista."],
  ]);

  function translate(value: string) {
    const direct = exact.get(value);
    if (direct) return direct;
    return value
      .replace(/^The page language is declared as (.+)\.$/, "O idioma da página está declarado como $1.")
      .replace(/^Mobile accessibility score: (\d+)\/100\.$/, "Pontuação de acessibilidade móvel: $1/100.")
      .replace(/^Page title found: (.+)\.$/, "Título da página encontrado: $1.")
      .replace(/^Mobile performance score: (\d+)\/100\.$/, "Pontuação de desempenho móvel: $1/100.")
      .replace(/^(\d+) booking, reservation or enquiry links? detected\.$/, "$1 ligações de reserva ou contacto detetadas.")
      .replace(/^(\d+) supported social profile links? detected\.$/, "$1 ligações a redes sociais suportadas detetadas.")
      .replace(/^(\d+) supported OTA or reservation links? detected\.$/, "$1 ligações a OTAs ou plataformas de reservas suportadas detetadas.")
      .replace(/^(\d+) images? detected on the homepage\.$/, "$1 imagens detetadas na página inicial.")
      .replace(/^(\d+)% of detected images include useful alt text\.$/, "$1% das imagens detetadas incluem texto alternativo útil.")
      .replace(/^(\d+)% include explicit width and height attributes\.$/, "$1% incluem atributos explícitos de largura e altura.")
      .replace(/^Colour cohesion signal: (\d+)\/100\.$/, "Sinal de coesão cromática: $1/100.")
      .replace(/^Exposure balance signal: (\d+)\/100\.$/, "Sinal de equilíbrio de exposição: $1/100.")
      .replace(/^Contrast balance signal: (\d+)\/100\.$/, "Sinal de equilíbrio de contraste: $1/100.")
      .replace(/^Source image quality signal: (\d+)\/100\.$/, "Sinal de qualidade da imagem de origem: $1/100.")
      .replace(/^Possible visual repetition: (\d+)%\.$/, "Possível repetição visual: $1%.");
  }

  return {
    ...report,
    areas: report.areas.map((item) => ({
      ...item,
      title: translate(item.title),
      summary: translate(item.summary),
      findings: item.findings.map(translate)
    })),
    priorities: report.priorities.map(translate),
    limitations: report.limitations.map(translate)
  };
}

export async function runDigitalScan(input: {
  websiteUrl: string;
  businessName: string;
  location: string;
  locale?: Locale;
  socialFeedMetrics?: SocialFeedMetrics | null;
}): Promise<DigitalScanReport> {
  const suppliedUrl = /^https?:\/\//i.test(input.websiteUrl)
    ? input.websiteUrl
    : `https://${input.websiteUrl}`;
  const initialUrl = new URL(suppliedUrl);
  const { html, finalUrl } = await fetchPublicHomepage(initialUrl);
  const links = extractLinks(html, finalUrl);
  const lowerHtml = html.toLowerCase();
  const title = textContent(html, "title");
  const description = metaContent(html, "description");
  const h1 = textContent(html, "h1");
  const viewport = metaContent(html, "viewport");
  const canonical = linkHref(html, "canonical");
  const language = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1] ?? "";
  const schema = structuredData(html);
  const images = imageSignals(html);
  const socialLinks = linksForDomains(links, socialDomains);
  const otaLinks = linksForDomains(links, otaDomains);
  const googleLinks = links.filter((link) =>
    /(^|\.)google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(link)
  );
  const bookingLinks = links.filter((link) =>
    /book|booking|reserve|reservation|availability|room|table|enquir|contact/i.test(link)
  );
  const hasEmail = /mailto:/i.test(html) || /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(html);
  const hasPhone = /tel:/i.test(html) || schema.hasTelephone;
  const hasAddress = schema.hasAddress || /\baddress\b/i.test(lowerHtml);
  const hasOpenGraph = Boolean(metaContent(html, "og:title") && metaContent(html, "og:image"));
  const speed = await pageSpeed(finalUrl.toString());

  const healthFindings = [
    finalUrl.protocol === "https:" ? "The website uses HTTPS." : "The website is not using HTTPS.",
    viewport ? "A mobile viewport is configured." : "A mobile viewport declaration was not found.",
    language ? `The page language is declared as ${language}.` : "The page language is not declared.",
    speed?.accessibility !== undefined
      ? `Mobile accessibility score: ${speed.accessibility}/100.`
      : "Live accessibility scoring was unavailable during this scan."
  ];
  const healthScore =
    (finalUrl.protocol === "https:" ? 25 : 0) +
    (viewport ? 20 : 0) +
    (language ? 15 : 0) +
    (linkHref(html, "icon") ? 10 : 0) +
    (speed?.accessibility !== undefined ? speed.accessibility * 0.3 : 21);

  const seoChecks = [Boolean(title), Boolean(description), Boolean(h1), Boolean(canonical), schema.found];
  const seoBase = (seoChecks.filter(Boolean).length / seoChecks.length) * 70;
  const seoScore = speed?.seo !== undefined ? seoBase * 0.55 + speed.seo * 0.45 : seoBase + 20;
  const seoFindings = [
    title ? `Page title found: “${title.slice(0, 90)}”.` : "No page title was found.",
    description ? "A meta description is present." : "A meta description was not found.",
    h1 ? "A primary page heading is present." : "A primary H1 heading was not found.",
    canonical ? "A canonical URL is declared." : "A canonical URL was not found.",
    schema.found ? "Structured data was detected." : "No JSON-LD structured data was detected.",
    speed?.performance !== undefined
      ? `Mobile performance score: ${speed.performance}/100.`
      : "Live PageSpeed data was unavailable during this scan."
  ];

  const bookingScore = Math.min(100, bookingLinks.length * 18 + (otaLinks.length ? 15 : 0) + (hasPhone ? 10 : 0));
  const bookingFindings = [
    bookingLinks.length
      ? `${bookingLinks.length} booking, reservation or enquiry link${bookingLinks.length === 1 ? "" : "s"} detected.`
      : "No clear booking, reservation or enquiry link was detected.",
    otaLinks.length
      ? "At least one external booking or hospitality platform is linked."
      : "No supported OTA or reservation platform link was detected.",
    hasPhone ? "A telephone contact signal is present." : "A telephone contact signal was not found."
  ];

  const googleScore = googleLinks.length ? 90 : schema.localBusiness ? 58 : schema.hasAddress ? 35 : 15;
  const googleConfidence: ScanConfidence = googleLinks.length
    ? "verified"
    : schema.localBusiness || schema.hasAddress
      ? "partial"
      : "not_confirmed";
  const googleFindings = [
    googleLinks.length
      ? "A public Google Maps or Business Profile link was found on the website."
      : "A direct Google Maps or Business Profile link was not found on the website.",
    schema.localBusiness
      ? "Local hospitality business structured data was detected."
      : "LocalBusiness, Hotel, Restaurant or LodgingBusiness schema was not detected.",
    "This public scan does not access private Google Business Profile analytics."
  ];

  const visibilityScore = Math.min(100, socialLinks.length * 18 + otaLinks.length * 18 + (schema.hasSameAs ? 15 : 0));
  const visibilityFindings = [
    socialLinks.length
      ? `${socialLinks.length} supported social profile link${socialLinks.length === 1 ? "" : "s"} detected.`
      : "No supported social profile links were detected.",
    otaLinks.length
      ? `${otaLinks.length} supported OTA or reservation link${otaLinks.length === 1 ? "" : "s"} detected.`
      : "No supported OTA or reservation links were detected.",
    "Profiles that are not linked from the website may require a connected or licensed platform search."
  ];

  const feed = input.socialFeedMetrics;
  const socialVisualScore = feed
    ? feed.colourCohesion * 0.3 +
      feed.exposureBalance * 0.2 +
      feed.contrastBalance * 0.2 +
      feed.imageQuality * 0.2 +
      (100 - feed.repetitionRisk) * 0.1
    : socialLinks.length
      ? 35
      : 15;
  const socialVisualFindings = feed
    ? [
        "A feed screenshot was analysed privately in the browser. The image was not uploaded.",
        `Colour cohesion signal: ${feed.colourCohesion}/100.`,
        `Exposure balance signal: ${feed.exposureBalance}/100.`,
        `Contrast balance signal: ${feed.contrastBalance}/100.`,
        `Source image quality signal: ${feed.imageQuality}/100.`,
        `Possible visual repetition: ${feed.repetitionRisk}%.`,
        "This free rules-based check measures visual consistency but does not recognise logos, read post copy or identify content subjects."
      ]
    : [
        "No feed screenshot was supplied, so visual branding could not be measured.",
        socialLinks.length
          ? "Public social profile links were found on the website."
          : "No public social profile links were found on the website.",
        "Upload a feed screenshot to add a free visual consistency check without connecting an account."
      ];

  const brandScore =
    (hasEmail ? 25 : 0) +
    (hasPhone ? 25 : 0) +
    (hasAddress ? 20 : 0) +
    (hasOpenGraph ? 20 : 0) +
    (schema.localBusiness ? 10 : 0);
  const brandFindings = [
    hasEmail ? "An email contact signal was found." : "A public email contact signal was not found.",
    hasPhone ? "A telephone contact signal was found." : "A public telephone contact signal was not found.",
    hasAddress ? "An address or location signal was found." : "An address or location signal was not found.",
    hasOpenGraph ? "Social sharing title and image metadata are present." : "Complete social sharing metadata was not detected."
  ];

  const photographyScore = Math.min(
    100,
    Math.min(images.count, 10) * 5 + images.altCoverage * 35 + images.dimensionCoverage * 15
  );
  const photographyFindings = [
    `${images.count} image${images.count === 1 ? "" : "s"} detected on the homepage.`,
    `${Math.round(images.altCoverage * 100)}% of detected images include useful alt text.`,
    `${Math.round(images.dimensionCoverage * 100)}% include explicit width and height attributes.`,
    "Creative quality and brand suitability still require human review."
  ];

  const areas = [
    area("website", "Website health", healthScore, "verified", "Technical foundations and mobile readiness.", healthFindings),
    area("seo", "SEO and performance", seoScore, speed ? "verified" : "partial", "Search foundations and mobile performance signals.", seoFindings),
    area("booking", "Booking journey", bookingScore, "verified", "How clearly the website guides a guest towards action.", bookingFindings),
    area("google", "Public Google listing match", googleScore, googleConfidence, "Public Google and local business signals linked from the website.", googleFindings),
    area("visibility", "Social and OTA links", visibilityScore, "verified", "Public platform links that support discovery and comparison.", visibilityFindings),
    area("social_visual", "Social feed visual consistency", socialVisualScore, feed ? "verified" : "not_confirmed", "Rules-based visual signals from a privately analysed feed screenshot.", socialVisualFindings),
    area("brand", "Brand and contact consistency", brandScore, "verified", "Contact, location and sharing signals available to guests.", brandFindings),
    area("photography", "Photography presentation", photographyScore, "partial", "Image quantity, accessibility and technical presentation.", photographyFindings)
  ];

  const priorityPool = [
    !bookingLinks.length && "Add one prominent booking or enquiry action in the header and key landing sections.",
    !feed && "Upload a feed screenshot to add a free visual consistency check without connecting an account.",
    feed && feed.colourCohesion < 55 && "Use a more consistent colour treatment or recurring branded graphic system across the feed.",
    feed && feed.exposureBalance < 55 && "Balance very dark and very bright posts so the feed feels more intentional as a whole.",
    feed && feed.imageQuality < 60 && "Use higher-resolution feed imagery and export graphics at platform-ready dimensions.",
    feed && feed.repetitionRisk > 35 && "Increase the variety of recent visuals so repeated-looking posts do not weaken the feed.",
    !description && "Write a clear meta description that communicates the hospitality experience and location.",
    !schema.localBusiness && "Add appropriate hospitality business structured data with address, contact and profile links.",
    !googleLinks.length && "Link the verified Google Business Profile clearly from the website.",
    !socialLinks.length && "Connect the website to the active social profiles guests use to assess the experience.",
    !otaLinks.length && "Review and link the principal OTA or reservation listing where it supports the guest journey.",
    images.altCoverage < 0.75 && "Improve image alt text so photography is accessible and easier for search engines to understand.",
    images.count < 5 && "Use a stronger, curated photography sequence to communicate rooms, food, atmosphere and guest experience.",
    !hasOpenGraph && "Add complete social sharing metadata so links present consistently when shared.",
    speed?.performance !== undefined && speed.performance < 70 && "Prioritise mobile performance, especially image weight and loading behaviour."
  ].filter((item): item is string => Boolean(item));

  const priorities = priorityPool.slice(0, 5);
  if (!priorities.length) priorities.push("Maintain the current foundations and complete a human review of content quality and conversion.");

  const report: DigitalScanReport = {
    websiteUrl: initialUrl.toString(),
    finalUrl: finalUrl.toString(),
    businessName: input.businessName,
    location: input.location,
    scannedAt: new Date().toISOString(),
    overallScore: clamp(areas.reduce((total, item) => total + item.score, 0) / areas.length),
    pageSpeedAvailable: Boolean(speed),
    areas,
    priorities,
    discovered: { socialLinks, otaLinks, googleLinks },
    limitations: [
      "This scan reviews public signals available from the submitted website.",
      "It does not access private analytics, account dashboards or unpublished platform information.",
      "Creative quality, review sentiment and listing accuracy should be confirmed by a human specialist."
    ]
  };

  return input.locale === "pt" ? portugueseReport(report) : report;
}
