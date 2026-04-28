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
    category: { pt: "Bancos & Cache", en: "Databases & Cache" },
    iconName: "Database",
    description: {
      pt: "Persistência relacional e dados em memória",
      en: "Relational persistence and in-memory data",
    },
    items: ["PostgreSQL", "MySQL", "MariaDB", "Redis"],
  },
  {
    category: { pt: "DevOps & Infra", en: "DevOps & Infra" },
    iconName: "Cloud",
    description: {
      pt: "Deploy, observabilidade e administração de servidores",
      en: "Deployment, observability and server administration",
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
