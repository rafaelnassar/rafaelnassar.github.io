export type CreditCardBrand =
  | "visa"
  | "mastercard"
  | "amex"
  | "diners"
  | "discover"
  | "elo"
  | "hipercard";

export interface CreditCardBrandInfo {
  id: CreditCardBrand;
  label: string;
  length: number;
  cvvLength: number;
}

export const CREDIT_CARD_BRANDS: CreditCardBrandInfo[] = [
  { id: "visa", label: "Visa", length: 16, cvvLength: 3 },
  { id: "mastercard", label: "MasterCard", length: 16, cvvLength: 3 },
  { id: "amex", label: "American Express", length: 15, cvvLength: 4 },
  { id: "diners", label: "Diners Club", length: 14, cvvLength: 3 },
  { id: "discover", label: "Discover", length: 16, cvvLength: 3 },
  { id: "elo", label: "Elo", length: 16, cvvLength: 3 },
  { id: "hipercard", label: "Hipercard", length: 16, cvvLength: 3 },
];

export interface GeneratedCreditCard {
  brand: CreditCardBrand;
  number: string;
  formatted: string;
  expiry: string;
  cvv: string;
  holder: string;
}

export const CARD_NUMBER_PLACEHOLDER = "•";

const ELO_PREFIXES = [
  "636368",
  "438935",
  "504175",
  "636297",
  "627780",
  "5067",
  "4576",
  "4011",
  "509",
];

const matchesPrefix = (digits: string, prefixes: string[]): boolean =>
  prefixes.some((prefix) => digits.startsWith(prefix));

const TEST_HOLDERS = [
  "ANA SILVA",
  "JOAO SANTOS",
  "MARIA OLIVEIRA",
  "PEDRO COSTA",
  "JULIA FERREIRA",
  "LUCAS ALMEIDA",
  "BEATRIZ LIMA",
  "CARLOS SOUZA",
];

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomDigits = (count: number): string =>
  Array.from({ length: count }, () => randomInt(0, 9)).join("");

const luhnCheckDigit = (partial: string): number => {
  const digits = partial.split("").map(Number);
  let sum = 0;
  let double = true;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = digits[i];
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return (10 - (sum % 10)) % 10;
};

const generateLuhnNumber = (prefix: string, length: number): string => {
  const bodyLength = length - prefix.length - 1;
  const body = randomDigits(bodyLength);
  const partial = prefix + body;
  return partial + luhnCheckDigit(partial);
};

const brandPrefix = (brand: CreditCardBrand): string => {
  switch (brand) {
    case "visa": {
      let prefix = "4" + randomDigits(5);
      while (matchesPrefix(prefix, ELO_PREFIXES)) {
        prefix = "4" + randomDigits(5);
      }
      return prefix;
    }
    case "mastercard":
      return String(randomInt(51, 55)) + randomDigits(4);
    case "amex":
      return randomInt(0, 1) === 0 ? "34" + randomDigits(4) : "37" + randomDigits(4);
    case "diners":
      return "36" + randomDigits(4);
    case "discover":
      return "6011" + randomDigits(4);
    case "elo":
      return ["636368", "438935", "504175", "636297"][randomInt(0, 3)] + randomDigits(2);
    case "hipercard":
      return "606282" + randomDigits(4);
    default:
      return "4" + randomDigits(5);
  }
};

export const getBrandInfo = (
  brand: CreditCardBrand | null | undefined
): CreditCardBrandInfo | undefined =>
  brand ? CREDIT_CARD_BRANDS.find((item) => item.id === brand) : undefined;

export const cardNumberGroups = (brand: CreditCardBrand | null | undefined): number[] => {
  if (brand === "amex") return [4, 6, 5];
  if (brand === "diners") return [4, 6, 4];
  return [4, 4, 4, 4];
};

export const formatCardNumber = (
  number: string,
  brand: CreditCardBrand | null = null
): string => {
  const digits = normalizeCardNumber(number);
  const groups = cardNumberGroups(brand);
  const parts: string[] = [];
  let index = 0;
  for (const size of groups) {
    if (index >= digits.length) break;
    parts.push(digits.slice(index, index + size));
    index += size;
  }
  if (index < digits.length) parts.push(digits.slice(index));
  return parts.join(" ");
};

export const formatCardNumberInput = (
  value: string,
  brand: CreditCardBrand | null = null
): string => {
  const maxLength = getBrandInfo(brand)?.length ?? 19;
  return formatCardNumber(normalizeCardNumber(value).slice(0, maxLength), brand);
};

