/**
 * Stack técnica — single source of truth.
 *
 * Consumido por:
 *   - src/components/Technologies.tsx (seção do portfolio com cards)
 *   - src/pages/CV.tsx (lista compacta na página /cv que vira PDF)
 *
 * IMPORTANTE: o componente Technologies precisa importar o ícone Lucide
 * correspondente a cada categoria. Como tipos de função não serializam bem
 * em "data only", o ícone é resolvido por nome aqui (string) e mapeado lá.
 */

export interface TechCategory {
  category: string;
  /** Nome do ícone Lucide React (case-sensitive) — ex: "Server", "Layout" */
  iconName: "Server" | "Layout" | "Smartphone" | "Database" | "Cloud";
  description: string;
  items: string[];
}

export const stack: TechCategory[] = [
  {
    category: "Back-End",
    iconName: "Server",
    description: "APIs, integrações e sistemas legados",
    items: ["Node.js", "AdonisJS", "PHP", "Laravel", "Delphi"],
  },
  {
    category: "Front-End",
    iconName: "Layout",
    description: "Interfaces modernas e performáticas",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind"],
  },
  {
    category: "Mobile",
    iconName: "Smartphone",
    description: "Apps nativos multiplataforma",
    items: ["React Native", "Expo"],
  },
  {
    category: "Bancos & Cache",
    iconName: "Database",
    description: "Persistência relacional e dados em memória",
    items: ["PostgreSQL", "MySQL", "MariaDB", "Redis"],
  },
  {
    category: "DevOps & Infra",
    iconName: "Cloud",
    description: "Deploy, observabilidade e administração de servidores",
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
