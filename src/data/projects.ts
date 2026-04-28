/**
 * Projetos selecionados — fonte única bilíngue.
 *
 * - description: { pt, en } — tradução completa
 * - title, technologies, URLs: invariáveis (nomes próprios)
 * - status: opcional, badge curto exibido ao lado do título — bilíngue
 */

export interface Project {
  title: string;
  description: { pt: string; en: string };
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  /** Card destacado (paleta invertida no portfolio) */
  featured?: boolean;
  /** Badge curto exibido ao lado do título */
  status?: { pt: string; en: string };
  /** Projeto interno/sob NDA — sem links públicos */
  internal?: boolean;
}

export const projects: Project[] = [
  {
    title: "Emittly",
    description: {
      pt: "SaaS de emissão fiscal sem ERP complicado. Cliente emite NFCe, NFe e MDFe direto do navegador, com pagamentos via Stripe e arquitetura em containers — API em PHP/Laravel com a biblioteca sped-nfe e front em React.",
      en: "Tax-compliance SaaS without the complexity of a full ERP. Customers issue Brazilian e-invoices (NFCe, NFe and MDFe) straight from the browser, with Stripe billing and a containerized architecture — PHP/Laravel API using the sped-nfe library and a React frontend.",
    },
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
    status: {
      pt: "Em desenvolvimento",
      en: "In development",
    },
  },
  {
    title: "SecureVault",
    description: {
      pt: "Gerenciador de credenciais local-first com criptografia AES-256. Desenvolvido em Tauri para máxima performance desktop, focado em privacidade e segurança de chaves e ativos digitais.",
      en: "Local-first credential manager with AES-256 encryption. Built with Tauri for maximum desktop performance, focused on privacy and securing cryptographic keys and digital assets.",
    },
    technologies: ["React", "TypeScript", "Tauri", "Rust", "SQLite", "Tailwind"],
    githubUrl: "https://github.com/rafaelnassar/securevault",
  },
  {
    title: "Painel do Contador",
    description: {
      pt: "Resolve a coleta manual mensal de XMLs fiscais. Antes, o suporte precisava acessar a máquina de cada cliente e enviar os arquivos por e-mail ao contador. Agora um sincronizador em Node.js envia tudo direto para o Supabase Storage, e o contador baixa os documentos que precisar, quando precisar — sem depender de suporte nem do cliente.",
      en: "Replaces the monthly manual collection of tax XML files. Previously support had to access each client's machine and email the files to the accountant. Now a Node.js sync agent uploads everything to Supabase Storage, and the accountant downloads what they need, when they need — without depending on support or the client.",
    },
    technologies: ["React", "Node.js", "Supabase"],
    internal: true,
  },
  {
    title: "Ctrix Auto",
    description: {
      pt: "App mobile completo para oficinas mecânicas. Cobre orçamentos, ordens de serviço, aprovação por link e acompanhamento em tempo real pelo cliente da oficina — com módulo TV para sala de espera. Tudo integrado a um sistema legado de 20 anos.",
      en: "Full mobile app for auto repair shops. Covers quotes, service orders, approval-by-link, and real-time status tracking for the shop's customer — including a waiting-room TV display module. Everything integrated with a 20-year-old legacy system.",
    },
    technologies: ["React Native", "Expo", "Node.js", "PostgreSQL"],
    internal: true,
  },
];
