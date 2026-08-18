import { BRAZILIAN_STATES, type BrazilianState } from "@/lib/tools/person";

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
  AC: ["Rio Branco", "Cruzeiro do Sul"],
  AL: ["Maceió", "Arapiraca"],
  AM: ["Manaus", "Parintins"],
  AP: ["Macapá", "Santana"],
  BA: ["Salvador", "Feira de Santana", "Vitória da Conquista"],
  CE: ["Fortaleza", "Juazeiro do Norte"],
  DF: ["Brasília"],
  ES: ["Vitória", "Vila Velha", "Serra"],
  GO: ["Goiânia", "Aparecida de Goiânia"],
  MA: ["São Luís", "Imperatriz"],
  MG: ["Belo Horizonte", "Uberlândia", "Contagem"],
  MS: ["Campo Grande", "Dourados"],
  MT: ["Cuiabá", "Várzea Grande"],
  PA: ["Belém", "Ananindeua"],
  PB: ["João Pessoa", "Campina Grande"],
  PE: ["Recife", "Jaboatão dos Guararapes"],
  PI: ["Teresina", "Parnaíba"],
  PR: ["Curitiba", "Londrina", "Maringá"],
  RJ: ["Rio de Janeiro", "Niterói", "Duque de Caxias"],
  RN: ["Natal", "Mossoró"],
  RO: ["Porto Velho", "Ji-Paraná"],
  RR: ["Boa Vista"],
  RS: ["Porto Alegre", "Caxias do Sul", "Pelotas"],
  SC: ["Florianópolis", "Joinville", "Blumenau"],
  SE: ["Aracaju"],
  SP: ["São Paulo", "Campinas", "Santos", "Guarulhos"],
  TO: ["Palmas", "Araguaína"],
};

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomItem = <T,>(items: readonly T[]): T =>
  items[randomInt(0, items.length - 1)];

const randomDigits = (count: number): string =>
  Array.from({ length: count }, () => randomInt(0, 9)).join("");

export interface GeneratedCep {
  cep: string;
  formatted: string;
  street: string;
  neighborhood: string;
  city: string;
  state: BrazilianState;
}

export interface CepGeneratorOptions {
  state?: BrazilianState;
  formatted?: boolean;
}

export const generateCep = (options: CepGeneratorOptions = {}): GeneratedCep => {
  const state = options.state ?? randomItem(BRAZILIAN_STATES);
  const city = randomItem(CITIES_BY_STATE[state]);
  const raw = randomDigits(8);
  const formatted = `${raw.slice(0, 5)}-${raw.slice(5)}`;

  return {
    cep: raw,
    formatted,
    street: randomItem(STREETS),
    neighborhood: randomItem(NEIGHBORHOODS),
    city,
    state,
  };
};

export { BRAZILIAN_STATES };
