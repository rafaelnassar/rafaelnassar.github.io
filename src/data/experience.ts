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
      pt: "Liderei a entrega de quatro produtos integrados a um ERP Delphi de 20 anos sem reescrita: Ctrix Auto (app mobile pra oficinas mecânicas), Painel do Contador (eliminou coleta manual mensal de XMLs entre suporte e contadores), API interna de emissão MDFe e site institucional. Stack em uso: React, React Native, Node.js/AdonisJS, PostgreSQL, Docker e infraestrutura Linux/Windows.",
      en: "Led delivery of four products integrated with a 20-year-old Delphi ERP without a rewrite: Ctrix Auto (mobile app for auto repair shops), Accountant Panel (eliminated monthly manual XML collection between support and accountants), an internal MDFe e-invoice API, and the company's institutional website. Stack in use: React, React Native, Node.js/AdonisJS, PostgreSQL, Docker, and Linux/Windows infrastructure.",
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
      pt: "Atuei além do escopo de chamados: escrevi rotinas em Delphi, modelei e mantive bancos de clientes (PostgreSQL), emiti e gerenciei certificados digitais ICP-Brasil e cuidei da infraestrutura Linux/Windows. Ciclo serviu de ponte para a transição a engenheiro de software na mesma empresa.",
      en: "Worked beyond the standard ticket scope: wrote Delphi routines, modeled and maintained client databases (PostgreSQL), issued and managed ICP-Brasil digital certificates, and handled Linux/Windows infrastructure. This phase served as the bridge to my move into software engineering at the same company.",
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
      pt: "Iniciei do zero o sistema web corporativo da empresa — que ao final do meu ciclo já emitia NFe em produção. Construí APIs em Node.js/Express, app de força de vendas em React Native e administrei servidores para serviços internos. Entreguei também o site institucional (listado em Clientes).",
      en: "Bootstrapped the company's corporate web system from scratch — by the end of my tenure it was already issuing NFe e-invoices in production. Built APIs in Node.js/Express, a field-sales mobile app in React Native, and administered servers for internal services. Also delivered the institutional website (listed under Clients).",
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
      pt: "Iniciei carreira no suporte N1 de ERP legado: resolvi chamados de emissão fiscal e dúvidas de uso, fiz correções diretas em banco (Firebird) e conduzi implantações on-site, com treinamento de usuários e manutenção de máquinas/rede. Primeiro contato sério com emissão fiscal NFCe — base do nicho que sigo até hoje.",
      en: "Started my career in L1 support for a legacy ERP: resolved tax-compliance tickets, handled usage questions, made direct database fixes (Firebird), and led on-site deployments with user training and machine/network maintenance. First serious exposure to NFCe e-invoicing — the foundation of the niche I've stayed in since.",
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
