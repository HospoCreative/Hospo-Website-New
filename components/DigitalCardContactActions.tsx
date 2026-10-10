"use client";

import { Mail, MessageCircle, Phone, Save } from "lucide-react";
import type { DigitalBusinessCard } from "@/data/digitalBusinessCards";
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

function downloadContact(card: DigitalBusinessCard, cardUrl: string) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCard(card.lastName)};${escapeVCard(card.firstName)};;;`,
    `FN:${escapeVCard(card.name)}`,
    "ORG:Hospo Creative",
    `TITLE:${escapeVCard(card.title)}`,
    "ADR;TYPE=WORK:;;;Algarve;;;Portugal",
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
};

export function DigitalCardContactActions({ card, cardUrl }: DigitalCardContactActionsProps) {
  const telHref = card.phone ? `tel:${card.phone}` : undefined;
  const whatsappHref = card.whatsapp ? `https://wa.me/${card.whatsapp.replace(/\D/g, "")}` : undefined;

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={() => downloadContact(card, cardUrl)}
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#ffcc53] px-5 text-xs font-extrabold uppercase tracking-[0.15em] transition hover:-translate-y-0.5 hover:bg-[#ffd46b]"
      >
        <Save size={17} aria-hidden="true" /> Save contact
      </button>
      <div className="grid grid-cols-2 gap-3">
        {whatsappHref ? (
          <a href={whatsappHref} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#002c5d] px-3 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[#003a78]">
            <MessageCircle size={16} aria-hidden="true" /> WhatsApp
          </a>
        ) : null}
        {card.email ? (
          <a href={`mailto:${card.email}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#002c5d]/20 px-3 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] transition hover:border-[#002c5d]">
            <Mail size={16} aria-hidden="true" /> {card.emailActionLabel ?? "Email"}
          </a>
        ) : null}
        {telHref ? (
          <a href={telHref} className="col-span-2 inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#002c5d]/20 px-3 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] transition hover:border-[#002c5d]">
            <Phone size={16} aria-hidden="true" /> Call
          </a>
        ) : null}
      </div>
      <DigitalCardQrDialog cardUrl={cardUrl} name={card.firstName} />
    </div>
  );
}
