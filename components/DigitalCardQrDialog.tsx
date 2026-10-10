"use client";

import { Download, QrCode, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { DigitalCardLocale } from "@/data/digitalBusinessCards";

type DigitalCardQrDialogProps = {
  cardUrl: string;
  name: string;
  locale: DigitalCardLocale;
};

const copy = {
  en: {
    showQr: "Show QR code",
    modalTitle: (name: string) => `Share ${name}'s card`,
    close: "Close QR code",
    generating: "Generating QR code…",
    scan: "Scan to open this digital business card.",
    qrAlt: (name: string) => `QR code for ${name}'s digital business card`
  },
  pt: {
    showQr: "Mostrar código QR",
    modalTitle: (name: string) => `Partilhar cartão de ${name}`,
    close: "Fechar código QR",
    generating: "A gerar código QR…",
    scan: "Digitalize para abrir este cartão digital.",
    qrAlt: (name: string) => `Código QR do cartão digital de ${name}`
  }
} as const;

const qrOptions = {
  errorCorrectionLevel: "M" as const,
  margin: 1,
  color: { dark: "#002c5d", light: "#ffffff" },
  width: 1024
};

function downloadSvg(svg: string, name: string) {
  const href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
  const anchor = document.createElement("a");

  anchor.href = href;
  anchor.download = `${name.toLowerCase()}-hospo-creative-qr.svg`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(href);
}

export function DigitalCardQrDialog({ cardUrl, name, locale }: DigitalCardQrDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [png, setPng] = useState<string>();
  const [svg, setSvg] = useState<string>();
  const content = copy[locale];

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || (png && svg)) return;
    let cancelled = false;

    async function generateQr() {
      const { default: QRCode } = await import("qrcode");
      const [nextPng, nextSvg] = await Promise.all([
        QRCode.toDataURL(cardUrl, qrOptions),
        QRCode.toString(cardUrl, { ...qrOptions, type: "svg" })
      ]);

      if (!cancelled) {
        setPng(nextPng);
        setSvg(nextSvg);
      }
    }

    void generateQr();
    return () => {
      cancelled = true;
    };
  }, [cardUrl, isOpen, png, svg]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#002c5d] px-4 text-[0.65rem] font-extrabold uppercase tracking-[0.13em] text-white transition hover:bg-[#003a78]"
        aria-haspopup="dialog"
      >
        <QrCode size={17} aria-hidden="true" />
        {content.showQr}
      </button>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#002c5d]/80 p-4 backdrop-blur-sm sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="digital-card-qr-title"
          onMouseDown={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-[1.5rem] bg-white p-6 text-[#002c5d] shadow-2xl sm:p-7"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-[#002c5d]/55">Hospo Creative</p>
                <h2 id="digital-card-qr-title" className="mt-2 font-[var(--font-display)] text-3xl leading-none">{content.modalTitle(name)}</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 transition hover:bg-[#002c5d]/8"
                aria-label={content.close}
              >
                <X size={21} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-[#f7f8fa] p-4 sm:p-5">
              {png ? (
                <Image src={png} alt={content.qrAlt(name)} width={320} height={320} unoptimized className="mx-auto aspect-square w-full max-w-72" />
              ) : (
                <div className="mx-auto flex aspect-square w-full max-w-72 items-center justify-center rounded-xl bg-white text-center text-xs font-bold text-[#002c5d]/50">{content.generating}</div>
              )}
            </div>
            <p className="mt-4 text-center text-sm leading-6 text-[#002c5d]/70">{content.scan}</p>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => svg && downloadSvg(svg, name)}
                disabled={!svg}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#002c5d]/20 px-3 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] transition hover:border-[#002c5d]"
              >
                <Download size={15} aria-hidden="true" /> SVG
              </button>
              <a
                href={png}
                download={`${name.toLowerCase()}-hospo-creative-qr.png`}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#002c5d] px-3 text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-white transition hover:bg-[#003a78]"
                aria-disabled={!png}
                onClick={(event) => {
                  if (!png) event.preventDefault();
                }}
              >
                <Download size={15} aria-hidden="true" /> PNG
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
