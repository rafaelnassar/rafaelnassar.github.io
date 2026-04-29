/**
 * Stack técnica — fonte única bilíngue.
 *
 * - category, description: traduzidas
 * - iconName, items (nomes de tecnologia): invariáveis
 */

export interface TechCategory {
  category: { pt: string; en: string };
  iconName: "Server" | "Layout" | "Smartphone" | "Database" | "Cloud";
  description: { pt: string; en: string };
  items: string[];
}

export const stack: TechCategory[] = [
  {
    category: { pt: "Back-End", en: "Back-End" },
    iconName: "Server",
    description: {
      pt: "APIs, integrações e sistemas legados",
      en: "APIs, integrations and legacy systems",
    },
    items: ["Node.js", "AdonisJS", "PHP", "Laravel", "Delphi"],
  },
  {
    category: { pt: "Front-End", en: "Front-End" },
    iconName: "Layout",
    description: {
      pt: "Interfaces modernas e performáticas",
      en: "Modern, performant interfaces",
    },
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind"],
  },
  {
    category: { pt: "Mobile", en: "Mobile" },
    iconName: "Smartphone",
    description: {
      pt: "Apps nativos multiplataforma",
      en: "Cross-platform native apps",
    },
    items: ["React Native", "Expo"],
  },
  {
    category: { pt: "Bancos de dados", en: "Databases" },
    iconName: "Database",
    description: {
      pt: "Relacionais e em memória",
      en: "Relational and in-memory",
    },
    items: ["PostgreSQL", "MySQL", "MariaDB", "Redis"],
  },
  {
    category: { pt: "DevOps & Infra", en: "DevOps & Infra" },
    iconName: "Cloud",
    description: {
      pt: "Servidores, deploy e monitoramento",
      en: "Servers, deployment and monitoring",
    },
    items: [
      "Docker",
      "AWS",
      "Supabase",
      "Linux",
      "Windows Server",
      "Git",
      "Sentry",
    ],
  },
];
