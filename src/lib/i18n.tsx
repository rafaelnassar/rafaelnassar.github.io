import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

/**
 * Sistema de i18n leve, sem deps externas.
 *
 * Resolução de idioma na inicialização (em ordem de precedência):
 *   1. ?lang=en|pt na URL (usado por scripts/build-cv.mjs pra gerar PDFs específicos)
 *   2. localStorage 'lang' (preferência do usuário, persistida pelo toggle)
 *   3. navigator.language ('en-*' → en, default → pt)
 *   4. Fallback: 'pt'
 *
 * O Provider também atualiza `<html lang="...">` em cada mudança — bom pra
 * acessibilidade (screen readers anunciam idioma correto) e SEO.
 */

export type Lang = "pt" | "en";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const HTML_LANG_MAP: Record<Lang, string> = {
  pt: "pt-BR",
  en: "en-US",
};

const getInitialLang = (): Lang => {
  if (typeof window === "undefined") return "pt";

  // 1. URL query (override pra build de PDF e deep-links)
  try {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get("lang");
    if (fromUrl === "en" || fromUrl === "pt") return fromUrl;
  } catch {
    /* noop */
  }

  // 2. localStorage
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "en" || saved === "pt") return saved;
  } catch {
    /* noop */
  }

  // 3. Browser
  const nav = navigator.language?.toLowerCase() || "";
  if (nav.startsWith("en")) return "en";

  // 4. Default português (preserva comportamento atual)
  return "pt";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => getInitialLang());

  useEffect(() => {
    document.documentElement.lang = HTML_LANG_MAP[lang];
    try {
      // Só persiste se NÃO veio de URL query (geração de PDF não deve poluir
      // localStorage do dev que rodar `bun run cv:build`)
      const url = new URL(window.location.href);
      if (!url.searchParams.get("lang")) {
        localStorage.setItem("lang", lang);
      }
    } catch {
      /* noop */
    }
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang: setLangState }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang() must be used inside <LanguageProvider>");
  }
  return ctx;
};

/** Helper inline pra strings simples sem precisar passar pelo arquivo de translations */
export const pick = <T,>(lang: Lang, pt: T, en: T): T =>
  lang === "pt" ? pt : en;
