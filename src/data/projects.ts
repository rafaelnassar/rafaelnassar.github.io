/**
 * Projetos selecionados — single source of truth.
 *
 * Consumido por:
 *   - src/components/Projects.tsx (seção do portfolio)
 *   - src/pages/CV.tsx (página /cv que vira PDF)
 */

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  /** Card destacado (paleta invertida no portfolio) */
  featured?: boolean;
  /** Badge curto exibido ao lado do título (ex: "Em desenvolvimento") */
  status?: string;
  /** Projeto interno/sob NDA — sem links públicos */
  internal?: boolean;
}

export const projects: Project[] = [
  {
    title: "Emittly",
    description:
      "SaaS de emissão fiscal sem ERP complicado. Cliente emite NFCe, NFe e MDFe direto do navegador, com pagamentos via Stripe e arquitetura em containers — API em PHP/Laravel com a biblioteca sped-nfe e front em React.",
    technologies: [
      "React",
      "PHP",
      "Laravel",
      "PostgreSQL",
      "Docker",
      "Stripe",
      "sped-nfe",
    ],
    featured: true,
    status: "Em desenvolvimento",
  },
  {
    title: "SecureVault",
    description:
      "Gerenciador de credenciais local-first com criptografia AES-256. Desenvolvido em Tauri para máxima performance desktop, focado em privacidade e segurança de chaves e ativos digitais.",
    technologies: ["React", "TypeScript", "Tauri", "Rust", "SQLite", "Tailwind"],
    githubUrl: "https://github.com/rafaelnassar/securevault",
  },
  {
    title: "Painel do Contador",
    description:
      "Resolve a coleta manual mensal de XMLs fiscais. Antes, o suporte precisava acessar a máquina de cada cliente e enviar os arquivos por e-mail ao contador. Agora um sincronizador em Node.js envia tudo direto para o Supabase Storage, e o contador baixa os documentos que precisar, quando precisar — sem depender de suporte nem do cliente.",
    technologies: ["React", "Node.js", "Supabase"],
    internal: true,
  },
  {
    title: "Ctrix Auto",
    description:
      "App mobile completo para oficinas mecânicas. Cobre orçamentos, ordens de serviço, aprovação por link e acompanhamento em tempo real pelo cliente da oficina — com módulo TV para sala de espera. Tudo integrado a um sistema legado de 20 anos.",
    technologies: ["React Native", "Expo", "Node.js", "PostgreSQL"],
    internal: true,
  },
];
