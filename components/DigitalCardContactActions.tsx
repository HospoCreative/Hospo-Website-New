"use client";

import { Check, Mail, MessageCircle, Phone, Save, Send } from "lucide-react";
import { useState } from "react";
import type { DigitalBusinessCard, DigitalCardLocale } from "@/data/digitalBusinessCards";
import { DigitalCardQrDialog } from "./DigitalCardQrDialog";

function escapeVCard(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/;/g, "\\;").replace(/,/g, "\\,");
}

function foldVCardLine(line: string) {
  const lines: string[] = [];
  let current = "";

  for (const character of line) {
    if (new TextEncoder().encode(current + character).length > 74) {
      lines.push(current);
      current = ` ${character}`;
    } else {
      current += character;
    }
  }

  lines.push(current);
  return lines.join("\r\n");
}

const copy = {
  en: {
    saveContact: "Save contact",
    shareCard: "Share card",
    linkCopied: "Link copied",
    email: "Email Hospo",
    call: "Call",
    shareText: (name: string) => `Connect with ${name} at Hospo Creative.`
  },
  pt: {
    saveContact: "Guardar contacto",
    shareCard: "Partilhar cartão",
    linkCopied: "Link copiado",
    email: "Email Hospo",
    call: "Ligar",
    shareText: (name: string) => `Contacte ${name} na Hospo Creative.`
  }
} as const;

function downloadContact(card: DigitalBusinessCard, cardUrl: string, title: string) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(card.lastName)};${escapeVCard(card.firstName)};;;`,
    `FN:${escapeVCard(card.name)}`,
    "ORG:Hospo Creative",
    `TITLE:${escapeVCard(title)}`,
    "ADR;TYPE=WORK:;;;;;;Portugal & United Kingdom",
    card.email ? `EMAIL;TYPE=INTERNET,WORK:${escapeVCard(card.email)}` : null,
    card.phone ? `TEL;TYPE=WORK,VOICE:${card.phone}` : null,
    `URL:${cardUrl}`,
    "URL;TYPE=WORK:https://hospocreative.com",
    ...card.socialLinks.map((social) => `X-SOCIALPROFILE;TYPE=${social.network}:${social.href}`),
    "END:VCARD"
  ].filter((line): line is string => Boolean(line));
  const content = `${lines.map(foldVCardLine).join("\r\n")}\r\n`;
  const href = URL.createObjectURL(new Blob([content], { type: "text/vcard;charset=utf-8" }));
  const anchor = document.createElement("a");

  anchor.href = href;
  anchor.download = `${card.slug}-hospo-creative.vcf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(href);
}

type DigitalCardContactActionsProps = {
  card: DigitalBusinessCard;
  cardUrl: string;
  locale: DigitalCardLocale;
  title: string;
};

export function DigitalCardContactActions({ card, cardUrl, locale, title }: DigitalCardContactActionsProps) {
  const telHref = card.phone ? `tel:${card.phone}` : undefined;
  const whatsappHref = card.whatsapp ? `https://wa.me/${card.whatsapp.replace(/\D/g, "")}` : undefined;
  const [copied, setCopied] = useState(false);
  const content = copy[locale];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(cardUrl);
    } catch {
      const input = document.createElement("textarea");
      input.value = cardUrl;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  async function shareCard() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.name} | Hospo Creative`,
          text: content.shareText(card.name),
          url: cardUrl
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    await copyLink();
  }

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={() => downloadContact(card, cardUrl, title)}
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#ffcc53] px-5 text-xs font-extrabold uppercase tracking-[0.15em] transition hover:-translate-y-0.5 hover:bg-[#ffd46b]"
      >
        <Save size={17} aria-hidden="true" /> {content.saveContact}
      </button>
      <div className="grid grid-cols-2 gap-3">
        <DigitalCardQrDialog cardUrl={cardUrl} name={card.firstName} locale={locale} />
        <button
          type="button"
          onClick={() => void shareCard()}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#002c5d]/20 px-3 text-[0.65rem] font-extrabold uppercase tracking-[0.13em] transition hover:border-[#002c5d]"
          aria-live="polite"
        >
          {copied ? <Check size={16} aria-hidden="true" /> : <Send size={16} aria-hidden="true" />}
          {copied ? content.linkCopied : content.shareCard}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {whatsappHref ? (
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#002c5d] px-3 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[#003a78]">
            <MessageCircle size={16} aria-hidden="true" /> WhatsApp
          </a>
        ) : null}
        {card.email ? (
          <a href={`mailto:${card.email}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#002c5d]/20 px-3 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] transition hover:border-[#002c5d]">
            <Mail size={16} aria-hidden="true" /> {locale === "pt" ? content.email : card.emailActionLabel ?? "Email"}
          </a>
        ) : null}
        {telHref ? (
          <a href={telHref} className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#002c5d]/20 px-3 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] transition hover:border-[#002c5d]">
            <Phone size={16} aria-hidden="true" /> {content.call}
          </a>
        ) : null}
      </div>
    </div>
  );
}
