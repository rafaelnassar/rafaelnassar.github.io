import type { LucideIcon } from "lucide-react";
import {
  Braces,
  Car,
  CreditCard,
  Database,
  Disc3,
  FileKey2,
  Fingerprint,
  Gauge,
  Globe,
  Hash,
  IdCard,
  KeyRound,
  List,
  MapPin,
  Monitor,
  Palette,
  Phone,
  QrCode,
  Scale,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Tags,
  Timer,
  Type,
  UserRound,
  WholeWord,
} from "lucide-react";

export type ToolCategory =
  | "geradores"
  | "validadores"
  | "texto"
  | "sorteios"
  | "codigo"
  | "sistema";

export interface LabTool {
  slug: string;
  icon: LucideIcon;
  category: ToolCategory;
  title: { pt: string; en: string };
  summary: { pt: string; en: string };
  tags: string[];
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  "geradores",
  "validadores",
  "texto",
  "sorteios",
  "codigo",
  "sistema",
];

export const DEFAULT_TOOL_CATEGORY: ToolCategory = "geradores";

/** URLs antigas caem na aba equivalente. */
export const LEGACY_TOOL_CATEGORIES: Record<string, ToolCategory> = {
  brasil: "geradores",
  cadastros: "geradores",
  generator: "geradores",
  validator: "validadores",
  utility: "sorteios",
  dev: "codigo",
};

export const isToolCategory = (value: string | null): value is ToolCategory =>
  TOOL_CATEGORIES.includes(value as ToolCategory);

export const resolveToolCategory = (value: string | null): ToolCategory => {
  if (isToolCategory(value)) return value;
  if (value && value in LEGACY_TOOL_CATEGORIES) return LEGACY_TOOL_CATEGORIES[value];
  return DEFAULT_TOOL_CATEGORY;
};

