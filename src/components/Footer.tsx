import { Brand } from "@/components/shared/Brand";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

export const Footer = () => {
  const { lang } = useLang();
  const tx = t(lang);

  return (
    <footer className="py-10 sm:py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <Brand />
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} · {tx.footer.rights}
          </span>
        </div>
      </div>
    </footer>
  );
};
