import { BRAZILIAN_STATES, type BrazilianState } from "@/lib/tools/person";

export interface VehicleBrand {
  id: string;
  label: string;
  models: string[];
}

export const VEHICLE_BRANDS: VehicleBrand[] = [
  { id: "fiat", label: "Fiat", models: ["Uno", "Palio", "Strada", "Toro", "Mobi", "Argo"] },
  { id: "vw", label: "Volkswagen", models: ["Gol", "Polo", "Virtus", "T-Cross", "Nivus", "Amarok"] },
  { id: "chevrolet", label: "Chevrolet", models: ["Onix", "Tracker", "S10", "Spin", "Cruze", "Montana"] },
  { id: "ford", label: "Ford", models: ["Ka", "Ranger", "EcoSport", "Focus", "Fusion", "Maverick"] },
  { id: "toyota", label: "Toyota", models: ["Corolla", "Hilux", "Yaris", "SW4", "RAV4", "Etios"] },
  { id: "honda", label: "Honda", models: ["Civic", "City", "HR-V", "Fit", "WR-V", "CR-V"] },
  { id: "hyundai", label: "Hyundai", models: ["HB20", "Creta", "Tucson", "ix35", "Azera", "Santa Fe"] },
  { id: "renault", label: "Renault", models: ["Kwid", "Sandero", "Duster", "Logan", "Captur", "Oroch"] },
  { id: "nissan", label: "Nissan", models: ["Kicks", "Versa", "Frontier", "March", "Sentra", "Leaf"] },
  { id: "jeep", label: "Jeep", models: ["Renegade", "Compass", "Commander", "Wrangler", "Grand Cherokee"] },
];

const COLORS = [
  "Branco", "Preto", "Prata", "Cinza", "Vermelho", "Azul", "Verde", "Bege", "Marrom", "Amarelo",
];

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomItem = <T,>(items: readonly T[]): T =>
  items[randomInt(0, items.length - 1)];

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";

const generateMercosulPlate = (): string => {
  const l = () => LETTERS[randomInt(0, 25)];
  const d = () => DIGITS[randomInt(0, 9)];
  return `${l()}${l()}${l()}${d()}${l()}${d()}${d()}`;
};

const generateLegacyPlate = (): string => {
  const l = () => LETTERS[randomInt(0, 25)];
  const d = () => DIGITS[randomInt(0, 9)];
  return `${l()}${l()}${l()}-${d()}${d()}${d()}${d()}`;
};

const generateRenavam = (): string => {
  const base = Array.from({ length: 10 }, () => randomInt(0, 9)).join("");
  const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const sum = base.split("").reduce((acc, digit, index) => acc + Number(digit) * weights[index], 0);
  const check = (sum * 10) % 11;
  return base + (check === 10 ? 0 : check);
};

export interface GeneratedVehicle {
  brand: string;
  model: string;
  year: number;
  renavam: string;
  plate: string;
  color: string;
  state: BrazilianState;
}

export interface VehicleGeneratorOptions {
  state?: BrazilianState;
  brandId?: string;
  formatted?: boolean;
  mercosul?: boolean;
}

export const generateVehicle = (options: VehicleGeneratorOptions = {}): GeneratedVehicle => {
  const brandEntry =
    VEHICLE_BRANDS.find((item) => item.id === options.brandId) ?? randomItem(VEHICLE_BRANDS);
  const rawPlate = options.mercosul === false ? generateLegacyPlate() : generateMercosulPlate();
  const renavam = generateRenavam();

  return {
    brand: brandEntry.label,
    model: randomItem(brandEntry.models),
    year: randomInt(2012, new Date().getFullYear()),
    renavam: options.formatted ? renavam : renavam,
    plate: rawPlate,
    color: randomItem(COLORS),
    state: options.state ?? randomItem(BRAZILIAN_STATES),
  };
};

export { BRAZILIAN_STATES };
