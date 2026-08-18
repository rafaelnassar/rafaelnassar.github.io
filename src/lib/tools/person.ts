import { formatCpf, generateCpf } from "@/lib/tools/cpf";
import { generatePassword } from "@/lib/tools/password";

export type GenderOption = "male" | "female" | "random";
export type ResolvedGender = "male" | "female";

export const BRAZILIAN_STATES = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA",
  "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN",
  "RO", "RR", "RS", "SC", "SE", "SP", "TO",
] as const;

export type BrazilianState = (typeof BRAZILIAN_STATES)[number];

export interface PersonGeneratorOptions {
  gender: GenderOption;
  age?: number;
  state?: BrazilianState;
  city?: string;
  formatted: boolean;
  count: number;
  lang: "pt" | "en";
}

export interface GeneratedPerson {
  name: string;
  cpf: string;
  rg: string;
  birthDate: string;
  gender: ResolvedGender;
  zodiacSign: string;
  mother: string;
  father: string;
  email: string;
  password: string;
  zipCode: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: BrazilianState;
  phone: string;
  mobile: string;
  height: string;
  weight: string;
  bloodType: string;
  favoriteColor: string;
}

const MALE_FIRST = [
  "João", "Pedro", "Lucas", "Gabriel", "Rafael", "Matheus", "Guilherme", "Bruno",
  "Felipe", "Diego", "André", "Carlos", "Eduardo", "Fernando", "Gustavo", "Henrique",
  "Igor", "Leonardo", "Marcelo", "Paulo", "Ricardo", "Rodrigo", "Thiago", "Vinícius",
];

const FEMALE_FIRST = [
  "Maria", "Ana", "Julia", "Beatriz", "Larissa", "Fernanda", "Camila", "Amanda",
  "Juliana", "Patricia", "Carolina", "Daniela", "Gabriela", "Helena", "Isabela",
  "Letícia", "Mariana", "Natália", "Paula", "Renata", "Sandra", "Tatiana", "Vanessa",
];

const LAST_NAMES = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira",
  "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Rocha", "Barbosa",
  "Nascimento", "Araújo", "Melo", "Cardoso", "Teixeira", "Correia", "Moura", "Cavalcanti",
];

const STREETS = [
  "Rua das Flores", "Avenida Brasil", "Rua São Paulo", "Travessa da Paz", "Alameda Santos",
  "Rua XV de Novembro", "Avenida Paulista", "Rua Dom Pedro II", "Rua Getúlio Vargas",
  "Rua Tiradentes", "Rua Bahia", "Avenida Central", "Rua das Palmeiras",
];

const NEIGHBORHOODS = [
  "Centro", "Jardim América", "Vila Nova", "Bela Vista", "Boa Vista", "Santa Cruz",
  "São José", "Industrial", "Parque das Nações", "Jardim Europa", "Vila Mariana",
];

