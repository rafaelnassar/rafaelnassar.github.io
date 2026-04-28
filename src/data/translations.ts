import type { Lang } from "@/lib/i18n";

/**
 * UI strings centralizadas, agrupadas por seção.
 *
 * Padrão: cada chave tem objeto { pt, en }. Componentes acessam via
 *   const { lang } = useLang();
 *   const tx = t(lang);
 *   tx.hero.badge // string já no idioma certo
 *
 * Termos brasileiros específicos (NFCe, NFe, MDFe, Cuiabá) são mantidos
 * sem tradução por serem nomes próprios / siglas que recrutadores
 * estrangeiros pesquisam exatamente como estão.
 */

type Bilingual<T> = { [K in keyof T]: { pt: string; en: string } } extends T
  ? T
  : never;

const dict = {
  // Header / navegação
  nav: {
    about: { pt: "Sobre", en: "About" },
    experience: { pt: "Experiência", en: "Experience" },
    projects: { pt: "Projetos", en: "Projects" },
    clients: { pt: "Clientes", en: "Clients" },
    stack: { pt: "Stack", en: "Stack" },
    certifications: { pt: "Certificações", en: "Certifications" },
    contact: { pt: "Contato", en: "Contact" },
    headerCta: { pt: "Contato", en: "Contact" },
    headerCtaMobile: {
      pt: "Conectar no LinkedIn",
      en: "Connect on LinkedIn",
    },
    menuOpen: { pt: "Abrir menu", en: "Open menu" },
    menuClose: { pt: "Fechar menu", en: "Close menu" },
    menuLabel: { pt: "Menu de navegação", en: "Navigation menu" },
    primaryNav: { pt: "Navegação principal", en: "Primary navigation" },
    mobileNav: { pt: "Navegação móvel", en: "Mobile navigation" },
    backToTop: { pt: "Voltar ao topo", en: "Back to top" },
    skipLink: { pt: "Pular para o conteúdo", en: "Skip to main content" },
  },

  // Hero
  hero: {
    sectionLabel: { pt: "Introdução", en: "Introduction" },
    badge: {
      pt: "Disponível para projetos",
      en: "Available for projects",
    },
    role: { pt: "Software Engineer", en: "Software Engineer" },
    pitch: {
      pt: "Apps web, mobile e SaaS que resolvem problemas reais — do zero ou integrando com sistemas legados.",
      en: "Web, mobile and SaaS apps that solve real problems — from scratch or integrating with legacy systems.",
    },
    resumeLabel: { pt: "Currículo", en: "Resume" },
    resumeAria: {
      pt: "Currículo (ver online ou baixar PDF)",
      en: "Resume (view online or download PDF)",
    },
    scrollNext: {
      pt: "Rolar para a próxima seção",
      en: "Scroll to next section",
    },
    scrollLabel: { pt: "Scroll", en: "Scroll" },
  },

  // About
  about: {
    title: { pt: "Sobre", en: "About" },
    italic: { pt: "mim", en: "me" },
    subtitle: {
      pt: "Um pouco da minha história e jornada",
      en: "A bit of my story and journey",
    },
    p1: {
      pt: "Desde 2019 construo apps que resolvem problemas reais — força de venda, controle financeiro, emissão fiscal, dashboards internos, SaaS, automações e integrações com sistemas corporativos.",
      en: "Since 2019 I've been building apps that solve real problems — field sales, financial controls, tax compliance, internal dashboards, SaaS, automations, and integrations with enterprise systems.",
    },
    p2: {
      pt: "Trabalho do zero ao legado: do Delphi aos stacks modernos em React, Next.js e React Native. APIs em Node.js, AdonisJS e PHP/Laravel, com infraestrutura Linux e Windows Server — do básico ao avançado.",
      en: "I work from greenfield to legacy: from Delphi to modern stacks like React, Next.js, and React Native. APIs in Node.js, AdonisJS and PHP/Laravel, with Linux and Windows Server infrastructure — from basics to advanced.",
    },
    statYears: { pt: "Anos de experiência", en: "Years of experience" },
    statProjects: { pt: "Projetos entregues", en: "Projects delivered" },
    statTechs: { pt: "Tecnologias", en: "Technologies" },
  },

  // Experience
  experience: {
    title: { pt: "Experiência", en: "Experience" },
    italic: { pt: "profissional", en: "career" },
    subtitle: {
      pt: "Minha trajetória e áreas de atuação",
      en: "My professional path and areas of focus",
    },
  },

  // Projects
  projects: {
    title: { pt: "Projetos", en: "Projects" },
    italic: { pt: "selecionados", en: "selected" },
    subtitle: {
      pt: "Produtos que construí — públicos e internos",
      en: "Products I've built — public and private",
    },
    seeAll: { pt: "Ver todos os projetos", en: "See all projects" },
    code: { pt: "Código", en: "Code" },
    seeLive: { pt: "Ver site", en: "View site" },
    codeAria: { pt: "Código de", en: "Code for" },
    liveAria: { pt: "Ver", en: "View" },
    codeAriaSuffix: { pt: "no GitHub", en: "on GitHub" },
    liveAriaSuffix: { pt: "ao vivo", en: "live" },
    internal: {
      pt: "Projeto interno · sob NDA",
      en: "Internal project · under NDA",
    },
  },

  // Clients
  clients: {
    title: { pt: "Clientes", en: "Clients" },
    italic: { pt: "& parceiros", en: "& partners" },
    subtitle: {
      pt: "Empresas que confiaram seus sites institucionais a mim",
      en: "Companies that trusted me with their institutional websites",
    },
    seeProject: { pt: "Ver projeto", en: "View project" },
    prevAria: { pt: "Cliente anterior", en: "Previous client" },
    nextAria: { pt: "Próximo cliente", en: "Next client" },
    goToAria: { pt: "Ir para cliente", en: "Go to client" },
  },

  // Technologies
  technologies: {
    title: { pt: "Stack", en: "Stack" },
    italic: { pt: "técnica", en: "technical" },
    subtitle: {
      pt: "Ferramentas que uso no dia a dia para entregar do legado ao moderno",
      en: "Tools I use daily to deliver from legacy to modern systems",
    },
  },

  // Certifications
  certifications: {
    title: { pt: "Certificações", en: "Certifications" },
    italic: { pt: "verificadas", en: "verified" },
    subtitle: {
      pt: "Credenciais validadas e disponíveis para consulta",
      en: "Validated credentials available for verification",
    },
    seeCredential: { pt: "Ver credencial", en: "View credential" },
    credentialAria: {
      pt: "Ver credencial de",
      en: "View credential for",
    },
    credentialAriaSuffix: { pt: "no HackerRank", en: "on HackerRank" },
  },

  // Contact
  contact: {
    title: { pt: "Vamos", en: "Let's" },
    italic: { pt: "conversar?", en: "talk?" },
    subtitle: {
      pt: "Aberto a novas oportunidades",
      en: "Open to new opportunities",
    },
    whatsappMessage: {
      pt: "Olá Rafael! Encontrei seu portfólio e gostaria de conversar sobre uma possível oportunidade. Podemos agendar um bate-papo?",
      en: "Hi Rafael! I found your portfolio and would like to talk about a possible opportunity. Can we schedule a chat?",
    },
    whatsappHandle: { pt: "Fale comigo", en: "Send a message" },
  },

  // Footer
  footer: {
    rights: {
      pt: "Todos os direitos reservados",
      en: "All rights reserved",
    },
  },

  // CV (página /cv + PDF)
  cv: {
    backToPortfolio: {
      pt: "Voltar ao portfolio",
      en: "Back to portfolio",
    },
    downloadPdf: { pt: "Baixar PDF", en: "Download PDF" },
    profile: { pt: "Perfil", en: "Profile" },
    profileText: {
      pt: "Apps web, mobile e SaaS que resolvem problemas reais — do zero ou integrando com sistemas legados. Desde 2019 construo soluções para força de venda, controle financeiro, emissão fiscal (NFCe, NFe, MDFe), dashboards internos, automações e integrações corporativas. Trabalho do Delphi às stacks modernas em React, Next.js e React Native, com APIs em Node.js, AdonisJS e PHP/Laravel.",
      en: "Web, mobile and SaaS apps that solve real problems — from scratch or integrating with legacy systems. Since 2019 I've been building solutions for field sales, financial controls, tax compliance (Brazilian e-invoices: NFCe, NFe, MDFe), internal dashboards, automations, and enterprise integrations. I work from Delphi to modern stacks like React, Next.js and React Native, with APIs in Node.js, AdonisJS and PHP/Laravel.",
    },
    section_experience: { pt: "Experiência", en: "Experience" },
    section_projects: {
      pt: "Projetos selecionados",
      en: "Selected projects",
    },
    section_clients: { pt: "Clientes", en: "Clients" },
    section_stack: { pt: "Stack técnica", en: "Tech stack" },
    section_certs: { pt: "Certificações", en: "Certifications" },
    section_education: { pt: "Formação", en: "Education" },
    section_languages: { pt: "Idiomas", en: "Languages" },

    // Header da página /cv (folha de papel)
    headerRole: { pt: "Software Engineer", en: "Software Engineer" },

    // Education
    eduDegree: {
      pt: "CST em Análise e Desenvolvimento de Sistemas",
      en: "Associate Degree in Systems Analysis and Development",
    },
    eduSchool: {
      pt: "UNIASSELVI · Várzea Grande, MT",
      en: "UNIASSELVI · Várzea Grande, MT, Brazil",
    },
    eduPeriod: {
      pt: "Jul 2025 — Ago 2027 (em andamento)",
      en: "Jul 2025 — Aug 2027 (in progress)",
    },

    // Languages
    langPt: { pt: "Português (nativo)", en: "Portuguese (native)" },
    langEn: { pt: "Inglês (intermediário)", en: "English (intermediate)" },

    // Project status badges
    statusInDev: { pt: "em desenvolvimento", en: "in development" },
    statusUnderNda: { pt: "sob NDA", en: "under NDA" },
  },

  // Theme + language toggles
  toggle: {
    themeLight: { pt: "Ativar modo claro", en: "Switch to light mode" },
    themeDark: { pt: "Ativar modo escuro", en: "Switch to dark mode" },
    langSwitchToEn: {
      pt: "Mudar para inglês",
      en: "Switch to English",
    },
    langSwitchToPt: {
      pt: "Switch to Portuguese",
      en: "Mudar para português",
    },
  },
} as const;

