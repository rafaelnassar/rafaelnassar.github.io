export type LoremUnit = "paragraphs" | "sentences" | "words";
export type LoremLang = "la" | "pt" | "en";

export interface LoremOptions {
  count: number;
  unit: LoremUnit;
  lang: LoremLang;
  startWithLorem?: boolean;
  html?: boolean;
}

export const LOREM_LIMITS: Record<LoremUnit, { min: number; max: number; fallback: number }> = {
  paragraphs: { min: 1, max: 20, fallback: 3 },
  sentences: { min: 1, max: 40, fallback: 5 },
  words: { min: 1, max: 300, fallback: 50 },
};

const CLASSIC_OPENING =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

const CLASSIC_WORDS = CLASSIC_OPENING.replace(/[.,]/g, "").split(" ");

const WORDS: Record<LoremLang, string[]> = {
  la: [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
    "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
    "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
    "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
    "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
    "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur",
    "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui",
    "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "curabitur",
    "pretium", "tincidunt", "lacus", "gravida", "orci", "varius", "natoque",
    "penatibus", "magnis", "dis", "parturient", "montes", "nascetur", "ridiculus",
    "mus", "donec", "quam", "felis", "ultricies", "nec", "pellentesque", "eu",
    "pretium", "quis", "sem", "nulla", "consequat", "massa", "quis", "enim",
    "mauris", "aenean", "fermentum", "viverra", "leo", "integer", "at", "bibendum",
    "sodales", "augue", "vel", "posuere", "erat", "volutpat", "phasellus",
    "viverra", "nulla", "ut", "metus", "varius", "laoreet", "quisque", "rutrum",
    "aenean", "imperdiet", "etiam", "ultricies", "nisi", "vel", "augue",
  ],
  pt: [
    "ainda", "algum", "ambiente", "ampla", "antes", "apresenta", "assim", "atual",
    "cada", "caminho", "campo", "claro", "conjunto", "conteúdo", "contexto",
    "quando", "qualquer", "quase", "durante", "depois", "desta", "deste",
    "direto", "efeito", "elemento", "espaço", "exemplo", "forma", "frente",
    "imagem", "junto", "lado", "lista", "lugar", "maior", "maneira", "mesmo",
    "medida", "melhor", "menos", "modo", "muito", "mundo", "nada", "nenhum",
    "novo", "número", "outra", "outro", "página", "parte", "passo", "pequeno",
    "pessoa", "ponto", "porque", "possível", "pouco", "próximo", "quase",
    "razão", "relação", "resto", "resultado", "segundo", "sempre", "sentido",
    "simples", "sobre", "somente", "tempo", "texto", "tipo", "todo", "trabalho",
    "tudo", "último", "único", "usar", "valor", "vários", "vezes", "visão",
    "visível", "volume", "entre", "dentro", "através", "conforme", "embora",
    "portanto", "também", "além", "abaixo", "acima", "geral", "comum", "útil",
  ],
  en: [
    "about", "across", "after", "again", "along", "also", "always", "among",
    "another", "around", "because", "before", "between", "beyond", "common",
    "content", "context", "current", "direct", "during", "each", "either",
    "element", "enough", "every", "example", "field", "first", "form", "given",
    "image", "inside", "later", "least", "level", "list", "little", "local",
    "major", "maybe", "means", "might", "more", "most", "move", "much", "need",
    "never", "next", "often", "once", "only", "other", "over", "page", "part",
    "place", "point", "possible", "quite", "rather", "really", "result", "same",
    "second", "several", "should", "simple", "since", "small", "some", "space",
    "still", "such", "text", "than", "their", "then", "there", "these", "those",
    "through", "under", "until", "using", "value", "various", "very", "view",
    "visible", "where", "which", "while", "within", "without", "work", "world",
  ],
};

const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const randomInt = (min: number, max: number): number =>
  min + Math.floor(Math.random() * (max - min + 1));

export const clampLoremCount = (count: number, unit: LoremUnit): number => {
  const { min, max, fallback } = LOREM_LIMITS[unit];
  if (!Number.isFinite(count)) return fallback;
  return Math.min(max, Math.max(min, Math.round(count)));
};

const takeWords = (pool: string[], count: number, avoid?: string): string[] => {
  const words: string[] = [];
  let previous = avoid ?? "";
  while (words.length < count) {
    const next = pick(pool);
    if (next === previous && pool.length > 1) continue;
    words.push(next);
    previous = next;
  }
  return words;
};

const toSentence = (words: string[]): string => {
  const body = words.join(" ");
  return `${body.charAt(0).toUpperCase()}${body.slice(1)}.`;
};

const buildSentence = (lang: LoremLang, wordCount?: number): string =>
  toSentence(takeWords(WORDS[lang], wordCount ?? randomInt(8, 16)));

const buildParagraph = (lang: LoremLang, sentenceCount?: number): string => {
  const n = sentenceCount ?? randomInt(3, 6);
  return Array.from({ length: n }, () => buildSentence(lang)).join(" ");
};

const wrapHtml = (paragraphs: string[]): string =>
  paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("\n\n");

export const formatLoremOutput = (text: string, html: boolean): string => {
  if (!html || !text) return text;
  return wrapHtml(text.split(/\n\n+/).filter(Boolean));
};

const generateWords = (count: number, lang: LoremLang, startWithLorem: boolean): string => {
  if (startWithLorem) {
    if (count <= CLASSIC_WORDS.length) return CLASSIC_WORDS.slice(0, count).join(" ");
    const rest = takeWords(
      WORDS[lang],
      count - CLASSIC_WORDS.length,
      CLASSIC_WORDS[CLASSIC_WORDS.length - 1]
    );
    return [...CLASSIC_WORDS, ...rest].join(" ");
  }
  return takeWords(WORDS[lang], count).join(" ");
};

const generateSentences = (count: number, lang: LoremLang, startWithLorem: boolean): string[] => {
  const sentences: string[] = [];
  if (startWithLorem) sentences.push(CLASSIC_OPENING);
  while (sentences.length < count) {
    sentences.push(buildSentence(lang));
  }
  return sentences.slice(0, count);
};

const generateParagraphs = (count: number, lang: LoremLang, startWithLorem: boolean): string[] => {
  const paragraphs = Array.from({ length: count }, () => buildParagraph(lang));
  if (startWithLorem && paragraphs.length) {
    paragraphs[0] = `${CLASSIC_OPENING} ${paragraphs[0]}`;
  }
  return paragraphs;
};

export const generateLorem = ({
  count,
  unit,
  lang,
  startWithLorem = false,
  html = false,
}: LoremOptions): string => {
  const n = clampLoremCount(count, unit);
  const classic = Boolean(startWithLorem);

  const plain =
    unit === "words"
      ? generateWords(n, lang, classic)
      : unit === "sentences"
        ? generateSentences(n, lang, classic).join(" ")
        : generateParagraphs(n, lang, classic).join("\n\n");

  return formatLoremOutput(plain, html);
};