export const tools: LabTool[] = [
  {
    slug: "gerador-de-pessoa",
    category: "geradores",
    icon: UserRound,
    title: { pt: "Gerador de pessoa", en: "Person generator" },
    summary: {
      pt: "Nome, CPF, RG, endereço, telefone, e-mail e mais — dados fictícios para QA.",
      en: "Name, CPF, ID, address, phone, email and more — fake data for QA.",
    },
    tags: ["Brasil", "QA"],
  },
  {
    slug: "gerador-cpf-cnpj",
    category: "geradores",
    icon: IdCard,
    title: { pt: "Gerador CPF / CNPJ", en: "CPF / CNPJ generator" },
    summary: {
      pt: "Gera CPFs e CNPJs com dígitos verificadores válidos — só para testes de software.",
      en: "Generates CPFs and CNPJs with valid check digits — for software testing only.",
    },
    tags: ["Brasil", "QA"],
  },
  {
    slug: "validador-cpf-cnpj",
    category: "validadores",
    icon: FileKey2,
    title: { pt: "Validador CPF / CNPJ", en: "CPF / CNPJ validator" },
    summary: {
      pt: "Valida dígitos verificadores e rejeita sequências repetidas.",
      en: "Validates check digits and rejects repeated sequences.",
    },
    tags: ["Brasil", "Validação"],
  },
  {
    slug: "gerador-telefone",
    category: "geradores",
    icon: Phone,
    title: { pt: "Gerador de telefone", en: "Phone generator" },
    summary: {
      pt: "Telefones fixos e celulares com DDD por estado — formatados ou só dígitos.",
      en: "Landline and mobile numbers with area code by state — formatted or digits only.",
    },
    tags: ["Brasil", "QA"],
  },
  {
    slug: "gerador-cep",
    category: "geradores",
    icon: MapPin,
    title: { pt: "Gerador de CEP", en: "ZIP code generator" },
    summary: {
      pt: "CEP com endereço fictício por estado — ideal para formulários e cadastros de teste.",
      en: "ZIP code with fake address by state — ideal for test forms and registrations.",
    },
    tags: ["Brasil", "QA"],
  },
  {
    slug: "gerador-veiculos",
    category: "geradores",
    icon: Car,
    title: { pt: "Gerador de veículos", en: "Vehicle generator" },
    summary: {
      pt: "Placa Mercosul, RENAVAM, marca, modelo, ano e cor — dados fictícios para QA.",
      en: "Mercosul plate, RENAVAM, brand, model, year and color — fake data for QA.",
    },
    tags: ["Brasil", "QA"],
  },
  {
    slug: "gerador-cartao-credito",
    category: "geradores",
    icon: CreditCard,
    title: { pt: "Gerador de cartão", en: "Credit card generator" },
    summary: {
      pt: "Números válidos por bandeira (Visa, Master, Amex…) com validade e CVV — só para testes.",
      en: "Valid numbers by brand (Visa, Master, Amex…) with expiry and CVV — testing only.",
    },
    tags: ["QA", "Pagamentos"],
  },
  {
    slug: "validador-cartao-credito",
    category: "validadores",
    icon: CreditCard,
    title: { pt: "Validador de cartão", en: "Credit card validator" },
    summary: {
      pt: "Verifica número por bandeira com algoritmo de Luhn — só validação estrutural.",
      en: "Checks number by brand with the Luhn algorithm — structural validation only.",
    },
    tags: ["Pagamentos", "Validação"],
  },
  {
    slug: "numero-por-extenso",
    category: "texto",
    icon: Hash,
    title: { pt: "Número por extenso", en: "Number to words" },
    summary: {
      pt: "Converte valores monetários ou números simples para texto por extenso.",
      en: "Converts monetary values or plain numbers to words.",
    },
    tags: ["Texto", "Brasil"],
  },
  {
    slug: "sorteador",
    category: "sorteios",
    icon: Shuffle,
    title: { pt: "Sorteador de números", en: "Number raffle" },
    summary: {
      pt: "Sorteia um ou mais números num intervalo, com rolagem animada até o resultado.",
      en: "Draws one or more numbers in a range, with a rolling animation to the result.",
    },
    tags: ["QA", "Social"],
  },
  {
    slug: "sorteador-lista",
    category: "sorteios",
    icon: List,
    title: { pt: "Sorteador de lista", en: "List raffle" },
    summary: {
      pt: "Cole nomes separados por vírgula e sorteie um ou mais — cada item vira um chip.",
      en: "Paste comma-separated names and draw one or more — each item becomes a chip.",
    },
    tags: ["QA", "Social"],
  },
  {
    slug: "sorteador-roleta",
    category: "sorteios",
    icon: Disc3,
    title: { pt: "Roleta", en: "Prize wheel" },
    summary: {
      pt: "Roleta visual que gira e para no sorteado. Ideal para lives e promoções.",
      en: "A visual wheel that spins and lands on a winner. Ideal for streams and promos.",
    },
    tags: ["Social", "Live"],
  },
  {
    slug: "sorteador-contagem",
    category: "sorteios",
    icon: Timer,
    title: { pt: "Sorteio com contagem", en: "Countdown draw" },
    summary: {
      pt: "3, 2, 1 na tela cheia — e o nome sorteado aparece em seguida.",
      en: "3, 2, 1 on screen — then the drawn name lands.",
    },
    tags: ["Social", "Live"],
  },
  {
    slug: "lorem",
    category: "geradores",
    icon: Type,
    title: { pt: "Gerador de Lorem Ipsum", en: "Lorem Ipsum generator" },
    summary: {
      pt: "Texto de preenchimento em latim, português ou inglês — parágrafos, frases ou palavras.",
      en: "Filler text in Latin, Portuguese, or English — paragraphs, sentences, or words.",
    },
    tags: ["Copy", "QA"],
  },
  {
    slug: "conversor-de-texto",
    category: "texto",
    icon: Type,
    title: { pt: "Conversor de texto", en: "Case converter" },
    summary: {
      pt: "camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE e slug.",
      en: "camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE and slug.",
    },
    tags: ["Texto"],
  },
  {
    slug: "contador-de-texto",
    category: "texto",
    icon: WholeWord,
    title: { pt: "Contador de texto", en: "Text counter" },
    summary: {
      pt: "Caracteres, palavras, linhas e bytes UTF-8 em tempo real.",
      en: "Characters, words, lines and UTF-8 bytes in real time.",
    },
    tags: ["Texto"],
  },
  {
    slug: "textos-fontes-personalizadas",
    category: "texto",
    icon: Sparkles,
    title: { pt: "Fontes personalizadas", en: "Fancy text" },
    summary: {
      pt: "Transforma texto em estilos Unicode para nicks, bios e status.",
      en: "Transforms text into Unicode styles for nicks, bios and statuses.",
    },
    tags: ["Texto", "Social"],
  },
  {
    slug: "gerador-de-senha",
    category: "geradores",
    icon: KeyRound,
    title: { pt: "Gerador de senha", en: "Password generator" },
    summary: {
      pt: "Senhas aleatórias com comprimento, símbolos e exclusão de caracteres semelhantes.",
      en: "Random passwords with length, symbols, and look-alike character exclusion.",
    },
    tags: ["Segurança", "Crypto"],
  },
  {
    slug: "verificador-de-senha",
    category: "validadores",
    icon: ShieldCheck,
    title: { pt: "Verificador de senha", en: "Password checker" },
    summary: {
      pt: "Confere se a senha já vazou, via API gratuita do Have I Been Pwned (k-anonymity).",
      en: "Checks whether a password was leaked, using the free Have I Been Pwned API (k-anonymity).",
    },
    tags: ["HIBP", "Segurança"],
  },
  {
    slug: "gerador-de-uuid",
    category: "geradores",
    icon: Fingerprint,
    title: { pt: "Gerador de UUID", en: "UUID generator" },
    summary: {
      pt: "UUIDv4 criptograficamente aleatório, no seu navegador.",
      en: "Cryptographically random UUIDv4, in your browser.",
    },
    tags: ["Dev", "IDs"],
  },
  {
    slug: "formatador-json",
    category: "codigo",
    icon: Braces,
    title: { pt: "Formatador JSON", en: "JSON formatter" },
    summary: {
      pt: "Valida, indenta e minifica JSON com mensagem de erro clara.",
      en: "Validate, pretty-print and minify JSON with a clear error message.",
    },
    tags: ["JSON", "Dev"],
  },
  {
    slug: "formatador-sql",
    category: "codigo",
    icon: Database,
    title: { pt: "Formatador SQL", en: "SQL formatter" },
    summary: {
      pt: "Indenta e minifica SQL, com palavras-chave em maiúsculas e erro claro.",
      en: "Pretty-print and minify SQL, with uppercase keywords and a clear error message.",
    },
    tags: ["SQL", "Dev"],
  },
  {
    slug: "jwt",
    category: "codigo",
    icon: FileKey2,
    title: { pt: "Decodificador JWT", en: "JWT decoder" },
    summary: {
      pt: "Lê header e payload. Não verifica assinatura — só inspeção.",
      en: "Reads header and payload. Does not verify the signature — inspection only.",
    },
    tags: ["Auth", "Dev"],
  },
  {
    slug: "gerador-qrcode",
    category: "geradores",
    icon: QrCode,
    title: { pt: "Gerador de QR Code", en: "QR Code generator" },
    summary: {
      pt: "Gera QR Code a partir de URL ou texto, com download em PNG.",
      en: "Generates QR codes from URL or text, with PNG download.",
    },
    tags: ["Web", "Dev"],
  },
  {
    slug: "gerador-meta-tags",
    category: "geradores",
    icon: Tags,
    title: { pt: "Gerador de meta tags", en: "Meta tags generator" },
    summary: {
      pt: "Monta title, description, keywords e Open Graph com contador de caracteres.",
      en: "Builds title, description, keywords and Open Graph with character counts.",
    },
    tags: ["SEO", "Web"],
  },
  {
    slug: "conversor-de-cor",
    category: "codigo",
    icon: Palette,
    title: { pt: "Conversor de cor", en: "Color converter" },
    summary: {
      pt: "HEX, RGB e HSL com color picker, pré-visualização e contraste visível.",
      en: "HEX, RGB and HSL with color picker, preview and visible contrast.",
    },
    tags: ["CSS", "Design"],
  },
  {
    slug: "meu-ip",
    category: "sistema",
    icon: Globe,
    title: { pt: "Meu IP", en: "My IP" },
    summary: {
      pt: "Mostra seu endereço IP público atual via consulta externa.",
      en: "Shows your current public IP address via an external lookup.",
    },
    tags: ["Rede", "Dev"],
  },
  {
    slug: "meu-navegador",
    category: "sistema",
    icon: Monitor,
    title: { pt: "Meu navegador", en: "My browser" },
    summary: {
      pt: "Nome, versão, idioma e user agent detectados no seu dispositivo.",
      en: "Name, version, language and user agent detected on your device.",
    },
    tags: ["Dev", "Debug"],
  },
  {
    slug: "meu-sistema-operacional",
    category: "sistema",
    icon: Monitor,
    title: { pt: "Meu sistema operacional", en: "My operating system" },
    summary: {
      pt: "SO, versão, núcleos, memória e suporte a toque do seu dispositivo.",
      en: "OS, version, cores, memory and touch support on your device.",
    },
    tags: ["Dev", "Debug"],
  },
  {
    slug: "teste-de-velocidade",
    category: "sistema",
    icon: Gauge,
    title: { pt: "Teste de velocidade", en: "Speed test" },
    summary: {
      pt: "Ping, download e upload com o motor oficial da Cloudflare, no ponto de presença mais próximo.",
      en: "Ping, download and upload with Cloudflare’s official engine, at the nearest point of presence.",
    },
    tags: ["Rede", "Dev"],
  },
  {
    slug: "rescisao-contrato",
    category: "sistema",
    icon: Scale,
    title: { pt: "Rescisão de contrato", en: "Contract termination" },
    summary: {
      pt: "Estimativa de acerto trabalhista: saldo, férias, 13º, aviso e multa FGTS.",
      en: "Labor severance estimate: balance, vacation, bonus, notice and FGTS fine.",
    },
    tags: ["Brasil", "RH"],
  },
];

export const TOOLS_PER_PAGE = 4;

export const getToolsByCategory = (category: ToolCategory): LabTool[] =>
  tools.filter((tool) => tool.category === category);

export const getToolBySlug = (slug: string): LabTool | undefined =>
  tools.find((tool) => tool.slug === slug);

export const getToolsPageCount = (category?: ToolCategory): number => {
  const list = category ? getToolsByCategory(category) : tools;
  return Math.max(1, Math.ceil(list.length / TOOLS_PER_PAGE));
};

export const getToolsForPage = (page: number, category?: ToolCategory): LabTool[] => {
  const list = category ? getToolsByCategory(category) : tools;
  const total = Math.max(1, Math.ceil(list.length / TOOLS_PER_PAGE));
  const safePage = Math.min(Math.max(1, page), total);
  const start = (safePage - 1) * TOOLS_PER_PAGE;
  return list.slice(start, start + TOOLS_PER_PAGE);
};

export const LABS_RESERVED_SLUGS = ["ferramentas", "scripts", "docs"] as const;
