/**
 * Certificações — single source of truth.
 *
 * Consumido por:
 *   - src/components/Certifications.tsx (cards do portfolio com link)
 *   - src/pages/CV.tsx (grid 2-col na página /cv que vira PDF)
 */

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
  credentialUrl: string;
  /** Áreas de conhecimento exibidas como TagPill no portfolio */
  skills: string[];
}

export const certifications: Certification[] = [
  {
    name: "Software Engineer Certificate",
    issuer: "HackerRank",
    date: "Jul 2025",
    credentialId: "b7d48257ff3f",
    credentialUrl: "https://www.hackerrank.com/certificates/b7d48257ff3f",
    skills: ["Programação", "REST APIs", "Microsserviços"],
  },
  {
    name: "Frontend Developer (React)",
    issuer: "HackerRank",
    date: "Jul 2025",
    credentialId: "7f8179cc42b0",
    credentialUrl: "https://www.hackerrank.com/certificates/7f8179cc42b0",
    skills: ["React", "Programação", "Microsserviços"],
  },
  {
    name: "Node.js (Intermediate)",
    issuer: "HackerRank",
    date: "Jul 2025",
    credentialId: "0e79a25ccb1e",
    credentialUrl: "https://www.hackerrank.com/certificates/0e79a25ccb1e",
    skills: ["Node.js", "REST APIs", "Microsserviços"],
  },
  {
    name: "JavaScript (Intermediate)",
    issuer: "HackerRank",
    date: "Jul 2025",
    credentialId: "958393477e7d",
    credentialUrl: "https://www.hackerrank.com/certificates/958393477e7d",
    skills: ["JavaScript", "Programação"],
  },
  {
    name: "SQL (Advanced)",
    issuer: "HackerRank",
    date: "Jul 2025",
    credentialId: "daa603456405",
    credentialUrl: "https://www.hackerrank.com/certificates/daa603456405",
    skills: ["SQL", "Banco de dados", "REST APIs"],
  },
  {
    name: "Java (Basic)",
    issuer: "HackerRank",
    date: "Jul 2025",
    credentialId: "1a0e10ba8e0d",
    credentialUrl: "https://www.hackerrank.com/certificates/1a0e10ba8e0d",
    skills: ["Java", "Programação"],
  },
];
