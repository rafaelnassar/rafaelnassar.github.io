import { Brand } from "@/components/shared/Brand";

export const Footer = () => {
  return (
    <footer className="py-10 sm:py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Brand />
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} · Todos os direitos reservados
          </span>
        </div>
      </div>
    </footer>
  );
};
