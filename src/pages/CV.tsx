import { Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, focusRing } from "@/lib/utils";

/* Single source of truth: src/data/* alimenta tanto este CV quanto os
 * componentes do portfolio em src/components/. Editar dados em um lugar
 * propaga pra ambos. */
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { clients } from "@/data/clients";
import { stack } from "@/data/technologies";
import { certifications } from "@/data/certifications";

/**
 * Currículo gerado a partir da mesma fonte de verdade do portfolio.
 *
 * Arquitetura tipo "document viewer" (Google Docs / Notion):
 * - Chrome (wrap + toolbar) respeita o tema do site (light/dark)
 * - Documento <article> sempre branco com texto preto (é "folha de papel")
 * - Em print, @media print força tudo branco
 *
 * Pra geração do PDF estático, o headless Chrome usa
 * --force-prefers-color-scheme=light (em scripts/build-cv.mjs), garantindo
 * que o site renderize em light antes de imprimir → wrap fica light, doc
 * fica branco, PDF sai consistente.
 */

/** Extrai display curto de uma URL completa (ex: "github.com/rafaelnassar/securevault") */
const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "");

/*
 * Estratégia de paginação:
 * - @page define margens NO PAPEL (12mm vertical / 14mm horizontal). Funciona
 *   pro headless Chrome E pro diálogo de impressão manual independente da
 *   escolha "Padrão / Sem margens / Custom" do usuário — evita margem dupla.
 * - Em print, o documento zera padding (margens já vêm do @page) e zera
 *   width fixo em mm — flui na área imprimível disponível.
 * - Page-breaks NÃO são aplicados na seção inteira (causa páginas quase vazias
 *   quando seção grande não cabe). São aplicados em ITENS individuais
 *   (.cv-item): cada experiência/projeto não quebra no meio, mas a seção
 *   pode quebrar entre itens. Comportamento natural de CV.
 */
const cvStyles = `
@page {
  size: A4;
  margin: 12mm 14mm;
}

@media print {
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #FFFFFF !important;
  }
  .cv-toolbar { display: none !important; }
  .cv-page-wrap {
    min-height: auto !important;
    padding: 0 !important;
    background: #FFFFFF !important;
  }
  .cv-document {
    box-shadow: none !important;
    margin: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
    min-height: auto !important;
    padding: 0 !important;
    border-radius: 0 !important;
    background: #FFFFFF !important;
  }
  a { color: inherit !important; text-decoration: none !important; }
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  /* Items individuais não quebram no meio; seções podem quebrar entre items */
  .cv-item { page-break-inside: avoid; break-inside: avoid; }
  /* Headings de seção não ficam isolados no fim da página */
  .cv-document h2 { break-after: avoid; page-break-after: avoid; }
}

.cv-document {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #0F1424;
  font-size: 10pt;
  line-height: 1.5;
  letter-spacing: -0.005em;
}

.cv-document h1 {
  font-size: 24pt;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: #0F1424;
}

.cv-document .role {
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-size: 13pt;
  color: #475569;
  line-height: 1.2;
  margin-top: 2pt;
}

.cv-document .meta-line {
  font-size: 8.5pt;
  color: #475569;
}

.cv-document .meta-line a { color: #3B5EA8; }

.cv-document h2 {
  font-size: 8.5pt;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: #64748B;
  margin-top: 14pt;
  margin-bottom: 6pt;
  padding-bottom: 3pt;
  border-bottom: 1px solid #E5E7EB;
}

.cv-document h3 {
  font-size: 10.5pt;
  font-weight: 500;
  color: #0F1424;
  line-height: 1.3;
}

.cv-document .role-line { font-size: 10.5pt; line-height: 1.3; }
.cv-document .role-line .company { color: #475569; }
.cv-document .role-line .sep { color: #CBD5E1; padding: 0 4pt; }

.cv-document .period { font-size: 8.5pt; color: #64748B; white-space: nowrap; }
.cv-document .location {
  font-family: 'Instrument Serif', Georgia, serif;
  font-style: italic;
  font-size: 9pt;
  color: #94A3B8;
  margin-top: 1pt;
}

.cv-document .desc {
  font-size: 9.5pt;
  color: #334155;
  line-height: 1.5;
  margin-top: 3pt;
}

.cv-document .tags {
  font-size: 8.5pt;
  color: #64748B;
  margin-top: 3pt;
}

.cv-document .tag-sep { color: #CBD5E1; padding: 0 3pt; }

.cv-document .stack-row { display: flex; gap: 12pt; align-items: baseline; }
.cv-document .stack-cat {
  font-weight: 500;
  font-size: 9.5pt;
  color: #0F1424;
  width: 100pt;
  flex-shrink: 0;
}
.cv-document .stack-items { font-size: 9.5pt; color: #334155; flex: 1; }

.cv-document .cert-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4pt 16pt;
}
.cv-document .cert-item { font-size: 9.5pt; }
.cv-document .cert-name { font-weight: 500; color: #0F1424; }
.cv-document .cert-meta { color: #64748B; }

.cv-document .footer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16pt;
}

/*
 * Mobile (< 640px) NÃO tem layout dedicado nesta página: o botão
 * "Currículo" no Hero detecta viewport pequeno e dispara download
 * direto do PDF (em vez de navegar para /cv). Tablets ≥ 640px e
 * desktop continuam abrindo /cv normalmente, com folha A4 em
 * proporção real e legível.
 */
`;

