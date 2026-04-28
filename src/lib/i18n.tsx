import {
  createContext,
  useContext,
  useEffect,
  useRef,
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

/**
 * Duração total da transição de idioma (out → render → in).
 * Aproxima a sensação de "leve e delicado" do theme-transitioning (350ms),
 * mas dividido em 2 fases pra acomodar a troca de conteúdo no meio.
 */
const LANG_TRANSITION_OUT_MS = 160;
const LANG_TRANSITION_IN_MS = 200;

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(() => getInitialLang());
  const transitionTimerRef = useRef<number | null>(null);

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

  // Cleanup do timer caso o componente desmonte durante a transição
  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
      document.documentElement.classList.remove("lang-transitioning");
    };
  }, []);

  /**
   * Troca o idioma com fade suave em vez de jump brusco.
   *
   * Sequência:
   *   1. Adiciona classe `lang-transitioning` → CSS aplica opacity 0.55 no body
   *      (transition de 160ms — o usuário vê o conteúdo desbotando)
   *   2. Aguarda fade-out (160ms) — conteúdo antigo está semi-transparente
   *   3. setLangState(next) → React re-renderiza com novo conteúdo enquanto
   *      o body ainda está em opacity 0.55 (sem flash visual)
   *   4. Dois rAFs garantem que o paint do novo conteúdo terminou
   *   5. Remove classe → opacity volta a 1 (transition de 200ms — fade-in)
   *
   * Total: ~360ms — paridade com a sensação do theme-transitioning (350ms).
   */
  const setLang = (next: Lang) => {
    if (next === lang) return;

    const html = document.documentElement;
    html.classList.add("lang-transitioning");

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
    }

    transitionTimerRef.current = window.setTimeout(() => {
      setLangState(next);

      // 2 rAFs garantem que o React commitou o novo DOM e o browser pintou
      // antes de remover a classe (evita "salto" perceptível durante o fade-in)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          html.classList.remove("lang-transitioning");
          transitionTimerRef.current = null;
        });
      });
    }, LANG_TRANSITION_OUT_MS);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
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
