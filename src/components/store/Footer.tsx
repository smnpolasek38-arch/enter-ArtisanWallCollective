import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useCatalog } from "@/lib/catalog";
import { LanguageSwitcher } from "@/components/language-switcher";

const SOCIALS = [
  { label: "Instagram", icon: Instagram },
  { label: "Facebook", icon: Facebook },
  { label: "YouTube", icon: Youtube },
];

export const Footer = () => {
  const { t } = useTranslation();
  const { collections } = useCatalog();
  const year = new Date().getFullYear();

  const columnTitle =
    "font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground";
  const link = "text-sm text-muted-foreground transition hover:text-foreground";

  return (
    <footer className="border-t border-border bg-secondary/60">
      <div className="mx-auto max-w-[1440px] px-[clamp(1rem,3vw,2rem)] py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="font-display text-3xl tracking-tight">
              Noewe
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("footer.tagline")}
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ label, icon: Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-foreground/30 hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-3">
            <p className={columnTitle}>{t("footer.shop")}</p>
            <Link to="/collections/all" className={link}>
              {t("header.shop")}
            </Link>
            {collections.map((c) => (
              <Link key={c.slug} to={`/collections/${c.slug}`} className={link}>
                {c.name}
              </Link>
            ))}
          </div>

          {/* Help */}
          <div className="flex flex-col gap-3">
            <p className={columnTitle}>{t("footer.help")}</p>
            <a href="#" className={link}>
              {t("footer.shippingReturns")}
            </a>
            <a href="#" className={link}>
              {t("footer.careGuide")}
            </a>
            <a href="#" className={link}>
              {t("footer.faq")}
            </a>
            <a href="#" className={link}>
              {t("footer.contact")}
            </a>
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <p className={columnTitle}>{t("footer.company")}</p>
            <a href="#" className={link}>
              {t("footer.about")}
            </a>
            <a href="#" className={link}>
              {t("footer.journal")}
            </a>
            <a href="#" className={link}>
              {t("footer.sustainability")}
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            {t("footer.legal", { year })}
          </p>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
};