const Header = () => (
  <header>
    <h1>Rafael Nassar</h1>
    <p className="role">Software Engineer</p>
    <div className="meta-line mt-3 flex flex-wrap gap-x-2 gap-y-1">
      <span>Cuiabá, MT</span>
      <span style={{ color: "#CBD5E1" }}>·</span>
      <span>+55 65 98134-2422</span>
      <span style={{ color: "#CBD5E1" }}>·</span>
      <a href="mailto:adm.rafaelnassar@gmail.com">adm.rafaelnassar@gmail.com</a>
      <span style={{ color: "#CBD5E1" }}>·</span>
      <a href="https://rafaelnassar.dev">rafaelnassar.dev</a>
      <span style={{ color: "#CBD5E1" }}>·</span>
      <a href="https://github.com/rafaelnassar">github.com/rafaelnassar</a>
      <span style={{ color: "#CBD5E1" }}>·</span>
      <a href="https://linkedin.com/in/rafael-nassar-2a3637287">
        linkedin.com/in/rafael-nassar
      </a>
    </div>
  </header>
);

const Profile = () => (
  <section className="cv-item">
    <h2>Perfil</h2>
    <p className="desc" style={{ marginTop: 0 }}>
      Apps web, mobile e SaaS que resolvem problemas reais — do zero ou integrando com
      sistemas legados. Desde 2019 construo soluções para força de venda, controle
      financeiro, emissão fiscal (NFCe, NFe, MDFe), dashboards internos, automações e
      integrações corporativas. Trabalho do Delphi às stacks modernas em React, Next.js
      e React Native, com APIs em Node.js, AdonisJS e PHP/Laravel.
    </p>
  </section>
);

