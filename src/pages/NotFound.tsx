import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-medium tracking-tight">404</h1>
        <p className="mb-6 text-muted-foreground">Página não encontrada</p>
        <Button asChild>
          <a href="/">Voltar ao início</a>
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
