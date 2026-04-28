import { lazy, Suspense } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Technologies } from "@/components/Technologies";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

const Clients = lazy(() =>
  import("@/components/Clients").then((m) => ({ default: m.Clients }))
);
const BackToTop = lazy(() =>
  import("@/components/BackToTop").then((m) => ({ default: m.BackToTop }))
);

const Index = () => {
  const { lang } = useLang();
  const tx = t(lang);

  return (
    <div className="min-h-screen bg-background">
      {/* Skip link: oculto até receber foco via teclado (WCAG 2.4.1) */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-foreground focus:text-background focus:text-sm focus:font-medium focus:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {tx.nav.skipLink}
      </a>
      <Header />
      <main id="conteudo">
        {/*
          Ordem narrativa (impacto crescente):
          1. Hero — primeira impressão
          2. About — credibilidade rápida (stats)
          3. Experience — solidez profissional (CV)
          4. Projects — produto concreto (o que entrega)
          5. Clients — prova social (empresas que confiaram)
          6. Technologies — range técnico amplo
          7. Certifications — selo externo
          8. Contact — CTA no momento de pico
        */}
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Suspense fallback={null}>
          <Clients />
        </Suspense>
        <Technologies />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <BackToTop />
      </Suspense>
    </div>
  );
};

export default Index;
