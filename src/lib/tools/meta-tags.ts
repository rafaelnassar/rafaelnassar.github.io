export interface MetaTagsInput {
  title: string;
  author: string;
  keywords: string;
  description: string;
  url?: string;
}

export const generateMetaTags = (input: MetaTagsInput): string => {
  const title = input.title.trim();
  const author = input.author.trim();
  const keywords = input.keywords.trim();
  const description = input.description.trim();
  const url = input.url?.trim() ?? "";

  const lines = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="title" content="${escapeAttr(title)}" />`,
    author ? `<meta name="author" content="${escapeAttr(author)}" />` : "",
    keywords ? `<meta name="keywords" content="${escapeAttr(keywords)}" />` : "",
    description ? `<meta name="description" content="${escapeAttr(description)}" />` : "",
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
    description ? `<meta property="og:description" content="${escapeAttr(description)}" />` : "",
    url ? `<meta property="og:url" content="${escapeAttr(url)}" />` : "",
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeAttr(title)}" />`,
    description ? `<meta name="twitter:description" content="${escapeAttr(description)}" />` : "",
  ].filter(Boolean);

  return lines.join("\n");
};

const escapeAttr = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeHtml = escapeAttr;
