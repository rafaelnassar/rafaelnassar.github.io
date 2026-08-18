const LOWER = "abcdefghijkmnopqrstuvwxyz";
const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const NUMBERS = "23456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?";
const SIMILAR_LOWER = "l";
const SIMILAR_UPPER = "IO";
const SIMILAR_NUMBERS = "01";

export interface PasswordOptions {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  numbers: boolean;
  symbols: boolean;
  avoidSimilar: boolean;
}

const pickCharset = (options: PasswordOptions): string => {
  let pool = "";
  if (options.lowercase) {
    pool += LOWER + (options.avoidSimilar ? "" : SIMILAR_LOWER);
  }
  if (options.uppercase) {
    pool += UPPER + (options.avoidSimilar ? "" : SIMILAR_UPPER);
  }
  if (options.numbers) {
    pool += NUMBERS + (options.avoidSimilar ? "" : SIMILAR_NUMBERS);
  }
  if (options.symbols) pool += SYMBOLS;
  return pool;
};

const randomIndex = (max: number): number => {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] % max;
};

export const generatePassword = (options: PasswordOptions): string => {
  const pool = pickCharset(options);
  if (!pool) return "";

  const required: string[] = [];
  if (options.lowercase) {
    const set = LOWER + (options.avoidSimilar ? "" : SIMILAR_LOWER);
    required.push(set[randomIndex(set.length)]);
  }
  if (options.uppercase) {
    const set = UPPER + (options.avoidSimilar ? "" : SIMILAR_UPPER);
    required.push(set[randomIndex(set.length)]);
  }
  if (options.numbers) {
    const set = NUMBERS + (options.avoidSimilar ? "" : SIMILAR_NUMBERS);
    required.push(set[randomIndex(set.length)]);
  }
  if (options.symbols) {
    required.push(SYMBOLS[randomIndex(SYMBOLS.length)]);
  }

  const length = Math.max(options.length, required.length);
  const chars = [...required];
  while (chars.length < length) {
    chars.push(pool[randomIndex(pool.length)]);
  }

  for (let i = chars.length - 1; i > 0; i -= 1) {
    const j = randomIndex(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
};

export const passwordStrength = (
  password: string
): { score: 1 | 2 | 3 | 4; label: { pt: string; en: string } } => {
  let score = 0;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score += 1;

  const clamped = Math.max(1, Math.min(4, score || 1)) as 1 | 2 | 3 | 4;
  const labels = {
    1: { pt: "Fraca", en: "Weak" },
    2: { pt: "Razoável", en: "Fair" },
    3: { pt: "Forte", en: "Strong" },
    4: { pt: "Muito forte", en: "Very strong" },
  } as const;

  return { score: clamped, label: labels[clamped] };
};
