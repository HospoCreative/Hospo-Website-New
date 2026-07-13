type RichArticleContentProps = {
  content: string;
};

const allowedTags = new Set([
  "a",
  "blockquote",
  "br",
  "em",
  "font",
  "h2",
  "h3",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "ul"
]);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function plainTextToHtml(value: string) {
  return value
    .split(/\n{2,}|\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (/^[-•]\s+/.test(line)) {
        return `<ul><li>${escapeHtml(line.replace(/^[-•]\s+/, ""))}</li></ul>`;
      }

      return `<p>${escapeHtml(line)}</p>`;
    })
    .join("");
}

function sanitiseAttribute(tag: string, name: string, value: string) {
  const lowerName = name.toLowerCase();

  if (tag === "a" && lowerName === "href" && /^https?:\/\//i.test(value)) {
    return ` href="${escapeHtml(value)}" target="_blank" rel="noreferrer"`;
  }

  if ((tag === "font" && lowerName === "color") || (tag === "span" && lowerName === "style")) {
    const colour = value.match(/#(?:002c5d|b48800|f2c62c|ffcc53)\b/i)?.[0];
    return colour ? ` style="color: ${colour}"` : "";
  }

  return "";
}

function sanitiseHtml(value: string) {
  const source = /<\/?[a-z][\s\S]*>/i.test(value) ? value : plainTextToHtml(value);

  return source.replace(/<\/?([a-z0-9]+)([^>]*)>/gi, (match, rawTag, rawAttributes) => {
    const tag = String(rawTag).toLowerCase();
    const closing = match.startsWith("</");

    if (!allowedTags.has(tag)) {
      return "";
    }

    if (closing) {
      return `</${tag}>`;
    }

    const attributes = String(rawAttributes).replace(
      /([a-z-]+)=["']([^"']*)["']/gi,
      (_attributeMatch, name, attributeValue) =>
        sanitiseAttribute(tag, String(name), String(attributeValue))
    );

    return `<${tag}${attributes}>`;
  });
}

export function RichArticleContent({ content }: RichArticleContentProps) {
  return (
    <div
      className="rich-article mx-auto max-w-3xl"
      dangerouslySetInnerHTML={{ __html: sanitiseHtml(content) }}
    />
  );
}
