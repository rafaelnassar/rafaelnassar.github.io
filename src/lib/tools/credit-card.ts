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
}

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
    case "visa":
      return "4" + randomDigits(5).slice(0, 5);
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

const formatCardNumber = (number: string, brand: CreditCardBrand): string => {
  if (brand === "amex") {
    return `${number.slice(0, 4)} ${number.slice(4, 10)} ${number.slice(10)}`;
  }
  return number.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

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

const matchesPrefix = (digits: string, prefixes: string[]): boolean =>
  prefixes.some((prefix) => digits.startsWith(prefix));

export const detectCardBrand = (value: string): CreditCardBrand | null => {
  const digits = normalizeCardNumber(value);
  if (!digits) return null;
  if (digits.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(digits) || /^2(2[2-9]|[3-6]|7[01]|720)/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^3(0[0-5]|[68])/.test(digits)) return "diners";
  if (digits.startsWith("6011") || digits.startsWith("65")) return "discover";
  if (
    matchesPrefix(digits, ["636368", "438935", "504175", "636297", "5067", "4576", "4011"])
  ) {
    return "elo";
  }
  if (digits.startsWith("606282")) return "hipercard";
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
  };
};
