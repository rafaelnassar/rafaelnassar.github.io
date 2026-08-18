const REPEATED = new Set(
  Array.from({ length: 10 }, (_, i) => String(i).repeat(11))
);

const onlyDigits = (value: string): string => value.replace(/\D/g, "");

const checkDigit = (digits: number[], factorStart: number): number => {
  const sum = digits.reduce(
    (total, digit, index) => total + digit * (factorStart - index),
    0
  );
  const rest = (sum * 10) % 11;
  return rest === 10 ? 0 : rest;
};

export const formatCpf = (value: string): string => {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

export const isValidCpf = (value: string): boolean => {
  const digits = onlyDigits(value);
  if (digits.length !== 11 || REPEATED.has(digits)) return false;

  const nums = digits.split("").map(Number);
  const d1 = checkDigit(nums.slice(0, 9), 10);
  const d2 = checkDigit(nums.slice(0, 10), 11);
  return nums[9] === d1 && nums[10] === d2;
};

export const generateCpf = (): string => {
  const randomDigit = (): number => {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] % 10;
  };

  let digits: number[] = [];
  let candidate = "";

  do {
    digits = Array.from({ length: 9 }, randomDigit);
    digits.push(checkDigit(digits, 10));
    digits.push(checkDigit(digits, 11));
    candidate = digits.join("");
  } while (REPEATED.has(candidate));

  return candidate;
};
