/**
 * Experiência profissional — single source of truth.
 *
 * Consumido por:
 *   - src/components/Experience.tsx (seção do portfolio)
 *   - src/pages/CV.tsx (página /cv que vira PDF)
 *
 * Editar aqui propaga para ambos.
 */

export interface ExperienceEntry {
  period: string;
  title: string;
  company: string;
  location: string;
  description: string;
  tags: string[];
}

export const experiences: ExperienceEntry[] = [
  {
    period: "Jan 2026 — Presente",
    title: "Engenheiro de Software",
    company: "FG Sistema e Informática",
    location: "Cuiabá, MT",
    description:
      "Construí o Ctrix Auto, o Painel do Contador, uma API interna de emissão MDFe e o site institucional da empresa. Stack completa em uso: web, mobile, APIs, integração com sistema legado em Delphi e infraestrutura Linux/Windows.",
    tags: [
      "React",
      "React Native",
      "Node.js",
      "AdonisJS",
      "Delphi",
      "PostgreSQL",
      "Docker",
      "MDFe",
    ],
  },
  {
    period: "Jan 2024 — Jan 2026",
    title: "Suporte N2",
    company: "FG Sistema e Informática",
    location: "Cuiabá, MT",
    description:
      "Suporte N2 com escopo técnico ampliado: rotinas em Delphi, modelagem e manutenção de bancos de dados de clientes, emissão de certificados digitais e infraestrutura — além do atendimento tradicional de chamados.",
    tags: [
      "Suporte N2",
      "Delphi",
      "PostgreSQL",
      "SQL",
      "Certificados Digitais",
    ],
  },
  {
    period: "Jul 2021 — Jan 2024",
    title: "Engenheiro de Software",
    company: "Cacttus Brasil",
    location: "Cuiabá, MT",
    description:
      "Construí APIs em Node.js/Express, app de força de vendas em React Native e configurei servidores para serviços internos. Iniciei do zero o sistema web corporativo da empresa — que ao fim do meu período já emitia NFe. Também entreguei o site institucional (presente em Clientes).",
    tags: ["Node.js", "Express", "React Native", "React", "PostgreSQL", "NFe"],
  },
  {
    period: "Jan 2019 — Jun 2021",
    title: "Analista de Suporte",
    company: "UNIBRASIL Sistemas",
    location: "Cuiabá, MT",
    description:
      "Suporte N1 para sistema legado de gestão. Resolução de chamados de emissão fiscal, dúvidas de uso e correções diretas em banco de dados. Conduzia implantação no cliente, treinamento e manutenção de máquinas e rede.",
    tags: [
      "Suporte N1",
      "Emissão fiscal",
      "Firebird",
      "Implantação",
      "Infraestrutura",
    ],
  },
];