export const displayCardNumberGroups = (
  value: string,
  brand: CreditCardBrand | null = null
): string[] => {
  const groups = cardNumberGroups(brand);
  const maxLength = groups.reduce((sum, size) => sum + size, 0);
  const digits = normalizeCardNumber(value).slice(0, maxLength);
  const chars = [
    ...digits.split(""),
    ...Array.from({ length: Math.max(0, maxLength - digits.length) }, () => CARD_NUMBER_PLACEHOLDER),
  ];
  let index = 0;
  return groups.map((size) => {
    const part = chars.slice(index, index + size).join("");
    index += size;
    return part;
  });
};

export const formatExpiryInput = (value: string): string => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (!digits) return "";

  if (digits.length === 1) {
    return Number(digits) > 1 ? `0${digits}` : digits;
  }

  let month = digits.slice(0, 2);
  const monthNum = Number(month);
  if (monthNum === 0) month = "01";
  else if (monthNum > 12) month = "12";
  else month = String(monthNum).padStart(2, "0");

  const year = digits.slice(2);
  return year ? `${month}/${year}` : month;
};

export const formatCvvInput = (
  value: string,
  brand: CreditCardBrand | null = null
): string => {
  const maxLength = getBrandInfo(brand)?.cvvLength ?? 4;
  return value.replace(/\D/g, "").slice(0, maxLength);
};

export const formatHolderInput = (value: string): string =>
  value.replace(/[^a-zA-ZÀ-ÿ\s'.-]/g, "").slice(0, 26);

export const normalizeCardNumber = (value: string): string => value.replace(/\D/g, "");

export const isValidLuhn = (value: string): boolean => {
  const digits = normalizeCardNumber(value);
  if (digits.length < 13) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    let digit = Number(digits[i]);
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    double = !double;
  }
  return sum % 10 === 0;
};

export const detectCardBrand = (value: string): CreditCardBrand | null => {
  const digits = normalizeCardNumber(value);
  if (!digits) return null;
  if (/^3[47]/.test(digits)) return "amex";
  if (/^3(0[0-5]|[68])/.test(digits)) return "diners";
  if (/^5[1-5]/.test(digits) || /^2(2[2-9]|[3-6]|7[01]|720)/.test(digits)) {
    return "mastercard";
  }
  if (digits.startsWith("606282")) return "hipercard";
  if (matchesPrefix(digits, ELO_PREFIXES)) return "elo";
  if (digits.startsWith("6011") || /^64[4-9]/.test(digits) || digits.startsWith("65")) {
    return "discover";
  }
  if (digits.startsWith("4")) return "visa";
  return null;
};

export interface CreditCardValidation {
  valid: boolean;
  brand: CreditCardBrand | null;
  luhn: boolean;
  lengthOk: boolean;
}

export const validateCreditCard = (
  value: string,
  expectedBrand?: CreditCardBrand
): CreditCardValidation => {
  const digits = normalizeCardNumber(value);
  const detected = detectCardBrand(digits);
  const brand = expectedBrand ?? detected;
  const info = brand ? CREDIT_CARD_BRANDS.find((item) => item.id === brand) : undefined;
  const luhn = isValidLuhn(digits);
  const lengthOk = info ? digits.length === info.length : digits.length >= 13 && digits.length <= 19;
  const prefixOk = expectedBrand ? detected === expectedBrand || detected === null : true;
  return {
    valid: luhn && lengthOk && prefixOk && digits.length > 0,
    brand: detected,
    luhn,
    lengthOk,
  };
};

export const generateCreditCard = (
  brand: CreditCardBrand,
  formatted = true
): GeneratedCreditCard => {
  const info = CREDIT_CARD_BRANDS.find((item) => item.id === brand)!;
  const prefix = brandPrefix(brand).slice(0, info.length - 1);
  const number = generateLuhnNumber(prefix, info.length);
  const month = String(randomInt(1, 12)).padStart(2, "0");
  const year = String(randomInt(new Date().getFullYear(), new Date().getFullYear() + 8)).slice(-2);

  return {
    brand,
    number,
    formatted: formatted ? formatCardNumber(number, brand) : number,
    expiry: `${month}/${year}`,
    cvv: randomDigits(info.cvvLength),
    holder: TEST_HOLDERS[randomInt(0, TEST_HOLDERS.length - 1)],
  };
};
