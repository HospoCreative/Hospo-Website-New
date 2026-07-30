import "server-only";

import nodemailer from "nodemailer";
import type { DigitalScanReport } from "@/types/digitalScan";
import type { Locale } from "@/lib/i18n";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character] ?? character);
}

export async function emailDigitalScan(input: {
  email: string;
  locale: Locale;
  report: DigitalScanReport;
}) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.SMTP_FROM;
  if (!host || !user || !password || !from) return false;

  const port = Number(process.env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) return false;
  const isPortuguese = input.locale === "pt";
  const subjectName = input.report.businessName.replace(/[\r\n]+/g, " ").slice(0, 120);
  const title = isPortuguese
    ? `A sua análise digital Hospo: ${subjectName}`
    : `Your Hospo digital scan: ${subjectName}`;
  const intro = isPortuguese
    ? "Aqui está o resumo da análise aos sinais públicos do seu negócio de hotelaria."
    : "Here is the summary of your hospitality business public presence scan.";
  const priorityTitle = isPortuguese ? "Prioridades imediatas" : "Immediate priorities";
  const limitation = isPortuguese
    ? "Esta análise utiliza apenas informação pública e não acede a contas privadas."
    : "This scan uses public information only and does not access private accounts.";

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: { user, pass: password },
    connectionTimeout: 8_000,
    greetingTimeout: 8_000,
    socketTimeout: 12_000
  });

  const areaRows = input.report.areas.map((area) =>
    `<tr><td style="padding:12px 0;border-bottom:1px solid #d8dde6"><strong>${escapeHtml(area.title)}</strong><br><span style="color:#5f6f86">${escapeHtml(area.summary)}</span></td><td style="padding:12px 0 12px 18px;border-bottom:1px solid #d8dde6;font-size:22px;font-weight:800;color:#07366b">${area.score}/100</td></tr>`
  ).join("");
  const priorityItems = input.report.priorities.map((priority) => `<li style="margin:0 0 10px">${escapeHtml(priority)}</li>`).join("");
  const textAreas = input.report.areas.map((area) => `${area.title}: ${area.score}/100. ${area.summary}`).join("\n");
  const textPriorities = input.report.priorities.map((priority) => `• ${priority}`).join("\n");

  await transporter.sendMail({
    from,
    to: input.email,
    replyTo: process.env.SMTP_REPLY_TO || "info@hospoagency.com",
    subject: title,
    text: `${intro}\n\n${input.report.finalUrl}\n\n${isPortuguese ? "Pontuação geral" : "Overall score"}: ${input.report.overallScore}/100\n\n${textAreas}\n\n${priorityTitle}\n${textPriorities}\n\n${limitation}`,
    html: `<div style="margin:0;background:#f4f7fb;padding:32px 16px;font-family:Arial,sans-serif;color:#092f5c"><div style="max-width:680px;margin:0 auto;background:#ffffff;padding:32px"><div style="height:5px;background:#ffcd39;margin-bottom:28px"></div><p style="margin:0 0 10px;font-size:12px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:#6a7890">Hospo Creative</p><h1 style="margin:0 0 18px;font-family:Georgia,serif;font-size:36px;line-height:1.05">${escapeHtml(input.report.businessName)}</h1><p style="font-size:16px;line-height:1.6;color:#51647e">${intro}</p><p style="margin:28px 0;font-size:44px;font-weight:800">${input.report.overallScore}<span style="font-size:18px;color:#6a7890">/100</span></p><table style="width:100%;border-collapse:collapse">${areaRows}</table><h2 style="margin:32px 0 16px;font-family:Georgia,serif;font-size:26px">${priorityTitle}</h2><ul style="padding-left:20px;line-height:1.6">${priorityItems}</ul><p style="margin-top:30px;padding-top:20px;border-top:1px solid #d8dde6;font-size:13px;line-height:1.6;color:#6a7890">${limitation}</p></div></div>`
  });

  return true;
}