const Experience = () => (
  <section>
    <h2>Experiência</h2>
    <div className="space-y-3">
      {experiences.map((exp) => (
        <div key={`${exp.title}-${exp.period}`} className="cv-item">
          <div className="flex items-baseline justify-between gap-3">
            <div className="role-line">
              <span style={{ fontWeight: 500 }}>{exp.title}</span>
              <span className="sep">·</span>
              <span className="company">{exp.company}</span>
              <span className="sep">·</span>
              <span style={{ color: "#94A3B8", fontSize: "9pt" }}>{exp.location}</span>
            </div>
            <span className="period">{exp.period}</span>
          </div>
          <p className="desc">{exp.description}</p>
          <p className="tags">
            {exp.tags.map((t, i) => (
              <span key={t}>
                {i > 0 && <span className="tag-sep">·</span>}
                {t}
              </span>
            ))}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const Projects = () => (
  <section>
    <h2>Projetos selecionados</h2>
    <div className="space-y-2.5">
      {projects.map((p) => (
        <div key={p.title} className="cv-item">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h3>{p.title}</h3>
            {p.status && (
              <span
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "9pt",
                  color: "#94A3B8",
                }}
              >
                — {p.status}
              </span>
            )}
            {p.internal && (
              <span
                style={{
                  fontFamily: "'Instrument Serif', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "9pt",
                  color: "#94A3B8",
                }}
              >
                — sob NDA
              </span>
            )}
            {p.githubUrl && (
              <span style={{ fontSize: "8.5pt", color: "#3B5EA8" }}>
                · {stripProtocol(p.githubUrl)}
              </span>
            )}
          </div>
          <p className="desc">{p.description}</p>
          <p className="tags">
            {p.technologies.map((t, i) => (
              <span key={t}>
                {i > 0 && <span className="tag-sep">·</span>}
                {t}
              </span>
            ))}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const Clients = () => (
  <section className="cv-item">
    <h2>Clientes</h2>
    <p className="desc" style={{ marginTop: 0 }}>
      {clients.map((c, i) => (
        <span key={c.name}>
          {i > 0 && <span className="tag-sep">·</span>}
          <span style={{ fontWeight: 500, color: "#0F1424" }}>{c.name}</span>
          <span style={{ color: "#94A3B8" }}> ({c.url})</span>
        </span>
      ))}
    </p>
  </section>
);

const Stack = () => (
  <section className="cv-item">
    <h2>Stack técnica</h2>
    <div className="space-y-1">
      {stack.map((s) => (
        <div key={s.category} className="stack-row">
          <span className="stack-cat">{s.category}</span>
          <span className="stack-items">{s.items.join(" · ")}</span>
        </div>
      ))}
    </div>
  </section>
);

const Certifications = () => (
  <section className="cv-item">
    <h2>Certificações</h2>
    <div className="cert-grid">
      {certifications.map((c) => (
        <div key={c.name} className="cert-item">
          <span className="cert-name">{c.name}</span>
          <span className="cert-meta">
            {" — "}
            {c.issuer}, {c.date}
          </span>
        </div>
      ))}
    </div>
  </section>
);

const Footer = () => (
  <div className="footer-grid mt-3">
    <section className="cv-item">
      <h2>Formação</h2>
      <div style={{ fontSize: "9.5pt" }}>
        <div style={{ fontWeight: 500, color: "#0F1424" }}>
          CST em Análise e Desenvolvimento de Sistemas
        </div>
        <div className="cert-meta">UNIASSELVI · Várzea Grande, MT</div>
        <div className="cert-meta">Jul 2025 — Ago 2027 (em andamento)</div>
      </div>
    </section>
    <section className="cv-item">
      <h2>Idiomas</h2>
      <p style={{ fontSize: "9.5pt", color: "#334155" }}>
        Português (nativo) <span className="tag-sep">·</span> Inglês (intermediário)
      </p>
    </section>
  </div>
);

export default function CV() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cvStyles }} />

      {/*
        Wrap: respeita o tema do site (bg-secondary/30 funciona em light e dark).
        - light: cream sutil envolvendo o documento branco
        - dark: dark navy envolvendo o documento branco (efeito "PDF preview")
        Em print, @media print força wrap branco. Pra geração do PDF, o
        headless Chrome usa --force-prefers-color-scheme=light (já configurado
        em scripts/build-cv.mjs) → wrap renderiza em light.
      */}
      <div className="cv-page-wrap min-h-screen py-8 bg-secondary/30">
        <div className="cv-toolbar mx-auto mb-6 flex items-center justify-between gap-3 px-6 max-w-[210mm]">
          {/* "Voltar" — link ghost com tokens do tema (mesmo padrão dos nav links do Header) */}
          <Link
            to="/"
            className={cn(
              "group inline-flex items-center gap-2 text-sm rounded-full px-3 py-1.5 transition-colors",
              "text-muted-foreground hover:text-foreground",
              focusRing
            )}
          >
            <ArrowLeft
              className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden
            />
            Voltar ao portfolio
          </Link>

          {/* "Baixar PDF" — Button shadcn (mesmo padrão do "Contato" do Header) */}
          <Button size="sm" asChild>
            <a href="/curriculo.pdf" download="rafael-nassar-cv.pdf">
              <Download aria-hidden />
              Baixar PDF
            </a>
          </Button>
        </div>

        {/*
          Documento — folha de papel, SEMPRE branca com texto preto.
          - bg-white fixo (independe de tema, é representação de papel real)
          - Sombra adaptativa (mais discreta em light, mais marcada em dark
            pra destacar a folha contra o fundo dark)
        */}
        <article
          className="cv-document mx-auto bg-white shadow-[0_4px_24px_rgba(15,20,36,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
          style={{
            width: "210mm",
            minHeight: "297mm",
            maxWidth: "210mm",
            padding: "12mm 14mm",
            borderRadius: "2px",
          }}
        >
          <Header />
          <Profile />
          <Experience />
          <Projects />
          <Clients />
          <Stack />
          <Certifications />
          <Footer />
        </article>
      </div>
    </>
  );
}
