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
      pt: "Promovido a programador depois de cumprir os requisitos durante o ciclo no N2. Atualmente responsável pelo setor mobile e web da empresa: Ctrix Auto (app pra oficinas), Painel do Contador (automação da coleta mensal de XMLs entre suporte e contador), uma API interna de emissão fiscal (MDFe, NFCe e NFe) e o site institucional (listado em Clientes). Uso Delphi quando preciso integrar com o ERP existente.",
      en: "Promoted to developer after meeting the requirements during my L2 phase. Currently responsible for the mobile and web sector: Ctrix Auto (auto shop app), Accountant Panel (automated monthly XML collection between support and accountant), an internal e-invoicing API (MDFe, NFCe and NFe) and the institutional website (listed under Clients). I work with Delphi when integration with the existing ERP is needed.",
    },
    tags: [
      "React",
      "React Native",
      "Node.js",
      "AdonisJS",
      "Delphi",
      "MySQL",
      "Docker",
      "NFCe",
      "NFe",
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
      pt: "Atuei também como supervisor da equipe de suporte. Trabalho misto entre suporte, programação e infra: ajustes em rotinas Delphi pra corrigir fluxos do sistema, manutenção de bancos MySQL legados (4.1, com alguns clientes ainda em 4.0), servidores e redes nos clientes, manutenção de hardware e atendimento direto. Os atendimentos e implantações mais complexos geralmente passavam por mim.",
      en: "Also acted as supervisor of the support team. Mixed work between support, programming and infra: Delphi routine adjustments to fix system flows, maintenance of legacy MySQL databases (4.1, with some clients still on 4.0), server and network configuration at customer sites, hardware maintenance and direct customer support. The more complex tickets and deployments usually came to me.",
    },
    tags: [
      "Suporte N2",
      "Delphi",
      "MySQL",
      "Linux",
      "Implantação",
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
      pt: "Primeira posição como programador full-time, depois de uma fase como freelancer fazendo sites e apps simples sob demanda. Trabalhei no sistema web corporativo da empresa (Node.js/Express + React), que durante esse período passou a emitir NFe em produção. Também desenvolvi um app de força de vendas em React Native e o site institucional (listado em Clientes).",
      en: "First full-time developer position, after a phase as a freelancer building simple websites and on-demand apps. Worked on the company's corporate web system (Node.js/Express + React), which during this period started issuing NFe e-invoices in production. Also built a React Native field-sales app and the institutional website (listed under Clients).",
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
      pt: "Primeira experiência profissional, depois de estudos autodidatas. Atendimento N1 de ERP legado: chamados de uso, dúvidas dos clientes e correções pontuais em banco (Firebird). Acompanhei implantações on-site e ajudei em treinamentos de usuários. O sistema lidava com NFCe, NFe e SPED fiscal — meu primeiro contato com emissão fiscal na prática.",
      en: "First professional role after self-taught studies. L1 support for a legacy ERP: usage tickets, customer questions and occasional database fixes (Firebird). Joined on-site deployments and helped with user training. The system handled NFCe, NFe and SPED — my first hands-on with Brazilian tax compliance.",
    },
    tags: [
      "Suporte N1",
      "Firebird",
      "NFCe",
      "NFe",
      "SPED",
      "Implantação",
      "Infraestrutura",
    ],
  },
];
