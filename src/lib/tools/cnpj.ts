const REPEATED = new Set(
  Array.from({ length: 10 }, (_, i) => String(i).repeat(14))
);

const WEIGHTS_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const WEIGHTS_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

const onlyDigits = (value: string): string => value.replace(/\D/g, "");

const checkDigit = (digits: number[], weights: number[]): number => {
  const sum = digits.reduce((total, digit, index) => total + digit * weights[index], 0);
  const rest = sum % 11;
  return rest < 2 ? 0 : 11 - rest;
};

export const formatCnpj = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 14);
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
};

export const isValidCnpj = (value: string): boolean => {
  const digits = onlyDigits(value);
  if (digits.length !== 14 || REPEATED.has(digits)) return false;

  const nums = digits.split("").map(Number);
  const d1 = checkDigit(nums.slice(0, 12), WEIGHTS_1);
  const d2 = checkDigit(nums.slice(0, 13), WEIGHTS_2);
  return nums[12] === d1 && nums[13] === d2;
};

export const generateCnpj = (): string => {
  const randomDigit = (): number => {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] % 10;
  };

  let digits: number[] = [];
  let candidate = "";

  do {
    digits = Array.from({ length: 12 }, randomDigit);
    digits.push(checkDigit(digits, WEIGHTS_1));
    digits.push(checkDigit(digits, WEIGHTS_2));
    candidate = digits.join("");
  } while (REPEATED.has(candidate));

  return candidate;
};
