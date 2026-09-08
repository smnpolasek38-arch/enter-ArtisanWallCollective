import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, ShoppingBag } from "lucide-react";
import { collections } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/language-switcher";

export const Header = () => {
  const { t } = useTranslation();
  const { openCart, itemCount } = useCart();

  const navLink =
    "text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground transition hover:text-foreground";

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-foreground px-4 py-2 text-center text-[11px] font-medium uppercase tracking-[0.18em] text-background">
        {t("header.announcement")}
      </div>

      <div className="relative flex h-16 items-center border-b border-border bg-background/85 px-4 backdrop-blur-md md:h-20 md:px-6 lg:px-10">
        {/* Left: hamburger (mobile) + logo */}
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label={t("header.menu")}
                className="flex h-10 w-10 items-center justify-center lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-80 flex-col gap-0 bg-card p-0 sm:max-w-sm"
            >
              <SheetHeader className="border-b border-border px-5 py-4 text-left">
                <SheetTitle className="font-display text-2xl font-normal">
                  Noewe
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-5 py-4">
                <SheetClose asChild>
                  <Link
                    to="/collections/all"
                    className="rounded-none px-3 py-3 text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground transition hover:text-foreground"
                  >
                    {t("header.shop")}
                  </Link>
                </SheetClose>
                {collections.map((c) => (
                  <SheetClose asChild key={c.slug}>
                    <Link
                      to={`/collections/${c.slug}`}
                      className="rounded-none px-3 py-3 text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground transition hover:text-foreground"
                    >
                      {c.name}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="mt-auto border-t border-border px-5 py-4">
                <LanguageSwitcher className="w-full" />
              </div>
            </SheetContent>
          </Sheet>

          <Link
            to="/"
            className="font-display text-2xl tracking-tight md:text-3xl"
          >
            Noewe
          </Link>
        </div>

        {/* Center: desktop nav — truly centered */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex">
          <Link to="/collections/all" className={navLink}>
            {t("header.shop")}
          </Link>
          {collections.map((c) => (
            <Link key={c.slug} to={`/collections/${c.slug}`} className={navLink}>
              {c.name}
            </Link>
          ))}
        </nav>

        {/* Right: cart */}
        <div className="ml-auto flex items-center">
          <button
            type="button"
            onClick={openCart}
            aria-label={t("header.cart")}
            className="relative flex h-10 w-10 items-center justify-center"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium text-background">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
