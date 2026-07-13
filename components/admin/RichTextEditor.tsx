"use client";

import { useRef, useState } from "react";

type RichTextEditorProps = {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
};

const toolbarButton =
  "rounded-full border border-ink/14 px-3 py-2 text-xs font-black uppercase tracking-[0.12em] text-ink transition hover:border-yellow hover:bg-yellow/10";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textToHtml(value: string) {
  const blocks = value
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (!blocks.length) {
    return "";
  }

  return blocks
    .map((block) => {
      const lines = block
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      if (lines.length > 1 && lines.every((line) => /^[-•]/.test(line))) {
        return `<ul>${lines
          .map((line) => `<li>${escapeHtml(line.replace(/^[-•]\s*/, ""))}</li>`)
          .join("")}</ul>`;
      }

      return `<p>${escapeHtml(lines.join(" "))}</p>`;
    })
    .join("");
}

function normaliseInitialValue(value = "") {
  return /<\/?[a-z][\s\S]*>/i.test(value) ? value : textToHtml(value);
}

export function RichTextEditor({
  name,
  label,
  defaultValue = "",
  required = false
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState(normaliseInitialValue(defaultValue));

  function syncValue() {
    setHtml(editorRef.current?.innerHTML ?? "");
  }

  function runCommand(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    syncValue();
  }

  return (
    <div className="rounded-[8px] border border-ink/12 bg-white p-4">
      <div className="flex flex-col gap-3 border-b border-ink/10 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="text-sm font-bold text-ink">{label}</label>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={toolbarButton} onClick={() => runCommand("formatBlock", "p")}>
            Paragraph
          </button>
          <button type="button" className={toolbarButton} onClick={() => runCommand("formatBlock", "h2")}>
            H2
          </button>
          <button type="button" className={toolbarButton} onClick={() => runCommand("formatBlock", "h3")}>
            H3
          </button>
          <button type="button" className={toolbarButton} onClick={() => runCommand("bold")}>
            Bold
          </button>
          <button type="button" className={toolbarButton} onClick={() => runCommand("italic")}>
            Italic
          </button>
          <button type="button" className={toolbarButton} onClick={() => runCommand("insertUnorderedList")}>
            Bullets
          </button>
          <button type="button" className={toolbarButton} onClick={() => runCommand("formatBlock", "blockquote")}>
            Quote
          </button>
          <button type="button" className={toolbarButton} onClick={() => runCommand("foreColor", "#002c5d")}>
            Blue
          </button>
          <button type="button" className={toolbarButton} onClick={() => runCommand("foreColor", "#b48800")}>
            Gold
          </button>
        </div>
      </div>

      <input type="hidden" name={name} value={html} required={required} />
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={syncValue}
        onBlur={syncValue}
        className="rich-editor mt-4 min-h-[24rem] rounded-[8px] border border-ink/10 bg-white px-5 py-4 text-lg leading-8 text-ink outline-none transition focus:border-yellow focus:ring-2 focus:ring-yellow/25"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <p className="mt-3 text-sm font-medium leading-6 text-ink/56">
        Use headings for sections, bullets for lists and bold for important phrases. Formatting is saved with the article.
      </p>
    </div>
  );
}