type Dict = typeof dict;
type Section = keyof Dict;
type Key<S extends Section> = keyof Dict[S];

/**
 * Mapa de tradução de tags descritivas em PT → EN.
 *
 * Tags como "React", "Node.js", "Delphi", "PostgreSQL" são nomes próprios
 * que NÃO se traduzem — então só listamos aqui as tags em português que
 * deveriam aparecer em inglês quando lang === 'en'. Qualquer tag fora deste
 * mapa retorna inalterada (fallback).
 */
const TAG_TRANSLATIONS: Record<string, { pt: string; en: string }> = {
  "Suporte N1": { pt: "Suporte N1", en: "L1 Support" },
  "Suporte N2": { pt: "Suporte N2", en: "L2 Support" },
  "Emissão fiscal": { pt: "Emissão fiscal", en: "Tax compliance" },
  "Implantação": { pt: "Implantação", en: "Deployment" },
  "Infraestrutura": { pt: "Infraestrutura", en: "Infrastructure" },
  "Certificados Digitais": {
    pt: "Certificados Digitais",
    en: "Digital Certificates",
  },
};

export const translateTag = (tag: string, lang: Lang): string =>
  TAG_TRANSLATIONS[tag]?.[lang] ?? tag;

export const translateTags = (tags: string[], lang: Lang): string[] =>
  tags.map((tag) => translateTag(tag, lang));

/**
 * Acessa as strings traduzidas pra um idioma.
 *
 * Retorna um objeto onde cada section tem strings já no idioma certo:
 *   const tx = t('en');
 *   tx.hero.badge // "Available for projects"
 */
export const t = (lang: Lang) => {
  const result = {} as {
    [S in Section]: { [K in Key<S>]: string };
  };
  for (const section of Object.keys(dict) as Section[]) {
    const sectionDict = dict[section];
    const translatedSection = {} as Record<string, string>;
    for (const key of Object.keys(sectionDict)) {
      translatedSection[key] = (sectionDict as Record<string, { pt: string; en: string }>)[key][lang];
    }
    result[section] = translatedSection as (typeof result)[Section];
  }
  return result;
};

export type Translations = ReturnType<typeof t>;
