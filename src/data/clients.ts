/**
 * Clientes — single source of truth.
 *
 * Consumido por:
 *   - src/components/Clients.tsx (carrossel do portfolio)
 *   - src/pages/CV.tsx (linha resumida na página /cv que vira PDF)
 */

export interface Client {
  name: string;
  /** Nome do domínio sem protocolo (ex: "cacttusbrasil.com.br") — usado em
   *  citações inline no CV. O componente Clients adiciona https://. */
  url: string;
  description: string;
  technologies: string[];
  logo?: string;
}

export const clients: Client[] = [
  {
    name: "Cacttus Brasil",
    url: "cacttusbrasil.com.br",
    description:
      "Site institucional para empresa de ERP corporativo legado. Modernização da identidade digital com foco em clareza, performance e conversão.",
    technologies: ["React", "Tailwind", "Vite"],
  },
  {
    name: "FG Sistema e Informática",
    url: "fgsistemaltda.com.br",
    description:
      "Site institucional para empresa de software ERP. Apresenta soluções, equipe e canais de contato em um layout direto ao ponto.",
    technologies: ["React", "Tailwind", "Vite"],
  },
  {
    name: "Agrotippo",
    url: "agrotippo.com.br",
    description:
      "Site institucional para cliente do agronegócio. Layout limpo com foco em apresentação de soluções agrícolas e captura de leads.",
    technologies: ["React", "Tailwind", "Vite"],
  },
];
