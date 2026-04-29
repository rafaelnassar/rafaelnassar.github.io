/**
 * Certificações — fonte única bilíngue.
 *
 * - skills: tradução PT/EN (áreas de conhecimento)
 * - name, issuer, date, credentialId, credentialUrl: invariáveis
 */

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  credentialUrl: string;
  skills: { pt: string[]; en: string[] };
}

export const certifications: Certification[] = [
  {
    name: "Software Engineer Certificate",
    issuer: "HackerRank",
    date: "Jul 2025",
    credentialId: "b7d48257ff3f",
    credentialUrl: "https://www.hackerrank.com/certificates/b7d48257ff3f",
    skills: {
      pt: ["Programação", "REST APIs", "Microsserviços"],
      en: ["Programming", "REST APIs", "Microservices"],
    },
  },
  {
    name: "Frontend Developer (React)",
    issuer: "HackerRank",
    date: "Jul 2025",
    credentialId: "7f8179cc42b0",
    credentialUrl: "https://www.hackerrank.com/certificates/7f8179cc42b0",
    skills: {
      pt: ["React", "Programação", "Microsserviços"],
      en: ["React", "Programming", "Microservices"],
    },
  },
  {
    name: "Node.js (Intermediate)",
    issuer: "HackerRank",
    date: "Jul 2025",
    credentialId: "0e79a25ccb1e",
    credentialUrl: "https://www.hackerrank.com/certificates/0e79a25ccb1e",
    skills: {
      pt: ["Node.js", "REST APIs", "Microsserviços"],
      en: ["Node.js", "REST APIs", "Microservices"],
    },
  },
  {
    name: "JavaScript (Intermediate)",
    issuer: "HackerRank",
    date: "Jul 2025",
    credentialId: "958393477e7d",
    credentialUrl: "https://www.hackerrank.com/certificates/958393477e7d",
    skills: {
      pt: ["JavaScript", "Programação"],
      en: ["JavaScript", "Programming"],
    },
  },
  {
    name: "SQL (Advanced)",
    issuer: "HackerRank",
    date: "Jul 2025",
    credentialId: "daa603456405",
    credentialUrl: "https://www.hackerrank.com/certificates/daa603456405",
    skills: {
      pt: ["SQL", "Banco de dados", "REST APIs"],
      en: ["SQL", "Databases", "REST APIs"],
    },
  },
  /*
   * "Java (Basic)" foi removido propositalmente: cert de nível "Basic" ao
   * lado de 7 anos de carreira soa contraditório pra recrutador técnico —
   * sinaliza incerteza onde se quer mostrar consolidação. Se for re-incluído
   * no futuro, fazer com Java (Intermediate) ou (Advanced).
   */
];
