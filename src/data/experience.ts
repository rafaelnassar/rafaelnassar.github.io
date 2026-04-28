/**
 * Experiência profissional — fonte única bilíngue.
 *
 * Campos com tradução: period, title, location, description.
 * Campos invariáveis: company (nome próprio) e tags (tech).
 *
 * Consumido por:
 *   - src/components/Experience.tsx (portfolio)
 *   - src/pages/CV.tsx (página /cv → PDF)
 *
 * Acesso: `entry.title[lang]` etc.
 */

export interface ExperienceEntry {
  period: { pt: string; en: string };
  title: { pt: string; en: string };
  company: string;
  location: { pt: string; en: string };
  description: { pt: string; en: string };
  tags: string[];
}

export const experiences: ExperienceEntry[] = [
  {
    period: {
      pt: "Jan 2026 — Presente",
      en: "Jan 2026 — Present",
    },
    title: {
      pt: "Engenheiro de Software",
      en: "Software Engineer",
    },
    company: "FG Sistema e Informática",
    location: {
      pt: "Cuiabá, MT",
      en: "Cuiabá, MT, Brazil",
    },
    description: {
      pt: "Construí o Ctrix Auto, o Painel do Contador, uma API interna de emissão MDFe e o site institucional da empresa. Stack completa em uso: web, mobile, APIs, integração com sistema legado em Delphi e infraestrutura Linux/Windows.",
      en: "Built Ctrix Auto, the Accountant Panel, an internal MDFe e-invoice API, and the company's institutional website. Full stack in use: web, mobile, APIs, integration with a legacy Delphi system, and Linux/Windows infrastructure.",
    },
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
    period: {
      pt: "Jan 2024 — Jan 2026",
      en: "Jan 2024 — Jan 2026",
    },
    title: {
      pt: "Suporte N2",
      en: "L2 Technical Support",
    },
    company: "FG Sistema e Informática",
    location: {
      pt: "Cuiabá, MT",
      en: "Cuiabá, MT, Brazil",
    },
    description: {
      pt: "Suporte N2 com escopo técnico ampliado: rotinas em Delphi, modelagem e manutenção de bancos de dados de clientes, emissão de certificados digitais e infraestrutura — além do atendimento tradicional de chamados.",
      en: "L2 support with extended technical scope: Delphi routines, database design and maintenance for client systems, digital certificate issuance, and infrastructure — beyond the traditional ticket handling.",
    },
    tags: [
      "Suporte N2",
      "Delphi",
      "PostgreSQL",
      "SQL",
      "Certificados Digitais",
    ],
  },
  {
    period: {
      pt: "Jul 2021 — Jan 2024",
      en: "Jul 2021 — Jan 2024",
    },
    title: {
      pt: "Engenheiro de Software",
      en: "Software Engineer",
    },
    company: "Cacttus Brasil",
    location: {
      pt: "Cuiabá, MT",
      en: "Cuiabá, MT, Brazil",
    },
    description: {
      pt: "Construí APIs em Node.js/Express, app de força de vendas em React Native e configurei servidores para serviços internos. Iniciei do zero o sistema web corporativo da empresa — que ao fim do meu período já emitia NFe. Também entreguei o site institucional (presente em Clientes).",
      en: "Built APIs in Node.js/Express, a field-sales mobile app in React Native, and configured servers for internal services. Bootstrapped the company's corporate web system from scratch — which by the end of my tenure was already issuing NFe e-invoices. I also delivered the institutional website (listed under Clients).",
    },
    tags: ["Node.js", "Express", "React Native", "React", "PostgreSQL", "NFe"],
  },
  {
    period: {
      pt: "Jan 2019 — Jun 2021",
      en: "Jan 2019 — Jun 2021",
    },
    title: {
      pt: "Analista de Suporte",
      en: "Support Analyst",
    },
    company: "UNIBRASIL Sistemas",
    location: {
      pt: "Cuiabá, MT",
      en: "Cuiabá, MT, Brazil",
    },
    description: {
      pt: "Suporte N1 para sistema legado de gestão. Resolução de chamados de emissão fiscal, dúvidas de uso e correções diretas em banco de dados. Conduzia implantação no cliente, treinamento e manutenção de máquinas e rede.",
      en: "L1 support for a legacy management system. Resolved tax-compliance tickets, usage questions, and direct database fixes. Led on-site deployment, end-user training, and machine/network maintenance.",
    },
    tags: [
      "Suporte N1",
      "Emissão fiscal",
      "Firebird",
      "Implantação",
      "Infraestrutura",
    ],
  },
];
