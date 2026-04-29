import { Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/LanguageToggle";
import { cn, focusRing } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t, translateTag, type Translations } from "@/data/translations";

/* Single source of truth: src/data/* alimenta tanto este CV quanto os
 * componentes do portfolio em src/components/. Editar dados em um lugar
 * propaga pra ambos. */
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import { clients } from "@/data/clients";
import { stack } from "@/data/technologies";
import { certifications } from "@/data/certifications";
import type { Lang } from "@/lib/i18n";

/**
 * Currículo — bilingue (PT/EN), gerado a partir da mesma fonte do portfolio.
 *
 * Arquitetura tipo "document viewer" (Google Docs / Notion):
 * - Chrome (wrap + toolbar) respeita o tema do site (light/dark)
 * - Documento <article> sempre branco com texto preto (é "folha de papel")
 * - Em print, @media print força tudo branco
 *
 * Pra geração do PDF estático, scripts/build-cv.mjs usa:
 * - ?theme=light forçando light no script inline do index.html
 * - ?lang=pt|en pra escolher idioma do CV
 * Resultado: curriculo.pdf (PT) e curriculo-en.pdf (EN), ambos com fundo
 * branco mesmo se o dev rodar com dark mode + en/pt como default.
 */

/** Extrai display curto de uma URL completa (ex: "github.com/rafaelnassar/securevault") */
const stripProtocol = (url: string) => url.replace(/^https?:\/\//, "");

const PDF_FOR_LANG: Record<Lang, string> = {
  pt: "/curriculo.pdf",
  en: "/curriculo-en.pdf",
};

const PDF_FILENAME_FOR_LANG: Record<Lang, string> = {
  pt: "rafael-nassar-curriculo.pdf",
  en: "rafael-nassar-resume.pdf",
};

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
  .cv-item { page-break-inside: avoid; break-inside: avoid; }
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
 * direto do PDF. Tablets ≥ 640px e desktop abrem /cv normalmente.
 */
`;

// ──────────────────────────────────────────────────────────────────────────
// Sub-componentes — todos recebem `lang` e `tx` via props pra evitar múltiplas
// chamadas a useLang() (single render → single tradução)
// ──────────────────────────────────────────────────────────────────────────

interface SectionProps {
  lang: Lang;
  tx: Translations;
}

const PageHeader = ({ lang, tx }: SectionProps) => (
  <header>
    <h1>Rafael Nassar</h1>
    <p className="role">{tx.cv.headerRole}</p>
    <div className="meta-line mt-3 flex flex-wrap gap-x-2 gap-y-1">
      <span>{lang === "pt" ? "Cuiabá, MT" : "Cuiabá, MT, Brazil"}</span>
      <span style={{ color: "#CBD5E1" }}>·</span>
      <span>+55 65 98134-2422</span>
      <span style={{ color: "#CBD5E1" }}>·</span>
      <a href="mailto:adm.rafaelnassar@gmail.com">adm.rafaelnassar@gmail.com</a>
      <span style={{ color: "#CBD5E1" }}>·</span>
      <a href="https://rafaelnassar.github.io">rafaelnassar.github.io</a>
      <span style={{ color: "#CBD5E1" }}>·</span>
      <a href="https://github.com/rafaelnassar">github.com/rafaelnassar</a>
      <span style={{ color: "#CBD5E1" }}>·</span>
      <a href="https://linkedin.com/in/nassarrafael">
        linkedin.com/in/nassarrafael
      </a>
    </div>
  </header>
);

const Profile = ({ tx }: SectionProps) => (
  <section className="cv-item">
    <h2>{tx.cv.profile}</h2>
    <p className="desc" style={{ marginTop: 0 }}>
      {tx.cv.profileText}
    </p>
  </section>
);

const ExperienceSection = ({ lang, tx }: SectionProps) => (
  <section>
    <h2>{tx.cv.section_experience}</h2>
    <div className="space-y-3">
      {experiences.map((exp) => (
        <div key={`${exp.company}-${exp.period[lang]}`} className="cv-item">
          <div className="flex items-baseline justify-between gap-3">
            <div className="role-line">
              <span style={{ fontWeight: 500 }}>{exp.title[lang]}</span>
              <span className="sep">·</span>
              <span className="company">{exp.company}</span>
              <span className="sep">·</span>
              <span style={{ color: "#94A3B8", fontSize: "9pt" }}>
                {exp.location[lang]}
              </span>
            </div>
            <span className="period">{exp.period[lang]}</span>
          </div>
          <p className="desc">{exp.description[lang]}</p>
          <p className="tags">
            {exp.tags.map((tag, i) => (
              <span key={tag}>
                {i > 0 && <span className="tag-sep">·</span>}
                {translateTag(tag, lang)}
              </span>
            ))}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const ProjectsSection = ({ lang, tx }: SectionProps) => (
  <section>
    <h2>{tx.cv.section_projects}</h2>
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
                — {p.status[lang]}
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
                — {tx.cv.statusUnderNda}
              </span>
            )}
            {p.githubUrl && (
              <span style={{ fontSize: "8.5pt", color: "#3B5EA8" }}>
                · {stripProtocol(p.githubUrl)}
              </span>
            )}
          </div>
          <p className="desc">{p.description[lang]}</p>
          <p className="tags">
            {p.technologies.map((tag, i) => (
              <span key={tag}>
                {i > 0 && <span className="tag-sep">·</span>}
                {tag}
              </span>
            ))}
          </p>
        </div>
      ))}
    </div>
  </section>
);

const ClientsSection = ({ tx }: SectionProps) => (
  <section className="cv-item">
    <h2>{tx.cv.section_clients}</h2>
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

const StackSection = ({ lang, tx }: SectionProps) => (
  <section className="cv-item">
    <h2>{tx.cv.section_stack}</h2>
    <div className="space-y-1">
      {stack.map((s) => (
        <div key={s.category[lang]} className="stack-row">
          <span className="stack-cat">{s.category[lang]}</span>
          <span className="stack-items">{s.items.join(" · ")}</span>
        </div>
      ))}
    </div>
  </section>
);

const CertificationsSection = ({ tx }: SectionProps) => (
  <section className="cv-item">
    <h2>{tx.cv.section_certs}</h2>
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

const FooterSection = ({ tx }: SectionProps) => (
  <div className="footer-grid mt-3">
    <section className="cv-item">
      <h2>{tx.cv.section_education}</h2>
      <div style={{ fontSize: "9.5pt" }}>
        <div style={{ fontWeight: 500, color: "#0F1424" }}>
          {tx.cv.eduDegree}
        </div>
        <div className="cert-meta">{tx.cv.eduSchool}</div>
        <div className="cert-meta">{tx.cv.eduPeriod}</div>
      </div>
    </section>
    <section className="cv-item">
      <h2>{tx.cv.section_languages}</h2>
      <p style={{ fontSize: "9.5pt", color: "#334155" }}>
        {tx.cv.langPt} <span className="tag-sep">·</span> {tx.cv.langEn}
      </p>
    </section>
  </div>
);

// ──────────────────────────────────────────────────────────────────────────
// Página
// ──────────────────────────────────────────────────────────────────────────

export default function CV() {
  const { lang } = useLang();
  const tx = t(lang);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cvStyles }} />

      {/*
        Wrap: respeita o tema do site (bg-secondary/30 funciona em light e dark).
        Em print, @media print força wrap branco. Pro PDF gerado, o headless
        Chrome usa ?theme=light pra forçar light antes do React montar.
      */}
      <div className="cv-page-wrap min-h-screen py-8 bg-secondary/30">
        <div className="cv-toolbar mx-auto mb-6 flex items-center justify-between gap-3 px-6 max-w-[210mm]">
          {/* "Voltar / Back" — link ghost com tokens do tema */}
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
            {tx.cv.backToPortfolio}
          </Link>

          {/* LanguageToggle + Baixar PDF — empilhados no canto direito */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button size="sm" asChild>
              <a
                href={PDF_FOR_LANG[lang]}
                download={PDF_FILENAME_FOR_LANG[lang]}
              >
                <Download aria-hidden />
                {tx.cv.downloadPdf}
              </a>
            </Button>
          </div>
        </div>

        {/*
          Documento — folha de papel, SEMPRE branca com texto preto.
          - bg-white fixo (independe de tema, é representação de papel real)
          - Sombra adaptativa (mais discreta em light, mais marcada em dark)
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
          <PageHeader lang={lang} tx={tx} />
          <Profile lang={lang} tx={tx} />
          <ExperienceSection lang={lang} tx={tx} />
          <ProjectsSection lang={lang} tx={tx} />
          <ClientsSection lang={lang} tx={tx} />
          <StackSection lang={lang} tx={tx} />
          <CertificationsSection lang={lang} tx={tx} />
          <FooterSection lang={lang} tx={tx} />
        </article>
      </div>
    </>
  );
}
