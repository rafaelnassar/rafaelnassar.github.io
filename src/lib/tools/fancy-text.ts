export interface FancyTextStyle {
  id: string;
  label: { pt: string; en: string };
  transform: (input: string) => string;
}

const mapChars = (input: string, offset: number): string =>
  input
    .split("")
    .map((char) => {
      const code = char.codePointAt(0);
      if (!code) return char;
      if (code >= 65 && code <= 90) return String.fromCodePoint(code + offset);
      if (code >= 97 && code <= 122) return String.fromCodePoint(code + offset);
      if (code >= 48 && code <= 57) return String.fromCodePoint(0x1d7ce + (code - 48));
      return char;
    })
    .join("");

const upsideDownMap: Record<string, string> = {
  a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ",
  k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ",
  u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
  A: "∀", B: "q", C: "Ɔ", D: "p", E: "Ǝ", F: "Ⅎ", G: "פ", H: "H", I: "I", J: "ſ",
  K: "ʞ", L: "˥", M: "W", N: "N", O: "O", P: "d", Q: "Q", R: "ɹ", S: "S", T: "⊥",
  U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
  "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9", "7": "ㄥ", "8": "8", "9": "6",
  ".": "˙", ",": "'", "?": "¿", "!": "¡", "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{",
  "<": ">", ">": "<", "&": "⅋", "_": "‾",
};

export const FANCY_TEXT_STYLES: FancyTextStyle[] = [
  {
    id: "bold",
    label: { pt: "Negrito", en: "Bold" },
    transform: (input) => mapChars(input, 0x1d400 - 65),
  },
  {
    id: "italic",
    label: { pt: "Itálico", en: "Italic" },
    transform: (input) => mapChars(input, 0x1d434 - 65),
  },
  {
    id: "script",
    label: { pt: "Script", en: "Script" },
    transform: (input) => mapChars(input, 0x1d49c - 65),
  },
  {
    id: "mono",
    label: { pt: "Monoespaçado", en: "Monospace" },
    transform: (input) => mapChars(input, 0x1d670 - 65),
  },
  {
    id: "double",
    label: { pt: "Duplo traço", en: "Double-struck" },
    transform: (input) => mapChars(input, 0x1d538 - 65),
  },
  {
    id: "sans",
    label: { pt: "Sans-serif", en: "Sans-serif" },
    transform: (input) => mapChars(input, 0x1d5a0 - 65),
  },
  {
    id: "circled",
    label: { pt: "Círculo", en: "Circled" },
    transform: (input) =>
      input
        .split("")
        .map((char) => {
          const code = char.codePointAt(0);
          if (!code) return char;
          if (code >= 65 && code <= 90) return String.fromCodePoint(0x24b6 + (code - 65));
          if (code >= 97 && code <= 122) return String.fromCodePoint(0x24d0 + (code - 97));
          if (code >= 48 && code <= 57) return String.fromCodePoint(0x2460 + (code - 48));
          return char;
        })
        .join(""),
  },
  {
    id: "strike",
    label: { pt: "Riscado", en: "Strikethrough" },
    transform: (input) =>
      input
        .split("")
        .map((char) => (char.trim() ? `${char}\u0336` : char))
        .join(""),
  },
  {
    id: "upside",
    label: { pt: "De cabeça pra baixo", en: "Upside down" },
    transform: (input) =>
      input
        .split("")
        .map((char) => upsideDownMap[char] ?? char)
        .reverse()
        .join(""),
  },
  {
    id: "wide",
    label: { pt: "Espaçado", en: "Wide spacing" },
    transform: (input) => input.split("").join(" "),
  },
];

export const transformFancyText = (input: string, styleId: string): string => {
  const style = FANCY_TEXT_STYLES.find((item) => item.id === styleId);
  return style ? style.transform(input) : input;
};