const CITIES_BY_STATE: Record<BrazilianState, string[]> = {
  AC: ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira"],
  AL: ["Maceió", "Arapiraca", "Palmeira dos Índios"],
  AM: ["Manaus", "Parintins", "Itacoatiara"],
  AP: ["Macapá", "Santana", "Laranjal do Jari"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista", "Ilhéus"],
  CE: ["Fortaleza", "Caucaia", "Juazeiro do Norte", "Sobral"],
  DF: ["Brasília", "Taguatinga", "Ceilândia"],
  ES: ["Vitória", "Vila Velha", "Serra", "Cariacica"],
  GO: ["Goiânia", "Aparecida de Goiânia", "Anápolis"],
  MA: ["São Luís", "Imperatriz", "Caxias"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem", "Juiz de Fora"],
  MS: ["Campo Grande", "Dourados", "Três Lagoas"],
  MT: ["Cuiabá", "Várzea Grande", "Rondonópolis"],
  PA: ["Belém", "Ananindeua", "Santarém", "Marabá"],
  PB: ["João Pessoa", "Campina Grande", "Patos"],
  PE: ["Recife", "Jaboatão dos Guararapes", "Olinda", "Caruaru"],
  PI: ["Teresina", "Parnaíba", "Picos"],
  PR: ["Curitiba", "Londrina", "Maringá", "Ponta Grossa"],
  RJ: ["Rio de Janeiro", "Niterói", "Duque de Caxias", "Nova Iguaçu"],
  RN: ["Natal", "Mossoró", "Parnamirim"],
  RO: ["Porto Velho", "Ji-Paraná", "Ariquemes"],
  RR: ["Boa Vista", "Rorainópolis"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas", "Canoas"],
  SC: ["Florianópolis", "Joinville", "Blumenau", "Chapecó"],
  SE: ["Aracaju", "Nossa Senhora do Socorro", "Lagarto"],
  SP: ["São Paulo", "Campinas", "Santos", "Sorocaba", "Ribeirão Preto"],
  TO: ["Palmas", "Araguaína", "Gurupi"],
};

const DDD_BY_STATE: Record<BrazilianState, string[]> = {
  AC: ["68"],
  AL: ["82"],
  AM: ["92", "97"],
  AP: ["96"],
  BA: ["71", "73", "74", "75", "77"],
  CE: ["85", "88"],
  DF: ["61"],
  ES: ["27", "28"],
  GO: ["62", "64"],
  MA: ["98", "99"],
  MG: ["31", "32", "33", "34", "35", "37", "38"],
  MS: ["67"],
  MT: ["65", "66"],
  PA: ["91", "93", "94"],
  PB: ["83"],
  PE: ["81", "87"],
  PI: ["86", "89"],
  PR: ["41", "42", "43", "44", "45", "46"],
  RJ: ["21", "22", "24"],
  RN: ["84"],
  RO: ["69"],
  RR: ["95"],
  RS: ["51", "53", "54", "55"],
  SC: ["47", "48", "49"],
  SE: ["79"],
  SP: ["11", "12", "13", "14", "15", "16", "17", "18", "19"],
  TO: ["63"],
};

/** Faixas aproximadas de CEP por UF (primeiros 5 dígitos). */
const CEP_RANGES: Record<BrazilianState, [number, number]> = {
  AC: [69900, 69999], AL: [57000, 57999], AM: [69000, 69899], AP: [68900, 68999],
  BA: [40000, 48999], CE: [60000, 63999], DF: [70000, 73699], ES: [29000, 29999],
  GO: [72800, 76799], MA: [65000, 65999], MG: [30000, 39999], MS: [79000, 79999],
  MT: [78000, 78899], PA: [66000, 68899], PB: [58000, 58999], PE: [50000, 56999],
  PI: [64000, 64999], PR: [80000, 87999], RJ: [20000, 28999], RN: [59000, 59999],
  RO: [76800, 76999], RR: [69300, 69399], RS: [90000, 99999], SC: [88000, 89999],
  SE: [49000, 49999], SP: [1000, 19999], TO: [77000, 77999],
};

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const COLORS = [
  { pt: "Azul", en: "Blue" },
  { pt: "Verde", en: "Green" },
  { pt: "Vermelho", en: "Red" },
  { pt: "Amarelo", en: "Yellow" },
  { pt: "Roxo", en: "Purple" },
  { pt: "Laranja", en: "Orange" },
  { pt: "Preto", en: "Black" },
  { pt: "Branco", en: "White" },
];

const EMAIL_DOMAINS = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com.br"];

const ZODIAC = [
  { pt: "Capricórnio", en: "Capricorn", from: [12, 22], to: [1, 19] },
  { pt: "Aquário", en: "Aquarius", from: [1, 20], to: [2, 18] },
  { pt: "Peixes", en: "Pisces", from: [2, 19], to: [3, 20] },
  { pt: "Áries", en: "Aries", from: [3, 21], to: [4, 19] },
  { pt: "Touro", en: "Taurus", from: [4, 20], to: [5, 20] },
  { pt: "Gêmeos", en: "Gemini", from: [5, 21], to: [6, 20] },
  { pt: "Câncer", en: "Cancer", from: [6, 21], to: [7, 22] },
  { pt: "Leão", en: "Leo", from: [7, 23], to: [8, 22] },
  { pt: "Virgem", en: "Virgo", from: [8, 23], to: [9, 22] },
  { pt: "Libra", en: "Libra", from: [9, 23], to: [10, 22] },
  { pt: "Escorpião", en: "Scorpio", from: [10, 23], to: [11, 21] },
  { pt: "Sagitário", en: "Sagittarius", from: [11, 22], to: [12, 21] },
];

const randomInt = (min: number, max: number): number => {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return min + (buffer[0] % (max - min + 1));
};

const pick = <T,>(items: readonly T[]): T => items[randomInt(0, items.length - 1)];

const pad = (value: number, size = 2): string => String(value).padStart(size, "0");

const slugify = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.+|\.+$/g, "");

const formatRg = (digits: string): string =>
  digits.replace(/(\d{2})(\d{3})(\d{3})(\d)/, "$1.$2.$3-$4");

const formatZip = (digits: string): string =>
  digits.replace(/(\d{5})(\d{3})/, "$1-$2");

const formatLandline = (ddd: string, digits: string): string =>
  `(${ddd}) ${digits.slice(0, 4)}-${digits.slice(4)}`;

const formatMobile = (ddd: string, digits: string): string =>
  `(${ddd}) ${digits.slice(0, 5)}-${digits.slice(5)}`;

const generateRgDigits = (): string => {
  let digits = "";
  for (let i = 0; i < 9; i += 1) {
    digits += String(randomInt(0, 9));
  }
  return digits;
};

const generateZipDigits = (state: BrazilianState): string => {
  const [start, end] = CEP_RANGES[state];
  const prefix = randomInt(start, end);
  const suffix = randomInt(0, 999);
  return `${String(prefix).padStart(5, "0")}${pad(suffix, 3)}`;
};

const resolveGender = (option: GenderOption): ResolvedGender => {
  if (option === "random") return pick(["male", "female"] as const);
  return option;
};

const buildName = (gender: ResolvedGender): { first: string; last: string; full: string } => {
  const first = pick(gender === "male" ? MALE_FIRST : FEMALE_FIRST);
  const lastA = pick(LAST_NAMES);
  const lastB = pick(LAST_NAMES.filter((name) => name !== lastA));
  const full = `${first} ${lastA} ${lastB}`;
  return { first, last: `${lastA} ${lastB}`, full };
};

const buildBirthDate = (age?: number): { date: Date; display: string } => {
  const today = new Date();
  const resolvedAge = age ?? randomInt(18, 70);
  const year = today.getFullYear() - resolvedAge;
  const month = randomInt(0, 11);
  const day = randomInt(1, 28);
  const date = new Date(year, month, day);
  const display = `${pad(day)}/${pad(month + 1)}/${year}`;
  return { date, display };
};

const getZodiacSign = (date: Date, lang: "pt" | "en"): string => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const entry of ZODIAC) {
    const [fromMonth, fromDay] = entry.from;
    const [toMonth, toDay] = entry.to;

    if (fromMonth === toMonth) {
      if (month === fromMonth && day >= fromDay && day <= toDay) {
        return lang === "pt" ? entry.pt : entry.en;
      }
      continue;
    }

    if (
      (month === fromMonth && day >= fromDay) ||
      (month === toMonth && day <= toDay)
    ) {
      return lang === "pt" ? entry.pt : entry.en;
    }
  }

  return lang === "pt" ? "Capricórnio" : "Capricorn";
};

