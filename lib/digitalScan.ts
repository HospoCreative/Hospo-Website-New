import "server-only";

import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import type {
  DigitalScanReport,
  HospitalityBusinessType,
  ScanArea,
  ScanAreaKey,
  ScanConfidence,
  SocialFeedMetrics
} from "@/types/digitalScan";
import type { Locale } from "@/lib/i18n";
import { scanPublicSocialProfiles } from "@/lib/publicSocialScan";

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

function visiblePageText(html: string) {
  return decodeEntities(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  );
}

function joinedList(items: string[], locale: Locale) {
  if (items.length < 2) return items[0] ?? "";
  const conjunction = locale === "pt" ? " e " : " and ";
  return `${items.slice(0, -1).join(", ")}${conjunction}${items.at(-1)}`;
}

function businessTypeProfile(type: HospitalityBusinessType, locale: Locale) {
  const pt = locale === "pt";
  if (type === "restaurant_venue") {
    return {
      label: pt ? "Restaurantes, bares e cafés" : "Restaurants, bars and coffee shops",
      shortLabel: pt ? "espaço de restauração" : "food and drink venue",
      typePattern: /\b(?:restaurant|restaurante|bar|café|cafe|coffee shop|bistro|pub|dining|eatery|brasserie)\b/i,
      offerings: [
        [/\b(?:breakfast|pequeno-almoço|brunch)\b/i, pt ? "Pequeno-almoço e brunch" : "Breakfast and brunch"],
        [/\b(?:lunch|almoço|dinner|jantar|dining)\b/i, pt ? "Almoço e jantar" : "Lunch and dinner"],
        [/\b(?:cocktail|cocktails|wine|vinho|drinks|bebidas)\b/i, pt ? "Bebidas e cocktails" : "Drinks and cocktails"],
        [/\b(?:coffee|café|cafe|bakery|pastelaria)\b/i, pt ? "Café e pastelaria" : "Coffee and bakery"],
        [/\b(?:takeaway|takeout|delivery|entrega)\b/i, pt ? "Takeaway e entrega" : "Takeaway and delivery"],
        [/\b(?:private dining|events|eventos|group dining)\b/i, pt ? "Eventos e grupos" : "Events and groups"],
        [/\b(?:menu|menus|ementa)\b/i, pt ? "Menus" : "Menus"]
      ] as Array<[RegExp, string]>
    };
  }
  if (type === "fnb_product") {
    return {
      label: pt ? "Produtos de alimentação e bebidas" : "Food and beverage products",
      shortLabel: pt ? "marca de produtos de alimentação e bebidas" : "food and beverage product brand",
      typePattern: /\b(?:food brand|marca alimentar|beverage brand|drink brand|coffee brand|wine brand|food products?|beverage products?|bebidas?|alimentos?|coffee|café|tea|chá|wine|vinho|beer|cerveja|spirits?|juice|sumo|snacks?|chocolate|sauce|molho|ingredients?|stockists?|wholesale)\b/i,
      offerings: [
        [/\b(?:coffee|café|cafe|beans|grãos)\b/i, pt ? "Café" : "Coffee"],
        [/\b(?:tea|chá)\b/i, pt ? "Chá" : "Tea"],
        [/\b(?:wine|vinho|beer|cerveja|spirits?|gin|rum|whisky)\b/i, pt ? "Bebidas alcoólicas" : "Alcoholic drinks"],
        [/\b(?:soft drinks?|soda|juice|sumo|kombucha|water|água)\b/i, pt ? "Bebidas não alcoólicas" : "Non-alcoholic drinks"],
        [/\b(?:snacks?|chocolate|sauce|molho|condiments?|bakery|baked)\b/i, pt ? "Produtos alimentares" : "Food products"],
        [/\b(?:gift|gifts|bundle|packs?|cabaz|presentes)\b/i, pt ? "Presentes e conjuntos" : "Gifts and bundles"],
        [/\b(?:wholesale|trade|stockists?|retailers?|revendedores)\b/i, pt ? "Revenda e distribuição" : "Wholesale and stockists"]
      ] as Array<[RegExp, string]>
    };
  }
  return {
    label: pt ? "Hotéis e alojamento" : "Hotels and accommodation",
    shortLabel: pt ? "hotel ou alojamento" : "hotel or accommodation business",
    typePattern: /\b(?:hotel|resort|accommodation|alojamento|stay|stays|rooms?|quartos?|suites?|villa|hostel|guesthouse|pousada|apartments?)\b/i,
    offerings: [
      [/\b(?:rooms?|quartos?|suites?|villa|apartments?)\b/i, pt ? "Quartos e suites" : "Rooms and suites"],
      [/\b(?:spa|wellness|massage|bem-estar)\b/i, pt ? "Spa e bem-estar" : "Spa and wellness"],
      [/\b(?:pool|piscina|beach|praia)\b/i, pt ? "Piscina e praia" : "Pool and beach"],
      [/\b(?:restaurant|bar|dining|breakfast|pequeno-almoço)\b/i, pt ? "Restauração" : "Dining"],
      [/\b(?:meeting|meetings|conference|events?|eventos|wedding|casamento)\b/i, pt ? "Eventos e reuniões" : "Events and meetings"],
      [/\b(?:family|família|kids|children)\b/i, pt ? "Experiências para famílias" : "Family experiences"],
      [/\b(?:gym|fitness|activities|atividades|excursions?)\b/i, pt ? "Atividades e fitness" : "Activities and fitness"]
    ] as Array<[RegExp, string]>
  };
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

function extractAnchorLinks(html: string, base: URL) {
  return (html.match(/<a\b[^>]*>[\s\S]*?<\/a>/gi) ?? [])
    .map((anchor) => {
      const openingTag = anchor.match(/^<a\b[^>]*>/i)?.[0] ?? "";
      return {
        url: normaliseLink(tagAttribute(openingTag, "href"), base),
        text: decodeEntities(anchor.replace(/^<a\b[^>]*>/i, "").replace(/<\/a>$/i, "").replace(/<[^>]+>/g, " "))
      };
    })
    .filter((link) => Boolean(link.url));
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

function isSocialProfileLink(link: string) {
  try {
    const url = new URL(link);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");
    const path = url.pathname.replace(/\/+$/, "");
    const firstSegment = path.split("/").filter(Boolean)[0]?.toLowerCase() ?? "";
    if (host === "tiktok.com" || host.endsWith(".tiktok.com")) return /^\/@[^/]+$/i.test(path);
    if (host === "youtube.com" || host.endsWith(".youtube.com")) return /^\/(?:@[^/]+|channel\/[^/]+|c\/[^/]+|user\/[^/]+)$/i.test(path);
    if (host === "linkedin.com" || host.endsWith(".linkedin.com")) return /^\/(?:company|in)\/[^/]+$/i.test(path);
    if (host === "instagram.com" || host.endsWith(".instagram.com")) {
      return Boolean(firstSegment) && !["p", "reel", "reels", "stories", "explore", "accounts"].includes(firstSegment) && path.split("/").filter(Boolean).length === 1;
    }
    if (host === "facebook.com" || host.endsWith(".facebook.com") || host === "fb.com") {
      return Boolean(firstSegment) && !["share", "sharer", "plugins", "watch", "reel", "events", "groups"].includes(firstSegment);
    }
    if (host === "pinterest.com" || host.endsWith(".pinterest.com")) return Boolean(firstSegment) && !["pin", "ideas", "search"].includes(firstSegment);
    return false;
  } catch {
    return false;
  }
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

function structuredProfileLinks(html: string, base: URL) {
  const links: string[] = [];
  const visit = (value: unknown): void => {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    for (const [key, child] of Object.entries(value)) {
      if (key.toLowerCase() === "sameas") {
        const values = Array.isArray(child) ? child : [child];
        for (const item of values) {
          if (typeof item === "string") {
            const link = normaliseLink(item, base);
            if (link) links.push(link);
          }
        }
      } else {
        visit(child);
      }
    }
  };

  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      visit(JSON.parse(match[1]));
    } catch {
      // Invalid third-party structured data is ignored without failing the scan.
    }
  }
  return unique(links);
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
  findings: string[],
  strengths: string[] = [],
  improvements: string[] = []
): ScanArea {
  return {
    key,
    title,
    score: clamp(score),
    confidence,
    summary,
    findings: findings.slice(0, 3),
    strengths: strengths.slice(0, 2),
    improvements: improvements.slice(0, 2)
  };
}

function combineFeedMetrics(automatic: SocialFeedMetrics | null, screenshot?: SocialFeedMetrics | null) {
  if (!automatic) return screenshot ?? null;
  if (!screenshot) return automatic;
  const weighted = (automaticValue: number, screenshotValue: number) => clamp(automaticValue * 0.4 + screenshotValue * 0.6);
  return {
    source: "combined" as const,
    width: screenshot.width,
    height: screenshot.height,
    tileCount: automatic.tileCount + screenshot.tileCount,
    colourCohesion: weighted(automatic.colourCohesion, screenshot.colourCohesion),
    exposureBalance: weighted(automatic.exposureBalance, screenshot.exposureBalance),
    contrastBalance: weighted(automatic.contrastBalance, screenshot.contrastBalance),
    imageQuality: weighted(automatic.imageQuality, screenshot.imageQuality),
    repetitionRisk: weighted(automatic.repetitionRisk, screenshot.repetitionRisk)
  };
}

function portugueseReport(report: DigitalScanReport): DigitalScanReport {
  const exact = new Map<string, string>([
    ["Website health", "Saúde do website"],
    ["Technical foundations and mobile readiness.", "Fundamentos técnicos e preparação para dispositivos móveis."],
    ["SEO and performance", "SEO e desempenho"],
    ["Search foundations and mobile performance signals.", "Fundamentos de pesquisa e sinais de desempenho móvel."],
    ["Direct booking journey", "Percurso de reserva direta"],
    ["How easily a guest can move from interest to a direct booking or enquiry.", "Facilidade com que um hóspede passa do interesse para uma reserva direta ou contacto."],
    ["Local discovery readiness", "Preparação para descoberta local"],
    ["Signals that help search engines understand the business, location and contact details.", "Sinais que ajudam os motores de pesquisa a compreender o negócio, a localização e os contactos."],
    ["Social presence connections", "Ligações à presença nas redes sociais"],
    ["How clearly the website connects guests with the brand's active social channels.", "Clareza com que o website liga os hóspedes aos canais sociais ativos da marca."],
    ["Social feed visual consistency", "Consistência visual do feed"],
    ["Rules-based visual signals from public thumbnails and an optional private screenshot.", "Sinais visuais calculados a partir de miniaturas públicas e de uma captura privada opcional."],
    ["A feed screenshot was analysed privately in the browser. The image was not uploaded.", "Uma captura do feed foi analisada em privado no navegador. A imagem não foi enviada."],
    ["Automatic public profile and screenshot evidence were combined for this visual score.", "Foram combinados dados automáticos dos perfis públicos e da captura do feed para esta pontuação visual."],
    ["No recent public thumbnails were accessible automatically.", "Não foi possível aceder automaticamente a miniaturas públicas recentes."],
    ["Public social thumbnails are analysed temporarily and are not stored.", "As miniaturas públicas das redes sociais são analisadas temporariamente e não são guardadas."],
    ["No social profiles were linked from the website, so no automatic social scan was attempted.", "O website não apresenta ligações para redes sociais, por isso não foi possível realizar uma análise automática."],
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
    ["The website has a solid technical foundation for guest browsing.", "O website tem uma base técnica sólida para a navegação dos hóspedes."],
    ["Technical gaps may make the website harder to use or trust.", "As falhas técnicas podem tornar o website mais difícil de utilizar ou menos credível."],
    ["The core search foundations are in place, with opportunities to improve visibility and speed.", "Os principais fundamentos de pesquisa estão implementados, com oportunidades para melhorar a visibilidade e a velocidade."],
    ["Important search signals are missing or need strengthening.", "Alguns sinais importantes de pesquisa estão ausentes ou precisam de ser reforçados."],
    ["The website gives guests a route towards booking directly.", "O website oferece aos hóspedes um percurso para reservar diretamente."],
    ["The website does not yet make the next direct booking step obvious enough.", "O website ainda não torna suficientemente claro o próximo passo para uma reserva direta."],
    ["The business provides strong signals for local discovery and verification.", "O negócio apresenta sinais fortes para descoberta e verificação local."],
    ["Search engines may struggle to connect the business, location and contact details confidently.", "Os motores de pesquisa podem ter dificuldade em associar corretamente o negócio, a localização e os contactos."],
    ["The website supports guest research across several active social channels.", "O website apoia a pesquisa dos hóspedes através de vários canais sociais ativos."],
    ["The connection between the website and the wider social presence can be strengthened.", "A ligação entre o website e a presença social mais ampla pode ser reforçada."],
    ["The available feed sample has a cohesive visual foundation.", "A amostra disponível do feed apresenta uma base visual coesa."],
    ["The available feed sample shows some consistency, but the brand could feel more recognisable.", "A amostra disponível do feed mostra alguma consistência, mas a marca pode tornar-se mais reconhecível."],
    ["There is not enough visible feed evidence for a confident visual assessment.", "Não existe evidência visual suficiente do feed para uma avaliação segura."],
    ["Guests can verify and contact the business through consistent public signals.", "Os hóspedes conseguem verificar e contactar o negócio através de sinais públicos consistentes."],
    ["Missing contact, location or sharing details may weaken trust.", "A ausência de contactos, localização ou dados de partilha pode enfraquecer a confiança."],
    ["Photography is presented with a solid accessible and technical foundation.", "A fotografia é apresentada com uma base sólida de acessibilidade e desempenho técnico."],
    ["The image library needs a more curated and accessible presentation.", "A biblioteca de imagens precisa de uma apresentação mais cuidada e acessível."],
    ["Guests can browse and enquire through a secure website connection.", "Os hóspedes podem navegar e contactar através de uma ligação segura."],
    ["The site is configured to adapt to mobile screens.", "O website está configurado para se adaptar a ecrãs móveis."],
    ["The declared page language helps browsers and assistive technology present the content correctly.", "O idioma declarado ajuda os navegadores e as tecnologias de apoio a apresentar o conteúdo corretamente."],
    ["Secure the website with HTTPS before asking guests to submit details.", "Proteja o website com HTTPS antes de pedir aos hóspedes que enviem dados."],
    ["Make the layout mobile responsive so guests can browse and act comfortably on a phone.", "Adapte o layout a dispositivos móveis para que os hóspedes possam navegar e agir confortavelmente no telemóvel."],
    ["Declare the page language to improve accessibility and international search clarity.", "Declare o idioma da página para melhorar a acessibilidade e a clareza nos resultados de pesquisa internacionais."],
    ["Resolve the highest impact mobile accessibility issues on key booking pages.", "Resolva os problemas de acessibilidade móvel com maior impacto nas páginas principais de reserva."],
    ["The page gives search engines and guests a clear topic through its title and main heading.", "O título da página e o título principal comunicam claramente o tema aos hóspedes e aos motores de pesquisa."],
    ["The search description is ready to communicate the offer before a guest clicks.", "A descrição de pesquisa está preparada para comunicar a oferta antes de o hóspede clicar."],
    ["A canonical page address helps search engines avoid duplicate versions.", "Um endereço canónico ajuda os motores de pesquisa a evitar versões duplicadas."],
    ["Write a persuasive search description that includes the experience, location and reason to choose the business.", "Escreva uma descrição de pesquisa persuasiva que inclua a experiência, a localização e o motivo para escolher o negócio."],
    ["Add one clear main heading that states what the business offers and where it is located.", "Adicione um título principal claro que indique o que o negócio oferece e onde está localizado."],
    ["Add a canonical page address so search engines know which version to prioritise.", "Adicione um endereço canónico para que os motores de pesquisa saibam qual versão priorizar."],
    ["Add structured business data so search engines can understand the offer more confidently.", "Adicione dados estruturados para que os motores de pesquisa compreendam a oferta com maior confiança."],
    ["Reduce mobile loading time, especially around large images and third-party scripts.", "Reduza o tempo de carregamento móvel, especialmente nas imagens grandes e scripts externos."],
    ["Guests can move from interest to a direct booking action without being sent to an OTA.", "Os hóspedes podem passar do interesse para uma reserva direta sem serem enviados para uma OTA."],
    ["A visible enquiry route supports guests who need information before booking.", "Um percurso de contacto visível apoia os hóspedes que precisam de informação antes de reservar."],
    ["Telephone contact gives high-intent guests another direct route to the business.", "O contacto telefónico oferece aos hóspedes com maior intenção outro percurso direto para o negócio."],
    ["Add a prominent direct booking action in the header and repeat it near high-intent content.", "Adicione uma ação de reserva direta bem visível no cabeçalho e repita-a junto do conteúdo com maior intenção."],
    ["Add a clear enquiry route for group bookings, events or questions that cannot be completed online.", "Adicione um percurso de contacto claro para reservas de grupo, eventos ou questões que não possam ser tratadas online."],
    ["Search engines can recognise the site as a local business in the correct category.", "Os motores de pesquisa conseguem reconhecer o website como um negócio local na categoria correta."],
    ["A visible location signal helps guests and search engines connect the business with its destination.", "Uma localização visível ajuda os hóspedes e os motores de pesquisa a associar o negócio ao destino."],
    ["Public contact details give guests a way to verify and contact the business.", "Os contactos públicos permitem aos hóspedes verificar e contactar o negócio."],
    ["Add Hotel, Restaurant or LocalBusiness structured data with the correct name, address and contact details.", "Adicione dados estruturados Hotel, Restaurant ou LocalBusiness com o nome, morada e contactos corretos."],
    ["Show a consistent address or service location so local search engines can match the business accurately.", "Apresente uma morada ou área de serviço consistente para que os motores de pesquisa locais identifiquem corretamente o negócio."],
    ["Publish a consistent telephone number or email address on the main contact routes.", "Publique um telefone ou email consistente nos principais percursos de contacto."],
    ["Guests can move from the website to the brand's active social channels.", "Os hóspedes podem passar do website para os canais sociais ativos da marca."],
    ["The website supports brand verification across more than one social platform.", "O website permite verificar a marca em mais do que uma plataforma social."],
    ["Structured profile connections help search engines associate the social channels with the business.", "As ligações estruturadas ajudam os motores de pesquisa a associar os canais sociais ao negócio."],
    ["Link the active social channels guests use to assess the experience before booking.", "Ligue os canais sociais ativos que os hóspedes usam para avaliar a experiência antes de reservar."],
    ["Connect the other active social channels so guests can verify the brand wherever they research.", "Ligue os outros canais sociais ativos para que os hóspedes possam verificar a marca onde quer que pesquisem."],
    ["Add the official social profiles to structured business data to strengthen brand association in search.", "Adicione os perfis sociais oficiais aos dados estruturados para reforçar a associação da marca nos resultados de pesquisa."],
    ["Recent posts use a reasonably consistent colour palette.", "As publicações recentes utilizam uma paleta de cores razoavelmente consistente."],
    ["The available social imagery is clear enough to present the experience professionally.", "As imagens sociais disponíveis têm clareza suficiente para apresentar a experiência de forma profissional."],
    ["Brightness is balanced across the available posts, helping the feed feel considered.", "A luminosidade está equilibrada nas publicações disponíveis, ajudando o feed a parecer mais cuidado."],
    ["The available posts show enough visual variety to avoid feeling repetitive.", "As publicações disponíveis apresentam variedade visual suficiente para não parecerem repetitivas."],
    ["More recent posts are needed before the feed can receive a confident visual assessment.", "São necessárias mais publicações recentes para realizar uma avaliação visual segura do feed."],
    ["Use a more consistent editing style and recurring brand colours across recent posts.", "Use um estilo de edição mais consistente e cores de marca recorrentes nas publicações recentes."],
    ["Replace soft or compressed posts with higher quality photography and correctly sized graphics.", "Substitua publicações desfocadas ou comprimidas por fotografia de maior qualidade e grafismos com dimensões corretas."],
    ["Balance very dark and very bright posts so the feed feels intentional as a whole.", "Equilibre publicações muito escuras e muito claras para que o feed pareça intencional no seu conjunto."],
    ["Vary subjects and compositions so repeated-looking posts do not weaken the feed.", "Varie os temas e as composições para que publicações semelhantes não enfraqueçam o feed."],
    ["Provide a feed screenshot when public platforms block recent posts so visual branding can be assessed reliably.", "Forneça uma captura do feed quando as plataformas bloquearem publicações recentes, para que a identidade visual seja avaliada com rigor."],
    ["Guests have both email and telephone contact routes available.", "Os hóspedes têm disponíveis contactos por email e telefone."],
    ["At least one clear public contact route is available.", "Existe pelo menos um percurso de contacto público claro."],
    ["Shared links have a defined title and image, helping the brand appear consistently in messages and social posts.", "As ligações partilhadas têm um título e uma imagem definidos, ajudando a marca a aparecer de forma consistente em mensagens e publicações sociais."],
    ["The website provides a location signal that supports trust and consistency.", "O website apresenta uma localização que reforça a confiança e a consistência."],
    ["Make both email and telephone contact easy to find for guests with different preferences.", "Torne o email e o telefone fáceis de encontrar para hóspedes com diferentes preferências."],
    ["Add a consistent business address or service location to strengthen trust and local relevance.", "Adicione uma morada ou área de serviço consistente para reforçar a confiança e a relevância local."],
    ["Set a branded title and image for shared links so the business looks intentional outside the website.", "Defina um título e uma imagem de marca para as ligações partilhadas, para que o negócio pareça cuidado fora do website."],
    ["Most images are described for accessibility and image search.", "A maioria das imagens está descrita para acessibilidade e pesquisa de imagens."],
    ["Most images reserve their display space, reducing disruptive layout movement while the page loads.", "A maioria das imagens reserva o seu espaço de apresentação, reduzindo movimentos durante o carregamento."],
    ["Use a tighter edit of the strongest images so the page feels curated and loads more efficiently.", "Faça uma seleção mais rigorosa das melhores imagens para que a página pareça cuidada e carregue com maior eficiência."],
    ["Add a focused image sequence covering the space, food or rooms, atmosphere, people and distinctive details.", "Adicione uma sequência de imagens focada nos espaços, gastronomia ou quartos, ambiente, pessoas e detalhes distintivos."],
    ["Describe important images in plain language so guests using assistive technology understand what is shown.", "Descreva as imagens importantes em linguagem simples para que os hóspedes que usam tecnologias de apoio compreendam o conteúdo."],
    ["Define image dimensions and optimise delivery to reduce movement and improve mobile loading.", "Defina as dimensões das imagens e otimize o carregamento para reduzir movimentos e melhorar o desempenho móvel."],
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
    ["Guests can reach a direct booking or reservation action from the homepage.", "Os hóspedes conseguem chegar a uma ação de reserva direta a partir da página inicial."],
    ["A clearer direct booking action could reduce guest drop-off and reliance on third-party platforms.", "Uma ação de reserva direta mais clara pode reduzir o abandono e a dependência de plataformas externas."],
    ["An enquiry route is available as a useful fallback for guests who are not ready to book.", "Existe um percurso de contacto útil para hóspedes que ainda não estão prontos para reservar."],
    ["A telephone route is available for guests who prefer direct contact.", "Existe um contacto telefónico para hóspedes que preferem contacto direto."],
    ["Search engines can identify the business category and local details.", "Os motores de pesquisa conseguem identificar a categoria e os dados locais do negócio."],
    ["The website provides a clear location signal for local discovery.", "O website apresenta um sinal de localização claro para a descoberta local."],
    ["Public contact details support local trust and discovery.", "Os contactos públicos reforçam a confiança e a descoberta local."],
    ["Add structured business data so search engines can understand the category, location and contact details.", "Adicione dados estruturados para que os motores de pesquisa compreendam a categoria, a localização e os contactos."],
    ["The website links guests to its active social profiles.", "O website direciona os hóspedes para os seus perfis sociais ativos."],
    ["Add links to the active social channels guests use to assess the experience.", "Adicione ligações aos canais sociais ativos que os hóspedes usam para avaliar a experiência."],
    ["Structured profile connections help search engines associate these channels with the business.", "As ligações estruturadas aos perfis ajudam os motores de pesquisa a associar estes canais ao negócio."],
    ["A telephone contact signal is present.", "Existe um sinal de contacto telefónico."],
    ["A telephone contact signal was not found.", "Não foi encontrado um sinal de contacto telefónico."],
    ["No supported social profile links were detected.", "Não foram detetadas ligações a redes sociais suportadas."],
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
    ["Write a clear meta description that communicates the experience and location.", "Escreva uma descrição meta clara que comunique a experiência e a localização."],
    ["Connect the website to the active social profiles guests use to assess the experience.", "Ligue o website às redes sociais ativas que os hóspedes usam para avaliar a experiência."],
    ["Add one prominent direct booking action in the header and key landing sections.", "Adicione uma ação de reserva direta bem visível no cabeçalho e nas secções principais."],
    ["The available visual evidence shows a consistent foundation for the social feed.", "A evidência visual disponível mostra uma base consistente para o feed das redes sociais."],
    ["Improve image alt text so photography is accessible and easier for search engines to understand.", "Melhore o texto alternativo das imagens para tornar a fotografia acessível e mais clara para os motores de pesquisa."],
    ["Use a stronger, curated photography sequence to communicate rooms, food, atmosphere and guest experience.", "Use uma sequência fotográfica mais forte e cuidada para comunicar espaços, gastronomia, ambiente e experiência."],
    ["Add complete social sharing metadata so links present consistently when shared.", "Adicione metadados completos para que as ligações tenham uma apresentação consistente quando são partilhadas."],
    ["Prioritise mobile performance, especially image weight and loading behaviour.", "Dê prioridade ao desempenho móvel, especialmente ao peso e carregamento das imagens."],
    ["Maintain the current foundations and complete a human review of content quality and conversion.", "Mantenha os fundamentos atuais e complete uma avaliação humana da qualidade do conteúdo e conversão."],
    ["This scan reviews public signals available from the submitted website.", "Esta análise avalia sinais públicos disponíveis no website submetido."],
    ["It does not access private analytics, account dashboards or unpublished platform information.", "Não acede a análises privadas, painéis de conta ou informação não publicada das plataformas."],
    ["Automatic social coverage depends on what each platform exposes publicly and may be incomplete.", "A cobertura automática das redes sociais depende da informação que cada plataforma disponibiliza publicamente e pode estar incompleta."],
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
      .replace(/^1 social platform connected from the website\.$/, "1 plataforma social ligada a partir do website.")
      .replace(/^(\d+) social platforms? connected from the website\.$/, "$1 plataformas sociais ligadas a partir do website.")
      .replace(/^(\d+) supported OTA or reservation links? detected\.$/, "$1 ligações a OTAs ou plataformas de reservas suportadas detetadas.")
      .replace(/^(\d+) images? detected on the homepage\.$/, "$1 imagens detetadas na página inicial.")
      .replace(/^(\d+)% of detected images include useful alt text\.$/, "$1% das imagens detetadas incluem texto alternativo útil.")
      .replace(/^(\d+)% include explicit width and height attributes\.$/, "$1% incluem atributos explícitos de largura e altura.")
      .replace(/^Colour cohesion signal: (\d+)\/100\.$/, "Sinal de coesão cromática: $1/100.")
      .replace(/^Exposure balance signal: (\d+)\/100\.$/, "Sinal de equilíbrio de exposição: $1/100.")
      .replace(/^Contrast balance signal: (\d+)\/100\.$/, "Sinal de equilíbrio de contraste: $1/100.")
      .replace(/^Source image quality signal: (\d+)\/100\.$/, "Sinal de qualidade da imagem de origem: $1/100.")
      .replace(/^Possible visual repetition: (\d+)%\.$/, "Possível repetição visual: $1%.")
      .replace(/^Automatic public analysis used 1 recent thumbnail\.$/, "A análise pública automática utilizou 1 miniatura recente.")
      .replace(/^Automatic public analysis used (\d+) recent thumbnails?\.$/, "A análise pública automática utilizou $1 miniaturas recentes.")
      .replace(/^(.+): automatic visual scan completed with (\d+) public thumbnails?\.$/, "$1: análise visual automática concluída com $2 miniaturas públicas.")
      .replace(/^(.+): public profile was reachable, but recent feed imagery was incomplete\.$/, "$1: o perfil público estava acessível, mas as imagens recentes do feed estavam incompletas.")
      .replace(/^(.+): public access was blocked, so a screenshot is recommended\.$/, "$1: o acesso público foi bloqueado, por isso recomendamos uma captura do feed.");
  }

  return {
    ...report,
    areas: report.areas.map((item) => ({
      ...item,
      title: translate(item.title),
      summary: translate(item.summary),
      findings: item.findings.map(translate),
      strengths: item.strengths?.map(translate),
      improvements: item.improvements?.map(translate)
    })),
    priorities: report.priorities.map(translate),
    limitations: report.limitations.map(translate)
  };
}

export async function runDigitalScan(input: {
  websiteUrl: string;
  businessName: string;
  businessType: HospitalityBusinessType;
  location: string;
  locale?: Locale;
  socialFeedMetrics?: SocialFeedMetrics | null;
}): Promise<DigitalScanReport> {
  const suppliedUrl = /^https?:\/\//i.test(input.websiteUrl)
    ? input.websiteUrl
    : `https://${input.websiteUrl}`;
  const initialUrl = new URL(suppliedUrl);
  const { html, finalUrl } = await fetchPublicHomepage(initialUrl);
  const anchorLinks = extractAnchorLinks(html, finalUrl);
  const links = unique([...extractLinks(html, finalUrl), ...structuredProfileLinks(html, finalUrl)]);
  const lowerHtml = html.toLowerCase();
  const pageText = visiblePageText(html);
  const title = textContent(html, "title");
  const description = metaContent(html, "description");
  const h1 = textContent(html, "h1");
  const viewport = metaContent(html, "viewport");
  const canonical = linkHref(html, "canonical");
  const language = html.match(/<html\b[^>]*\blang=["']([^"']+)["']/i)?.[1] ?? "";
  const schema = structuredData(html);
  const images = imageSignals(html);
  const socialLinks = linksForDomains(links, socialDomains).filter(isSocialProfileLink);
  const otaLinks = linksForDomains(links, otaDomains);
  const googleLinks = links.filter((link) =>
    /(^|\.)google\.[a-z.]+\/maps|maps\.app\.goo\.gl|goo\.gl\/maps/i.test(link)
  );
  const linkedDirectBookingRoutes = anchorLinks
    .filter(({ url, text }) => {
      const parsed = new URL(url);
      const isEditorial = /\/(?:blog|case-studies|insights|news)(?:\/|$)/i.test(parsed.pathname);
      const urlSignal = /book(?:ing)?|reserve|reservation|availability/i.test(`${parsed.hostname}${parsed.pathname}`);
      const actionText = text.length <= 90 && /\b(?:book now|book direct|check availability|reserve now|make a reservation|book a room|book a table|reservations?)\b/i.test(text);
      const isSocial = linksForDomains([url], socialDomains).length > 0;
      const isOta = linksForDomains([url], otaDomains).length > 0;
      return !isEditorial && !isSocial && !isOta && (urlSignal || actionText);
    })
    .map(({ url }) => url);
  const hasOnsiteBookingForm =
    /<form\b[^>]*(?:id|class)=["'][^"']*(?:booking|reservation)[^"']*["']/i.test(html) ||
    /<input\b[^>]*(?:value=["'](?:book now|check availability|reserve now)["']|name=["']booknow["'])/i.test(html) ||
    /\baccorBookingArgs\b/i.test(html);
  const reservationLinks = unique([
    ...linkedDirectBookingRoutes,
    ...(hasOnsiteBookingForm ? [finalUrl.toString()] : [])
  ]);
  const menuLinks = unique(anchorLinks
    .filter(({ url, text }) => !linksForDomains([url], socialDomains).length && /\b(?:menu|menus|food menu|drinks menu|ementa)\b/i.test(`${new URL(url).pathname} ${text}`))
    .map(({ url }) => url));
  const orderLinks = unique(anchorLinks
    .filter(({ url, text }) => !linksForDomains([url], socialDomains).length && /\b(?:order online|order now|shop now|buy now|buy|shop|store|cart|takeaway|takeout|delivery|encomendar|comprar|loja)\b/i.test(`${new URL(url).pathname} ${text}`))
    .map(({ url }) => url));
  const stockistLinks = unique(anchorLinks
    .filter(({ url, text }) => !linksForDomains([url], socialDomains).length && /\b(?:stockists?|where to buy|retailers?|wholesale|trade|revendedores|onde comprar)\b/i.test(`${new URL(url).pathname} ${text}`))
    .map(({ url }) => url));
  const productLinks = unique(anchorLinks
    .filter(({ url, text }) => !linksForDomains([url], socialDomains).length && /\b(?:products?|collections?|flavours?|shop|produtos?|coleções?)\b/i.test(`${new URL(url).pathname} ${text}`))
    .map(({ url }) => url));
  const directBookingLinks = input.businessType === "hotel_accommodation"
    ? reservationLinks
    : input.businessType === "restaurant_venue"
      ? unique([...reservationLinks, ...orderLinks])
      : unique([...orderLinks, ...stockistLinks, ...productLinks]);
  const enquiryLinks = unique(anchorLinks
    .filter(({ url, text }) => /enquir|inquir|contact|get in touch|request/i.test(`${url} ${text}`))
    .map(({ url }) => url));
  const hasEmail = /mailto:/i.test(html) || /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(html);
  const hasPhone = /tel:/i.test(html) || schema.hasTelephone;
  const hasAddress = schema.hasAddress || /\baddress\b/i.test(lowerHtml);
  const hasOpenGraph = Boolean(metaContent(html, "og:title") && metaContent(html, "og:image"));
  const [speed, publicSocial] = await Promise.all([
    pageSpeed(finalUrl.toString()),
    scanPublicSocialProfiles(socialLinks)
  ]);
  const socialPlatforms = unique(publicSocial.profiles.map((profile) => profile.platform));
  const businessProfile = businessTypeProfile(input.businessType, input.locale ?? "en");
  const typeEvidenceText = `${title} ${description} ${h1} ${pageText.slice(0, 30_000)}`;
  const businessTypeClear = businessProfile.typePattern.test(typeEvidenceText);
  const detectedOfferings = businessProfile.offerings
    .filter(([pattern]) => pattern.test(typeEvidenceText))
    .map(([, label]) => label)
    .slice(0, 6);
  const locationTokens = input.location.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((token) => token.length >= 3);
  const locationClear = hasAddress || Boolean(locationTokens.length && locationTokens.some((token) => lowerHtml.includes(token)));

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

  const pt = input.locale === "pt";
  const fallbackContact = Boolean(enquiryLinks.length || hasPhone || hasEmail);
  let journeyTitle = "Direct booking journey";
  let journeyScore = Math.min(100, (reservationLinks.length ? 70 : 0) + (enquiryLinks.length ? 15 : 0) + (hasPhone ? 15 : 0));
  let journeySummary = reservationLinks.length
    ? "The website gives guests a route towards booking directly."
    : "The website does not yet make the next direct booking step obvious enough.";
  let journeyFindings = [
    reservationLinks.length
      ? "Guests can reach a direct booking or reservation action from the homepage."
      : "A clearer direct booking action could reduce guest drop-off and reliance on third-party platforms.",
    enquiryLinks.length ? "An enquiry route is available as a useful fallback for guests who are not ready to book." : null,
    hasPhone ? "A telephone route is available for guests who prefer direct contact." : null
  ].filter((item): item is string => Boolean(item));
  let journeyStrengths = [
    reservationLinks.length ? "Guests can move from interest to a direct booking action without being sent to an OTA." : null,
    enquiryLinks.length ? "A visible enquiry route supports guests who need information before booking." : null,
    hasPhone ? "Telephone contact gives high-intent guests another direct route to the business." : null
  ].filter((item): item is string => Boolean(item));
  let journeyImprovements = [
    !reservationLinks.length ? "Add a prominent direct booking action in the header and repeat it near high-intent content." : null,
    !enquiryLinks.length && !hasPhone ? "Add a clear enquiry route for group bookings, events or questions that cannot be completed online." : null
  ].filter((item): item is string => Boolean(item));

  if (input.businessType === "restaurant_venue") {
    journeyTitle = pt ? "Percurso de reservas e pedidos" : "Reservation and ordering journey";
    journeyScore = Math.min(100,
      (reservationLinks.length ? 50 : 0) +
      (menuLinks.length ? 25 : 0) +
      (orderLinks.length ? 15 : 0) +
      (fallbackContact ? 10 : 0)
    );
    journeySummary = pt
      ? journeyScore >= 70
        ? "O website ajuda os clientes a consultar a oferta e a avançar para uma reserva ou pedido."
        : "O percurso entre descobrir a oferta e reservar ou pedir precisa de ser mais claro."
      : journeyScore >= 70
        ? "The website helps customers explore the offer and move towards a reservation or order."
        : "The route from discovering the offer to reserving or ordering needs to be clearer.";
    journeyFindings = [
      reservationLinks.length
        ? (pt ? "Existe um percurso visível para reservar mesa ou fazer uma reserva." : "A visible table reservation or booking route is available.")
        : (pt ? "Não foi encontrado um percurso claro para reservar mesa." : "A clear table reservation route was not found."),
      menuLinks.length
        ? (pt ? "Os clientes conseguem consultar a ementa a partir do website." : "Customers can access the menu from the website.")
        : (pt ? "Não foi encontrada uma ligação clara para a ementa." : "A clear menu link was not found."),
      orderLinks.length
        ? (pt ? "Existe um percurso para pedidos online ou takeaway." : "An online ordering or takeaway route is available.")
        : null
    ].filter((item): item is string => Boolean(item));
    journeyStrengths = [
      reservationLinks.length ? (pt ? "Os clientes podem reservar diretamente sem depender de uma plataforma externa de descoberta." : "Customers can reserve directly without relying on a third-party discovery platform.") : null,
      menuLinks.length ? (pt ? "A ementa ajuda os clientes a compreender a oferta antes de visitar." : "The menu helps customers understand the offer before visiting.") : null,
      orderLinks.length ? (pt ? "Os pedidos online criam um percurso comercial adicional." : "Online ordering provides an additional commercial route.") : null
    ].filter((item): item is string => Boolean(item));
    journeyImprovements = [
      !reservationLinks.length ? (pt ? "Adicione uma ação clara para reservar mesa no cabeçalho e junto da ementa." : "Add a clear reserve a table action in the header and near the menu.") : null,
      !menuLinks.length ? (pt ? "Disponibilize uma ementa atualizada e fácil de consultar no website." : "Provide an up-to-date menu that is easy to access on the website.") : null,
      !orderLinks.length ? (pt ? "Se disponibiliza takeaway ou entrega, torne o percurso de pedido mais visível." : "If takeaway or delivery is available, make the ordering route more visible.") : null
    ].filter((item): item is string => Boolean(item));
  } else if (input.businessType === "fnb_product") {
    journeyTitle = pt ? "Percurso de compra" : "Purchase journey";
    journeyScore = Math.min(100,
      (orderLinks.length ? 55 : 0) +
      (productLinks.length ? 20 : 0) +
      (stockistLinks.length ? 15 : 0) +
      (fallbackContact ? 10 : 0)
    );
    journeySummary = pt
      ? journeyScore >= 70
        ? "O website apresenta os produtos e oferece um percurso claro para comprar ou encontrar um ponto de venda."
        : "O percurso entre descobrir os produtos e comprá-los precisa de ser mais claro."
      : journeyScore >= 70
        ? "The website presents the products and provides a clear route to buy or find a stockist."
        : "The route from discovering the products to buying them needs to be clearer.";
    journeyFindings = [
      orderLinks.length
        ? (pt ? "Existe um percurso visível para comprar ou encomendar produtos." : "A visible route to buy or order products is available.")
        : (pt ? "Não foi encontrado um percurso claro para comprar os produtos." : "A clear route to buy the products was not found."),
      productLinks.length
        ? (pt ? "O website apresenta páginas dedicadas à gama de produtos." : "The website provides dedicated product range pages.")
        : (pt ? "Não foi encontrada uma gama de produtos claramente estruturada." : "A clearly structured product range was not found."),
      stockistLinks.length
        ? (pt ? "Os clientes conseguem procurar revendedores ou pontos de venda." : "Customers can look for stockists or retail locations.")
        : null
    ].filter((item): item is string => Boolean(item));
    journeyStrengths = [
      orderLinks.length ? (pt ? "Os clientes conseguem avançar diretamente para uma compra." : "Customers can move directly towards a purchase.") : null,
      productLinks.length ? (pt ? "A gama de produtos tem espaço próprio para apoiar a comparação e a escolha." : "The product range has dedicated space to support comparison and choice.") : null,
      stockistLinks.length ? (pt ? "A informação sobre pontos de venda apoia clientes que preferem comprar presencialmente." : "Stockist information supports customers who prefer to buy in person.") : null
    ].filter((item): item is string => Boolean(item));
    journeyImprovements = [
      !orderLinks.length ? (pt ? "Adicione uma ação clara para comprar ou encomendar em páginas de elevada intenção." : "Add a clear buy or order action on high-intent pages.") : null,
      !productLinks.length ? (pt ? "Organize a gama em páginas de produto claras com benefícios, formatos e utilizações." : "Organise the range into clear product pages with benefits, formats and uses.") : null,
      !stockistLinks.length ? (pt ? "Se vende através de lojas, adicione uma página de pontos de venda ou revendedores." : "If products are sold through retailers, add a stockist or where to buy page.") : null
    ].filter((item): item is string => Boolean(item));
  }

  let discoveryTitle = "Local discovery readiness";
  let discoveryScore = Math.min(100,
    (schema.localBusiness ? 45 : 0) +
    (hasAddress ? 30 : 0) +
    (hasPhone || hasEmail ? 25 : 0)
  );
  let discoveryConfidence: ScanConfidence = [schema.localBusiness, hasAddress, hasPhone || hasEmail].filter(Boolean).length >= 3
    ? "verified"
    : [schema.localBusiness, hasAddress, hasPhone || hasEmail].some(Boolean)
      ? "partial"
      : "not_confirmed";
  let discoverySummary = discoveryScore >= 70
    ? "The business provides strong signals for local discovery and verification."
    : "Search engines may struggle to connect the business, location and contact details confidently.";
  let discoveryFindings = [
    schema.localBusiness
      ? "Search engines can identify the business category and local details."
      : "Add structured business data so search engines can understand the category, location and contact details.",
    hasAddress ? "The website provides a clear location signal for local discovery." : null,
    hasPhone || hasEmail ? "Public contact details support local trust and discovery." : null
  ].filter((item): item is string => Boolean(item));
  let discoveryStrengths = [
    schema.localBusiness ? "Search engines can recognise the site as a local business in the correct category." : null,
    hasAddress ? "A visible location signal helps customers and search engines connect the business with its destination." : null,
    hasPhone || hasEmail ? "Public contact details give customers a way to verify and contact the business." : null
  ].filter((item): item is string => Boolean(item));
  let discoveryImprovements = [
    !schema.localBusiness
      ? input.businessType === "restaurant_venue"
        ? "Add Restaurant structured data with the correct name, address and contact details."
        : "Add Hotel or LodgingBusiness structured data with the correct name, address and contact details."
      : null,
    !hasAddress ? "Show a consistent address or service location so local search engines can match the business accurately." : null,
    !hasPhone && !hasEmail ? "Publish a consistent telephone number or email address on the main contact routes." : null
  ].filter((item): item is string => Boolean(item));

  if (input.businessType === "fnb_product") {
    discoveryTitle = pt ? "Descoberta em pesquisa e pontos de venda" : "Search and retail discovery";
    discoveryScore = Math.min(100,
      (schema.found ? 30 : 0) +
      (stockistLinks.length ? 30 : 0) +
      (locationClear ? 20 : 0) +
      (hasPhone || hasEmail ? 20 : 0)
    );
    discoveryConfidence = schema.found || stockistLinks.length || locationClear ? "partial" : "not_confirmed";
    discoverySummary = pt
      ? discoveryScore >= 70
        ? "A marca oferece sinais claros para pesquisa, disponibilidade e verificação."
        : "A disponibilidade dos produtos, mercados servidos e dados da marca precisam de maior clareza."
      : discoveryScore >= 70
        ? "The brand provides clear signals for search, availability and verification."
        : "Product availability, markets served and brand data need greater clarity.";
    discoveryFindings = [
      schema.found
        ? (pt ? "Foram encontrados dados estruturados que ajudam os motores de pesquisa a interpretar a marca." : "Structured data helps search engines interpret the brand.")
        : (pt ? "Não foram encontrados dados estruturados claros para a organização ou produtos." : "Clear organisation or product structured data was not found."),
      stockistLinks.length
        ? (pt ? "Existe um percurso para encontrar pontos de venda ou revendedores." : "A route to stockists or retailers is available.")
        : (pt ? "Não foi encontrado um percurso para pontos de venda ou revendedores." : "A stockist or retailer route was not found."),
      locationClear
        ? (pt ? "O mercado, localização ou área servida é identificável." : "The market, location or service area is identifiable.")
        : null
    ].filter((item): item is string => Boolean(item));
    discoveryStrengths = [
      schema.found ? (pt ? "Os dados estruturados apoiam a compreensão da marca em pesquisa." : "Structured data supports brand understanding in search.") : null,
      stockistLinks.length ? (pt ? "Os clientes conseguem descobrir onde comprar os produtos." : "Customers can discover where to buy the products.") : null,
      hasPhone || hasEmail ? (pt ? "Os dados de contacto ajudam clientes e parceiros comerciais a verificar a marca." : "Contact details help customers and trade partners verify the brand.") : null
    ].filter((item): item is string => Boolean(item));
    discoveryImprovements = [
      !schema.found ? (pt ? "Adicione dados estruturados Organization e Product para a marca e os produtos principais." : "Add Organization and Product structured data for the brand and key products.") : null,
      !stockistLinks.length ? (pt ? "Se vende através de terceiros, adicione uma página clara de pontos de venda ou revendedores." : "If products are sold through third parties, add a clear stockist or where to buy page.") : null,
      !locationClear ? (pt ? "Explique os mercados, áreas de entrega ou regiões onde os produtos estão disponíveis." : "Explain the markets, delivery areas or regions where products are available.") : null
    ].filter((item): item is string => Boolean(item));
  }

  const visibilityScore = socialPlatforms.length
    ? Math.min(100, 35 + socialPlatforms.length * 18 + (schema.hasSameAs ? 10 : 0))
    : 0;
  const visibilityFindings = [
    socialLinks.length
      ? "The website links guests to its active social profiles."
      : "Add links to the active social channels guests use to assess the experience.",
    schema.hasSameAs ? "Structured profile connections help search engines associate these channels with the business." : null,
    socialPlatforms.length ? `${socialPlatforms.length} social platform${socialPlatforms.length === 1 ? "" : "s"} connected from the website.` : null
  ].filter((item): item is string => Boolean(item));

  const feed = combineFeedMetrics(publicSocial.metrics, input.socialFeedMetrics);
  const socialVisualScore = feed
    ? feed.colourCohesion * 0.3 +
      feed.exposureBalance * 0.2 +
      feed.contrastBalance * 0.2 +
      feed.imageQuality * 0.2 +
      (100 - feed.repetitionRisk) * 0.1
    : socialLinks.length
      ? 35
      : 15;
  const evidenceFindings = [
    publicSocial.thumbnailCount
      ? `Automatic public analysis used ${publicSocial.thumbnailCount} recent thumbnail${publicSocial.thumbnailCount === 1 ? "" : "s"}.`
      : socialLinks.length
        ? "No recent public thumbnails were accessible automatically."
        : "No social profiles were linked from the website, so no automatic social scan was attempted.",
    publicSocial.thumbnailCount ? "Public social thumbnails are analysed temporarily and are not stored." : null,
    input.socialFeedMetrics
      ? "A feed screenshot was analysed privately in the browser. The image was not uploaded."
      : null,
    publicSocial.metrics && input.socialFeedMetrics
      ? "Automatic public profile and screenshot evidence were combined for this visual score."
      : null
  ].filter((item): item is string => Boolean(item));
  const socialVisualFindings = feed
    ? [
        ...evidenceFindings,
        `Colour cohesion signal: ${feed.colourCohesion}/100.`,
        feed.colourCohesion < 55
          ? "Use a more consistent colour treatment or recurring branded graphic system across the feed."
          : feed.imageQuality < 60
            ? "Use higher-resolution feed imagery and export graphics at platform-ready dimensions."
            : feed.repetitionRisk > 35
              ? "Increase the variety of recent visuals so repeated-looking posts do not weaken the feed."
              : "The available visual evidence shows a consistent foundation for the social feed."
      ]
    : [
        ...evidenceFindings,
        "No feed screenshot was supplied, so visual branding could not be measured.",
        "Upload a feed screenshot to add a free visual consistency check without connecting an account."
      ];

  const offerClarityScore =
    (businessTypeClear ? 25 : 0) +
    Math.min(30, detectedOfferings.length * 10) +
    (locationClear ? 20 : 0) +
    (hasPhone || hasEmail ? 15 : 0) +
    (hasOpenGraph ? 10 : 0);
  const offerFindings = [
    businessTypeClear
      ? (pt ? `O website comunica claramente que se trata de ${businessProfile.shortLabel}.` : `The website clearly communicates that this is a ${businessProfile.shortLabel}.`)
      : (pt ? `O website não comunica de forma suficientemente clara que se trata de ${businessProfile.shortLabel}.` : `The website does not communicate clearly enough that this is a ${businessProfile.shortLabel}.`),
    detectedOfferings.length
      ? (pt ? `A oferta visível inclui ${joinedList(detectedOfferings, "pt")}.` : `The visible offer includes ${joinedList(detectedOfferings, "en")}.`)
      : (pt ? "Os principais produtos ou serviços não estão suficientemente destacados na página inicial." : "The main products or services are not surfaced clearly enough on the homepage."),
    locationClear
      ? (pt ? "A localização ou área servida está visível para os clientes." : "The location or service area is visible to customers.")
      : (pt ? "A localização ou área servida não está suficientemente clara." : "The location or service area is not clear enough.")
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

  const healthStrengths = [
    finalUrl.protocol === "https:" ? "Guests can browse and enquire through a secure website connection." : null,
    viewport ? "The site is configured to adapt to mobile screens." : null,
    language ? "The declared page language helps browsers and assistive technology present the content correctly." : null
  ].filter((item): item is string => Boolean(item));
  const healthImprovements = [
    finalUrl.protocol !== "https:" ? "Secure the website with HTTPS before asking guests to submit details." : null,
    !viewport ? "Make the layout mobile responsive so guests can browse and act comfortably on a phone." : null,
    !language ? "Declare the page language to improve accessibility and international search clarity." : null,
    speed?.accessibility !== undefined && speed.accessibility < 75 ? "Resolve the highest impact mobile accessibility issues on key booking pages." : null
  ].filter((item): item is string => Boolean(item));

  const seoStrengths = [
    title && h1 ? "The page gives search engines and guests a clear topic through its title and main heading." : null,
    description ? "The search description is ready to communicate the offer before a guest clicks." : null,
    canonical ? "A canonical page address helps search engines avoid duplicate versions." : null
  ].filter((item): item is string => Boolean(item));
  const seoImprovements = [
    !description ? "Write a persuasive search description that includes the experience, location and reason to choose the business." : null,
    !h1 ? "Add one clear main heading that states what the business offers and where it is located." : null,
    !canonical ? "Add a canonical page address so search engines know which version to prioritise." : null,
    !schema.found ? "Add structured business data so search engines can understand the offer more confidently." : null,
    speed?.performance !== undefined && speed.performance < 70 ? "Reduce mobile loading time, especially around large images and third-party scripts." : null
  ].filter((item): item is string => Boolean(item));

  const visibilityStrengths = [
    socialPlatforms.length ? "Guests can move from the website to the brand's active social channels." : null,
    socialPlatforms.length >= 2 ? "The website supports brand verification across more than one social platform." : null,
    schema.hasSameAs ? "Structured profile connections help search engines associate the social channels with the business." : null
  ].filter((item): item is string => Boolean(item));
  const visibilityImprovements = [
    !socialPlatforms.length ? "Link the active social channels guests use to assess the experience before booking." : null,
    socialPlatforms.length === 1 ? "Connect the other active social channels so guests can verify the brand wherever they research." : null,
    !schema.hasSameAs ? "Add the official social profiles to structured business data to strengthen brand association in search." : null
  ].filter((item): item is string => Boolean(item));

  const visualStrengths = feed ? [
    feed.colourCohesion >= 65 ? "Recent posts use a reasonably consistent colour palette." : null,
    feed.imageQuality >= 65 ? "The available social imagery is clear enough to present the experience professionally." : null,
    feed.exposureBalance >= 65 ? "Brightness is balanced across the available posts, helping the feed feel considered." : null,
    feed.repetitionRisk <= 30 ? "The available posts show enough visual variety to avoid feeling repetitive." : null
  ].filter((item): item is string => Boolean(item)) : [];
  const visualImprovements = feed ? [
    feed.tileCount < 6 ? "More recent posts are needed before the feed can receive a confident visual assessment." : null,
    feed.colourCohesion < 65 ? "Use a more consistent editing style and recurring brand colours across recent posts." : null,
    feed.imageQuality < 65 ? "Replace soft or compressed posts with higher quality photography and correctly sized graphics." : null,
    feed.exposureBalance < 65 ? "Balance very dark and very bright posts so the feed feels intentional as a whole." : null,
    feed.repetitionRisk > 30 ? "Vary subjects and compositions so repeated-looking posts do not weaken the feed." : null
  ].filter((item): item is string => Boolean(item)) : [
    "Provide a feed screenshot when public platforms block recent posts so visual branding can be assessed reliably."
  ];

  const offerStrengths = [
    businessTypeClear ? (pt ? "Os visitantes conseguem perceber rapidamente o tipo de negócio." : "Visitors can quickly understand the type of business.") : null,
    detectedOfferings.length >= 2 ? (pt ? "A página inicial apresenta várias partes importantes da oferta." : "The homepage presents several important parts of the offer.") : null,
    locationClear ? (pt ? "A localização ajuda os clientes a decidir se o negócio é relevante para a sua visita ou compra." : "The location helps customers decide whether the business is relevant to their visit or purchase.") : null,
    hasPhone || hasEmail ? (pt ? "Existe pelo menos uma forma clara de contacto público." : "At least one clear public contact route is available.") : null
  ].filter((item): item is string => Boolean(item));
  const offerImprovements = [
    !businessTypeClear ? (pt ? `Declare logo no início que o negócio é ${businessProfile.shortLabel}.` : `State near the top of the page that the business is a ${businessProfile.shortLabel}.`) : null,
    !detectedOfferings.length ? (pt ? "Mostre os principais produtos ou serviços com nomes, imagens e benefícios claros." : "Show the main products or services with clear names, imagery and benefits.") : null,
    detectedOfferings.length === 1 ? (pt ? "Dê maior hierarquia às diferentes partes da oferta para facilitar a comparação." : "Give the different parts of the offer stronger hierarchy so customers can compare them.") : null,
    !locationClear ? (pt ? "Torne a localização, a área servida ou os pontos de venda mais visíveis." : "Make the location, service area or retail availability more visible.") : null,
    !hasOpenGraph ? (pt ? "Defina um título e uma imagem de marca para as ligações partilhadas." : "Set a branded title and image for shared links.") : null
  ].filter((item): item is string => Boolean(item));

  const photographyCoverageStrength = input.businessType === "hotel_accommodation"
    ? (pt ? "A página inicial tem fotografia suficiente para apresentar os quartos, instalações e experiência." : "The homepage has enough photography to present the rooms, facilities and experience.")
    : input.businessType === "restaurant_venue"
      ? (pt ? "A página inicial tem fotografia suficiente para apresentar a comida, as bebidas e o ambiente." : "The homepage has enough photography to present the food, drinks and atmosphere.")
      : (pt ? "A página inicial tem fotografia suficiente para apresentar os produtos e a marca." : "The homepage has enough photography to present the products and brand.");
  const photographyStrengths = [
    images.count >= 5 && images.count <= 30 ? photographyCoverageStrength : null,
    images.altCoverage >= 0.75 ? "Most images are described for accessibility and image search." : null,
    images.dimensionCoverage >= 0.7 ? "Most images reserve their display space, reducing disruptive layout movement while the page loads." : null
  ].filter((item): item is string => Boolean(item));
  const imageSequenceImprovement = input.businessType === "hotel_accommodation"
    ? pt
      ? "Adicione uma sequência de imagens focada nos quartos, instalações, ambiente, pessoas e detalhes distintivos."
      : "Add a focused image sequence covering rooms, facilities, atmosphere, people and distinctive details."
    : input.businessType === "restaurant_venue"
      ? pt
        ? "Adicione uma sequência de imagens focada nos pratos principais, bebidas, espaço, ambiente, pessoas e serviço."
        : "Add a focused image sequence covering signature dishes, drinks, the venue, atmosphere, people and service."
      : pt
        ? "Adicione uma sequência de imagens focada na gama, embalagem, ingredientes, ocasiões de consumo e detalhes distintivos."
        : "Add a focused image sequence covering the product range, packaging, ingredients, use occasions and distinctive details.";
  const photographyImprovements = [
    images.count > 30 ? "Use a tighter edit of the strongest images so the page feels curated and loads more efficiently." : null,
    images.count < 5 ? imageSequenceImprovement : null,
    images.altCoverage < 0.75 ? "Describe important images in plain language so guests using assistive technology understand what is shown." : null,
    images.dimensionCoverage < 0.7 ? "Define image dimensions and optimise delivery to reduce movement and improve mobile loading." : null
  ].filter((item): item is string => Boolean(item));

  const overviewHeadline = businessTypeClear
    ? pt
      ? `Uma oferta de ${businessProfile.shortLabel}${locationClear && input.location ? ` em ${input.location}` : ""}.`
      : `A recognisable ${businessProfile.shortLabel}${locationClear && input.location ? ` in ${input.location}` : ""}.`
    : pt
      ? "A primeira impressão ainda não explica claramente o tipo de negócio."
      : "The first impression does not yet explain the type of business clearly.";
  const overviewSummary = pt
    ? `${input.businessName} ${businessTypeClear ? `apresenta-se como ${businessProfile.shortLabel}` : `foi analisado na categoria ${businessProfile.label.toLowerCase()}, mas essa categoria não fica imediatamente clara no website`}. ${detectedOfferings.length ? `A página inicial destaca ${joinedList(detectedOfferings, "pt")}.` : "Os principais produtos ou serviços não estão suficientemente visíveis na página inicial."} ${locationClear ? "A localização ou área servida é identificável." : "A localização ou área servida precisa de maior destaque."}`
    : `${input.businessName} ${businessTypeClear ? `presents itself as a ${businessProfile.shortLabel}` : `was assessed as ${businessProfile.label.toLowerCase()}, but that category is not immediately clear on the website`}. ${detectedOfferings.length ? `The homepage highlights ${joinedList(detectedOfferings, "en")}.` : "The main products or services are not prominent enough on the homepage."} ${locationClear ? "The location or service area is identifiable." : "The location or service area needs greater prominence."}`;
  const journeyEvidence = input.businessType === "hotel_accommodation"
    ? reservationLinks.length > 0
    : input.businessType === "restaurant_venue"
      ? reservationLinks.length > 0 || menuLinks.length > 0 || orderLinks.length > 0
      : orderLinks.length > 0 || productLinks.length > 0 || stockistLinks.length > 0;

  const areas = [
    area("website", "Website health", healthScore, "verified", healthScore >= 75 ? "The website has a solid technical foundation for guest browsing." : "Technical gaps may make the website harder to use or trust.", healthFindings, healthStrengths, healthImprovements),
    area("seo", "SEO and performance", seoScore, speed ? "verified" : "partial", seoScore >= 70 ? "The core search foundations are in place, with opportunities to improve visibility and speed." : "Important search signals are missing or need strengthening.", seoFindings, seoStrengths, seoImprovements),
    area("booking", journeyTitle, journeyScore, journeyEvidence ? "verified" : "partial", journeySummary, journeyFindings, journeyStrengths, journeyImprovements),
    area("google", discoveryTitle, discoveryScore, discoveryConfidence, discoverySummary, discoveryFindings, discoveryStrengths, discoveryImprovements),
    area("visibility", "Social presence connections", visibilityScore, socialPlatforms.length ? "verified" : "not_confirmed", socialPlatforms.length >= 2 ? "The website supports guest research across several active social channels." : "The connection between the website and the wider social presence can be strengthened.", visibilityFindings, visibilityStrengths, visibilityImprovements),
    area(
      "social_visual",
      "Social feed visual consistency",
      socialVisualScore,
      input.socialFeedMetrics || publicSocial.profiles.some((profile) => profile.status === "scanned")
        ? "verified"
        : feed
          ? "partial"
          : "not_confirmed",
      feed
        ? socialVisualScore >= 70
          ? "The available feed sample has a cohesive visual foundation."
          : "The available feed sample shows some consistency, but the brand could feel more recognisable."
        : "There is not enough visible feed evidence for a confident visual assessment.",
      socialVisualFindings,
      visualStrengths,
      visualImprovements
    ),
    area(
      "brand",
      pt ? "Clareza da oferta e da marca" : "Offer and brand clarity",
      offerClarityScore,
      businessTypeClear && detectedOfferings.length ? "verified" : "partial",
      pt
        ? offerClarityScore >= 70
          ? "Os visitantes conseguem compreender o tipo de negócio, a oferta e a localização."
          : "A proposta, os produtos ou serviços e a localização precisam de maior clareza."
        : offerClarityScore >= 70
          ? "Visitors can understand the business type, offer and location."
          : "The proposition, products or services and location need greater clarity.",
      offerFindings,
      offerStrengths,
      offerImprovements
    ),
    area("photography", "Photography presentation", photographyScore, "partial", images.altCoverage >= 0.75 && images.count <= 30 ? "Photography is presented with a solid accessible and technical foundation." : "The image library needs a more curated and accessible presentation.", photographyFindings, photographyStrengths, photographyImprovements)
  ];

  const priorityPool = [
    journeyImprovements[0],
    !businessTypeClear && (pt ? `Declare claramente que o negócio é ${businessProfile.shortLabel}.` : `State clearly that the business is a ${businessProfile.shortLabel}.`),
    !detectedOfferings.length && (pt ? "Apresente os principais produtos ou serviços com imagens, nomes e benefícios claros." : "Present the main products or services with clear imagery, names and benefits."),
    !locationClear && (pt ? "Torne a localização, área servida ou pontos de venda visíveis nas páginas principais." : "Make the location, service area or retail availability visible on key pages."),
    discoveryImprovements[0],
    feed && feed.colourCohesion < 55 && "Use a more consistent colour treatment or recurring branded graphic system across the feed.",
    feed && feed.exposureBalance < 55 && "Balance very dark and very bright posts so the feed feels more intentional as a whole.",
    feed && feed.imageQuality < 60 && "Use higher-resolution feed imagery and export graphics at platform-ready dimensions.",
    feed && feed.repetitionRisk > 35 && "Increase the variety of recent visuals so repeated-looking posts do not weaken the feed.",
    !description && "Write a clear meta description that communicates the experience and location.",
    !socialLinks.length && "Connect the website to the active social profiles guests use to assess the experience.",
    images.altCoverage < 0.75 && "Improve image alt text so photography is accessible and easier for search engines to understand.",
    images.count < 5 && imageSequenceImprovement,
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
    businessType: input.businessType,
    overview: {
      typeLabel: businessProfile.label,
      headline: overviewHeadline,
      summary: overviewSummary,
      offerings: detectedOfferings
    },
    scannedAt: new Date().toISOString(),
    overallScore: clamp(areas.reduce((total, item) => total + item.score, 0) / areas.length),
    pageSpeedAvailable: Boolean(speed),
    areas,
    priorities,
    discovered: {
      socialLinks,
      otaLinks,
      googleLinks,
      directBookingLinks,
      enquiryLinks,
      socialProfiles: publicSocial.profiles
    },
    limitations: [
      "This scan reviews public signals available from the submitted website.",
      "It does not access private analytics, account dashboards or unpublished platform information.",
      "Automatic social coverage depends on what each platform exposes publicly and may be incomplete.",
      "Creative quality, review sentiment and listing accuracy should be confirmed by a human specialist."
    ]
  };

  return input.locale === "pt" ? portugueseReport(report) : report;
}
