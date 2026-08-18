import { BRAZILIAN_STATES, type BrazilianState } from "@/lib/tools/person";

const DDD_BY_STATE: Partial<Record<BrazilianState, string[]>> = {
  SP: ["11", "12", "13", "14", "15", "16", "17", "18", "19"],
  RJ: ["21", "22", "24"],
  MG: ["31", "32", "33", "34", "35", "37", "38"],
  RS: ["51", "53", "54", "55"],
  PR: ["41", "42", "43", "44", "45", "46"],
  SC: ["47", "48", "49"],
  BA: ["71", "73", "74", "75", "77"],
  CE: ["85", "88"],
  PE: ["81", "87"],
  GO: ["62", "64"],
  DF: ["61"],
  ES: ["27", "28"],
  AM: ["92", "97"],
  PA: ["91", "93", "94"],
  MT: ["65", "66"],
  MS: ["67"],
  MA: ["98", "99"],
  PB: ["83"],
  RN: ["84"],
  AL: ["82"],
  PI: ["86", "89"],
  SE: ["79"],
  RO: ["69"],
  AC: ["68"],
  AP: ["96"],
  RR: ["95"],
  TO: ["63"],
};

const ALL_DDD = Object.values(DDD_BY_STATE).flat();

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomDigits = (count: number): string =>
  Array.from({ length: count }, () => randomInt(0, 9)).join("");

export interface GeneratedPhone {
  ddd: string;
  number: string;
  formatted: string;
  mobile: boolean;
}

export interface PhoneGeneratorOptions {
  state?: BrazilianState;
  mobile?: boolean;
  formatted?: boolean;
}

export const generatePhone = (options: PhoneGeneratorOptions = {}): GeneratedPhone => {
  const dddPool = options.state ? DDD_BY_STATE[options.state] ?? ALL_DDD : ALL_DDD;
  const ddd = dddPool[randomInt(0, dddPool.length - 1)];
  const isMobile = options.mobile ?? randomInt(0, 1) === 1;

  const number = isMobile
    ? `9${randomDigits(4)}${randomDigits(4)}`
    : `${randomDigits(4)}${randomDigits(4)}`;

  const formatted = isMobile
    ? `(${ddd}) ${number.slice(0, 5)}-${number.slice(5)}`
    : `(${ddd}) ${number.slice(0, 4)}-${number.slice(4)}`;

  return {
    ddd,
    number: ddd + number,
    formatted,
    mobile: isMobile,
  };
};
