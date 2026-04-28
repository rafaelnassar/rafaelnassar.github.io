import { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// CV é carregado sob demanda — não infla o bundle inicial do portfolio
const CV = lazy(() => import("./pages/CV"));

const App = () => (
  <TooltipProvider>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/cv"
            element={
              <Suspense fallback={null}>
                <CV />
              </Suspense>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  </TooltipProvider>
);

export default App;
