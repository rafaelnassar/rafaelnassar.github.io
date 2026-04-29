/**
 * Clientes — fonte única bilíngue.
 *
 * Apenas `description` é traduzida — nomes próprios, URLs e tech stacks
 * permanecem iguais nos dois idiomas.
 */

export interface Client {
  name: string;
  url: string;
  description: { pt: string; en: string };
  technologies: string[];
  logo?: string;
}

export const clients: Client[] = [
  {
    name: "Cacttus Brasil",
    url: "cacttusbrasil.com.br",
    description: {
      pt: "Site institucional para empresa de software ERP. Layout direto, focado em apresentar soluções e canais de contato.",
      en: "Institutional website for an ERP software company. Direct layout, focused on presenting solutions and contact channels.",
    },
    technologies: ["React", "Tailwind", "Vite"],
  },
  {
    name: "FG Sistema e Informática",
    url: "fgsistemaltda.com.br",
    description: {
      pt: "Site institucional para empresa de software ERP. Apresenta soluções, equipe e canais de contato em um layout direto ao ponto.",
      en: "Institutional website for an ERP software company. Showcases solutions, team and contact channels in a straight-to-the-point layout.",
    },
    technologies: ["React", "Tailwind", "Vite"],
  },
  {
    name: "Agrotippo",
    url: "agrotippo.com.br",
    description: {
      pt: "Site institucional para cliente do agronegócio. Layout limpo, focado em mostrar as soluções agrícolas e facilitar o contato.",
      en: "Institutional website for an agribusiness client. Clean layout, focused on showcasing the agricultural solutions and making contact easy.",
    },
    technologies: ["React", "Tailwind", "Vite"],
  },
];
