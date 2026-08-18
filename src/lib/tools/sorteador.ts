export interface SorteioResult {
  numbers: number[];
  min: number;
  max: number;
  label?: string;
  at: Date;
}

export const MAX_WHEEL_ITEMS = 16;

export const parseDrawList = (value: string): string[] => {
  const seen = new Set<string>();
  const items: string[] = [];
  for (const part of value.split(/[\n,;]+/)) {
    const item = part.trim();
    if (!item || seen.has(item.toLowerCase())) continue;
    seen.add(item.toLowerCase());
    items.push(item);
  }
  return items;
};

export const drawNumbers = (
  min: number,
  max: number,
  count = 1,
  label?: string
): SorteioResult | null => {
  const low = Math.min(min, max);
  const high = Math.max(min, max);
  if (!Number.isFinite(low) || !Number.isFinite(high) || count < 1) return null;

  const range = high - low + 1;
  if (count > range) return null;

  const pool = Array.from({ length: range }, (_, index) => low + index);
  const numbers: number[] = [];

  for (let i = 0; i < count; i += 1) {
    const pick = Math.floor(Math.random() * pool.length);
    numbers.push(pool.splice(pick, 1)[0]);
  }

  return {
    numbers: numbers.sort((a, b) => a - b),
    min: low,
    max: high,
    label: label?.trim() || undefined,
    at: new Date(),
  };
};

export const drawFromList = (items: string[], count = 1): string[] | null => {
  if (items.length < 2 || count < 1 || count > items.length) return null;
  const pool = [...items];
  const picked: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
};

export const pickOne = (items: string[]): string | null => {
  if (items.length < 2) return null;
  return items[Math.floor(Math.random() * items.length)];
};
