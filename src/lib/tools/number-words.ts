type LetterCase = "lower" | "upper" | "title";

const PT_ONES = [
  "", "um", "dois", "três", "quatro", "cinco", "seis", "sete", "oito", "nove",
  "dez", "onze", "doze", "treze", "catorze", "quinze", "dezesseis", "dezessete", "dezoito", "dezenove",
];
const PT_TENS = ["", "", "vinte", "trinta", "quarenta", "cinquenta", "sessenta", "setenta", "oitenta", "noventa"];
const PT_HUNDREDS = ["", "cento", "duzentos", "trezentos", "quatrocentos", "quinhentos", "seiscentos", "setecentos", "oitocentos", "novecentos"];

const EN_ONES = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];
const EN_TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

const applyCase = (text: string, letterCase: LetterCase): string => {
  if (letterCase === "upper") return text.toUpperCase();
  if (letterCase === "title") {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }
  return text.toLowerCase();
};

const ptBelow100 = (n: number): string => {
  if (n < 20) return PT_ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return ones ? `${PT_TENS[tens]} e ${PT_ONES[ones]}` : PT_TENS[tens];
};

const ptBelow1000 = (n: number): string => {
  if (n === 100) return "cem";
  if (n < 100) return ptBelow100(n);
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const head = PT_HUNDREDS[hundreds];
  return rest ? `${head} e ${ptBelow100(rest)}` : head;
};

const ptInteger = (n: number): string => {
  if (n === 0) return "zero";
  if (n < 1000) return ptBelow1000(n);
  if (n < 1_000_000) {
    const thousands = Math.floor(n / 1000);
    const rest = n % 1000;
    const head = thousands === 1 ? "mil" : `${ptBelow1000(thousands)} mil`;
    return rest ? `${head} e ${ptInteger(rest)}` : head;
  }
  if (n < 1_000_000_000) {
    const millions = Math.floor(n / 1_000_000);
    const rest = n % 1_000_000;
    const head = millions === 1 ? "um milhão" : `${ptInteger(millions)} milhões`;
    return rest ? `${head} e ${ptInteger(rest)}` : head;
  }
  return String(n);
};

const enBelow100 = (n: number): string => {
  if (n < 20) return EN_ONES[n];
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return ones ? `${EN_TENS[tens]}-${EN_ONES[ones]}` : EN_TENS[tens];
};

const enBelow1000 = (n: number): string => {
  if (n < 100) return enBelow100(n);
  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const head = `${EN_ONES[hundreds]} hundred`;
  return rest ? `${head} ${enBelow100(rest)}` : head;
};

const enInteger = (n: number): string => {
  if (n === 0) return "zero";
  if (n < 1000) return enBelow1000(n);
  if (n < 1_000_000) {
    const thousands = Math.floor(n / 1000);
    const rest = n % 1000;
    const head = `${enBelow1000(thousands)} thousand`;
    return rest ? `${head} ${enInteger(rest)}` : head;
  }
  if (n < 1_000_000_000) {
    const millions = Math.floor(n / 1_000_000);
    const rest = n % 1_000_000;
    const head = millions === 1 ? "one million" : `${enInteger(millions)} million`;
    return rest ? `${head} ${enInteger(rest)}` : head;
  }
  return String(n);
};

export type NumberWordsMode = "currency" | "number";

export const numberToWords = (
  raw: string,
  mode: NumberWordsMode,
  letterCase: LetterCase,
  lang: "pt" | "en"
): string => {
  const cleaned = raw.replace(/\./g, "").replace(",", ".").trim();
  const value = Number(cleaned);
  if (!Number.isFinite(value)) return "";

  const negative = value < 0;
  const abs = Math.abs(value);
  const reais = Math.floor(abs);
  const cents = Math.round((abs - reais) * 100);

  if (mode === "number") {
    const words = lang === "pt" ? ptInteger(reais) : enInteger(reais);
    const result = negative ? (lang === "pt" ? `menos ${words}` : `minus ${words}`) : words;
    return applyCase(result, letterCase);
  }

  if (lang === "pt") {
    const reaisWords = reais === 1 ? "um real" : `${ptInteger(reais)} reais`;
    const centsWords =
      cents === 0 ? "" : cents === 1 ? " e um centavo" : ` e ${ptInteger(cents)} centavos`;
    const result = `${negative ? "menos " : ""}${reaisWords}${centsWords}`;
    return applyCase(result, letterCase);
  }

  const dollarsWords = reais === 1 ? "one dollar" : `${enInteger(reais)} dollars`;
  const centsWords =
    cents === 0 ? "" : cents === 1 ? " and one cent" : ` and ${enInteger(cents)} cents`;
  const result = `${negative ? "minus " : ""}${dollarsWords}${centsWords}`;
  return applyCase(result, letterCase);
};
