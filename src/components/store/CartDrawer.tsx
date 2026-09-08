import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import {
  formatLabel,
  formatPrice,
  productMinPrice,
  products,
} from "@/lib/products";
import { cn } from "@/lib/utils";

export const CartDrawer = () => {
  const { t } = useTranslation();
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    setQty,
    subtotal,
    itemCount,
    freeShippingThreshold,
  } = useCart();

  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remaining = freeShippingThreshold - subtotal;

  const recommendations = products
    .filter((p) => p.bestseller && !items.some((i) => i.productSlug === p.slug))
    .slice(0, 3);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full max-w-md flex-col gap-0 bg-card p-0 shadow-pop sm:border-l sm:border-border">
        <SheetHeader className="border-b border-border px-5 py-4 text-left">
          <SheetTitle className="font-display text-xl font-normal">
            {t("cart.title")}
            <span className="text-muted-foreground"> ({itemCount})</span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            {t("cart.title")}
          </SheetDescription>
        </SheetHeader>

        {/* Free shipping progress */}
        <div className="border-b border-border px-5 py-4">
          <p className="text-sm text-muted-foreground">
            {remaining > 0
              ? t("cart.freeShippingProgress", {
                  amount: formatPrice(remaining),
                })
              : t("cart.freeShippingReached")}
          </p>
          <div className="mt-2 h-1 w-full bg-muted">
            <div
              className="h-full bg-foreground transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Line items */}
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
              <p className="text-sm text-muted-foreground">{t("cart.empty")}</p>
              <SheetClose asChild>
                <Link to="/collections/all">
                  <Button variant="cta" size="xl">
                    {t("cart.emptyCta")}
                  </Button>
                </Link>
              </SheetClose>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.key} className="flex gap-4">
                <Link
                  to={`/products/${item.productSlug}`}
                  onClick={closeCart}
                  className="block w-20 shrink-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    crossOrigin="anonymous"
                    className="aspect-[4/5] w-full bg-muted object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-sm leading-snug">
                        {item.name}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {formatLabel(item.format)} · {item.size}
                        {item.frame ? ` · ${item.frame}` : ""}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      aria-label={t("cart.remove")}
                      className="text-muted-foreground transition hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center border border-border">
                      <button
                        type="button"
                        onClick={() => setQty(item.key, item.qty - 1)}
                        className="flex h-8 w-8 items-center justify-center text-muted-foreground transition hover:text-foreground"
                        aria-label={t("product.quantityDown")}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(item.key, item.qty + 1)}
                        className="flex h-8 w-8 items-center justify-center text-muted-foreground transition hover:text-foreground"
                        aria-label={t("product.quantityUp")}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="text-right">
                      {item.compareAtPrice != null && (
                        <p className="text-xs text-muted-foreground line-through">
                          {formatPrice(item.compareAtPrice * item.qty)}
                        </p>
                      )}
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          item.compareAtPrice != null && "text-destructive",
                        )}
                      >
                        {formatPrice(item.unitPrice * item.qty)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recommendations */}
        {items.length > 0 && recommendations.length > 0 && (
          <div className="border-t border-border px-5 py-4">
            <p className="kicker mb-3">{t("cart.recommendations")}</p>
            <div className="flex gap-3">
              {recommendations.map((p) => (
                <Link
                  key={p.slug}
                  to={`/products/${p.slug}`}
                  onClick={closeCart}
                  className="group w-20 shrink-0"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    crossOrigin="anonymous"
                    className="aspect-[4/5] w-full bg-muted object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <p className="mt-1.5 truncate text-[11px] leading-tight text-foreground">
                    {p.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {formatPrice(productMinPrice(p))}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Summary */}
        {items.length > 0 && (
          <div className="space-y-4 border-t border-border px-5 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {t("cart.subtotal")}
              </span>
              <span className="font-display text-xl">{formatPrice(subtotal)}</span>
            </div>
            <Button
              variant="cta"
              size="xl"
              className="w-full"
              onClick={() =>
                toast(t("cart.checkoutNotice"), { position: "top-center" })
              }
            >
              {t("cart.checkout")}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