const buildEmail = (first: string, last: string): string => {
  const local = `${slugify(first)}.${slugify(last.split(" ")[0] ?? "silva")}${randomInt(1, 999)}`;
  return `${local}@${pick(EMAIL_DOMAINS)}`;
};

const buildPhoneDigits = (withNine: boolean): string => {
  if (withNine) {
    return `9${randomInt(1000, 9999)}${randomInt(1000, 9999)}`;
  }
  return `${randomInt(2000, 4999)}${randomInt(1000, 9999)}`;
};

export const getCitiesForState = (state: BrazilianState): string[] =>
  CITIES_BY_STATE[state];

export const generatePerson = (options: PersonGeneratorOptions): GeneratedPerson => {
  const gender = resolveGender(options.gender);
  const state = options.state ?? pick(BRAZILIAN_STATES);
  const cities = CITIES_BY_STATE[state];
  const city =
    options.city && cities.includes(options.city) ? options.city : pick(cities);
  const { first, last, full } = buildName(gender);
  const { date, display: birthDate } = buildBirthDate(options.age);

  const cpfRaw = generateCpf();
  const rgRaw = generateRgDigits();
  const zipRaw = generateZipDigits(state);
  const ddd = pick(DDD_BY_STATE[state]);
  const landlineRaw = buildPhoneDigits(false);
  const mobileRaw = buildPhoneDigits(true);

  const motherFirst = pick(FEMALE_FIRST.filter((name) => name !== first));
  const fatherFirst = pick(MALE_FIRST);

  const heightCm = gender === "male" ? randomInt(165, 195) : randomInt(155, 180);
  const weightKg = randomInt(Math.max(50, heightCm - 80), Math.min(110, heightCm - 35));
  const color = pick(COLORS);

  const cpf = options.formatted ? formatCpf(cpfRaw) : cpfRaw;
  const rg = options.formatted ? formatRg(rgRaw) : rgRaw;
  const zipCode = options.formatted ? formatZip(zipRaw) : zipRaw;
  const phone = options.formatted
    ? formatLandline(ddd, landlineRaw)
    : `${ddd}${landlineRaw}`;
  const mobile = options.formatted
    ? formatMobile(ddd, mobileRaw)
    : `${ddd}${mobileRaw}`;

  return {
    name: full,
    cpf,
    rg,
    birthDate,
    gender,
    zodiacSign: getZodiacSign(date, options.lang),
    mother: `${motherFirst} ${last.split(" ")[0] ?? "Silva"}`,
    father: `${fatherFirst} ${last}`,
    email: buildEmail(first, last),
    password: generatePassword({
      length: 12,
      lowercase: true,
      uppercase: true,
      numbers: true,
      symbols: true,
      avoidSimilar: true,
    }),
    zipCode,
    street: pick(STREETS),
    number: String(randomInt(1, 9999)),
    neighborhood: pick(NEIGHBORHOODS),
    city,
    state,
    phone,
    mobile,
    height: options.lang === "pt" ? `${(heightCm / 100).toFixed(2).replace(".", ",")} m` : `${(heightCm / 100).toFixed(2)} m`,
    weight: options.lang === "pt" ? `${weightKg} kg` : `${weightKg} kg`,
    bloodType: pick(BLOOD_TYPES),
    favoriteColor: options.lang === "pt" ? color.pt : color.en,
  };
};

export const generatePeople = (options: PersonGeneratorOptions): GeneratedPerson[] => {
  const count = Math.min(Math.max(1, options.count), 30);
  return Array.from({ length: count }, () => generatePerson(options));
};
