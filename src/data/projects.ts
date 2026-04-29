/**
 * Projetos selecionados — fonte única bilíngue.
 *
 * - description: { pt, en } — tradução completa
 * - title, technologies, URLs: invariáveis (nomes próprios)
 * - status: opcional, badge curto exibido ao lado do título — bilíngue
 * - image: opcional, screenshot/preview do projeto (especialmente útil pros
 *   projetos internal/NDA — recrutador internacional descarta o que não
 *   consegue ver, então uma imagem censurada/borrada já vira evidência)
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
  /**
   * Preview do projeto. Recomendação:
   * - 1280×720 (16:9), .webp pra peso, .gif só se precisar mostrar fluxo
   * - Pra projetos NDA, borrar/censurar dados sensíveis mantendo composição
   * - Caminho relativo a /public/ (ex: '/projects/emittly.webp')
   * - alt traduzido pra a11y
   */
  image?: {
    src: string;
    alt: { pt: string; en: string };
  };
}

export const projects: Project[] = [
  {
    title: "Emittly",
    description: {
      pt: "SaaS para emitir NFCe, NFe e MDFe direto do navegador, sem precisar de um ERP completo. Pagamentos via Stripe, API em PHP/Laravel e front em React.",
      en: "SaaS to issue Brazilian e-invoices (NFCe, NFe and MDFe) straight from the browser, without needing a full ERP. Stripe billing, PHP/Laravel API and React frontend.",
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
    // Adicione um preview quando tiver landing/dashboard prontos:
    // image: {
    //   src: "/projects/emittly.webp",
    //   alt: { pt: "Painel do Emittly emitindo NFCe", en: "Emittly dashboard issuing NFCe" },
    // },
  },
  {
    title: "SecureVault",
    description: {
      pt: "Gerenciador de credenciais que roda 100% no computador (sem nuvem), com criptografia AES-256. Desenvolvido em Tauri (Rust + web), focado em privacidade.",
      en: "Credential manager that runs 100% on the computer (no cloud), with AES-256 encryption. Built with Tauri (Rust + web), focused on privacy.",
    },
    technologies: ["React", "TypeScript", "Tauri", "Rust", "SQLite", "Tailwind"],
    githubUrl: "https://github.com/rafaelnassar/securevault",
    // image: {
    //   src: "/projects/securevault.webp",
    //   alt: { pt: "Tela principal do SecureVault", en: "SecureVault main screen" },
    // },
  },
  {
    title: "Painel do Contador",
    description: {
      pt: "Resolve a coleta manual mensal de XMLs fiscais. Um sincronizador em Node.js envia os arquivos automaticamente para o Supabase Storage, e o contador baixa o que precisa, quando precisa — sem depender do suporte ou do cliente.",
      en: "Replaces the monthly manual collection of tax XML files. A Node.js sync agent uploads files automatically to Supabase Storage, and the accountant downloads what they need, when they need — without depending on support or the client.",
    },
    technologies: ["React", "Node.js", "Supabase"],
    internal: true,
    // Pra recrutador internacional, screenshot censurado (CNPJs/nomes borrados)
    // já transforma este projeto NDA em evidência visível. Adicionar:
    // image: {
    //   src: "/projects/painel-do-contador.webp",
    //   alt: { pt: "Painel listando XMLs sincronizados (dados censurados)", en: "Panel listing synced XMLs (data redacted)" },
    // },
  },
  {
    title: "Ctrix Auto",
    description: {
      pt: "App mobile para oficinas mecânicas. Cobre orçamentos, ordens de serviço, aprovação por link e acompanhamento em tempo real pelo cliente — com módulo TV para sala de espera. Integrado ao ERP existente da empresa.",
      en: "Mobile app for auto repair shops. Covers quotes, service orders, approval-by-link and real-time status tracking for the shop's customer — with a waiting-room TV display module. Integrated with the company's existing ERP.",
    },
    technologies: ["React Native", "Expo", "Node.js", "PostgreSQL"],
    internal: true,
    // Sugestão pra mostrar o app sem expor cliente real:
    // image: {
    //   src: "/projects/ctrix-auto.webp",
    //   alt: { pt: "Telas do app Ctrix Auto (mockup)", en: "Ctrix Auto app screens (mockup)" },
    // },
  },
];
