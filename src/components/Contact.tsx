import { MessageCircle, Github, Linkedin, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { cn, focusRing } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

export const Contact = () => {
  const { lang } = useLang();
  const tx = t(lang);

  const whatsappMessage = encodeURIComponent(tx.contact.whatsappMessage);

  const links = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      handle: tx.contact.whatsappHandle,
      href: `https://wa.me/5565981342422?text=${whatsappMessage}`,
      highlight: true,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      handle: "rafael-nassar",
      href: "https://www.linkedin.com/in/rafael-nassar-2a3637287",
    },
    {
      icon: Github,
      label: "GitHub",
      handle: "rafaelnassar",
      href: "https://github.com/rafaelnassar",
    },
  ];

  return (
    <section id="contato" aria-labelledby="contato-title" className="py-20 sm:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <SectionHeading
            id="contato-title"
            title={tx.contact.title}
            italic={tx.contact.italic}
            subtitle={tx.contact.subtitle}
          />

          <Reveal delay={0.05} className="space-y-4 max-w-md mx-auto">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center justify-between p-5 sm:p-6 rounded-2xl border transition-all duration-300 group",
                  focusRing,
                  link.highlight
                    ? "bg-foreground text-background border-foreground hover:opacity-90"
                    : "bg-card border-border hover:border-foreground/20 hover:shadow-md"
                )}
              >
                <div className="flex items-center gap-3">
                  <link.icon className="w-5 h-5" aria-hidden />
                  <div>
                    <div
                      className={cn(
                        "text-xs",
                        link.highlight ? "opacity-70" : "text-muted-foreground"
                      )}
                    >
                      {link.label}
                    </div>
                    <div className="font-medium text-sm sm:text-base">{link.handle}</div>
                  </div>
                </div>
                <ArrowUpRight
                  aria-hidden
                  className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                />
              </a>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
};
