import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { formatLabel, formatPrice } from "@/lib/products";
import { RatingStars } from "@/components/store/RatingStars";

const PAD = "mx-auto max-w-[1440px] px-[clamp(1rem,3vw,2rem)]";

const Cart = () => {
  const { t } = useTranslation();
  const {
    items,
    subtotal,
    itemCount,
    setQty,
    removeItem,
    freeShippingThreshold,
    mode,
    checkoutUrl,
  } = useCart();

  const isShopify = mode === "shopify";
  const shipping = isShopify
    ? null
    : subtotal >= freeShippingThreshold
      ? 0
      : 9;
  const total = shipping == null ? subtotal : subtotal + shipping;
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remaining = freeShippingThreshold - subtotal;

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      toast(t("cart.checkoutNotice"), { position: "top-center" });
    }
  };

  if (items.length === 0) {
    return (
      <section className={`${PAD} flex min-h-[60vh] flex-col items-center justify-center py-24 text-center`}>
        <span className="kicker">{t("cart.kicker")}</span>
        <h1 className="headline-l mt-3">{t("cart.empty")}</h1>
        <p className="mt-4 max-w-md text-muted-foreground">{t("cart.emptyText")}</p>
        <Link to="/collections/all" className="mt-8">
          <Button variant="cta" size="xl">
            {t("cart.emptyCta")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </section>
    );
  }

  return (
    <section className={`${PAD} py-[clamp(3rem,6vw,6rem)]`}>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="kicker">{t("cart.kicker")}</span>
          <h1 className="headline-l mt-3">
            {t("cart.title")}
            <span className="text-muted-foreground"> ({itemCount})</span>
          </h1>
        </div>
        <Link
          to="/collections/all"
          className="text-sm text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
        >
          {t("cart.continue")}
        </Link>
      </header>

      {/* Free shipping progress */}
      <div className="mb-10 border border-border bg-card p-5">
        <p className="text-sm text-muted-foreground">
          {remaining > 0
            ? t("cart.freeShippingProgress", { amount: formatPrice(remaining) })
            : t("cart.freeShippingReached")}
        </p>
        <div className="mt-3 h-1.5 w-full bg-muted">
          <div
            className="h-full bg-foreground transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Line items */}
        <div className="divide-y divide-border border-y border-border">
          {items.map((item) => (
            <div key={item.key} className="flex gap-5 py-6">
              <Link to={`/products/${item.productSlug}`} className="block w-24 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  crossOrigin="anonymous"
                  className="aspect-[4/5] w-full bg-muted object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link
                      to={`/products/${item.productSlug}`}
                      className="font-display text-lg leading-snug transition hover:opacity-70"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.variantTitle ??
                        [formatLabel(item.format), item.size, item.frame]
                          .filter(Boolean)
                          .join(" · ")}
                    </p>
                    {!item.variantTitle && (
                      <div className="mt-2 flex items-center gap-1.5">
                        <RatingStars rating={5} size="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {item.compareAtPrice != null && (
                      <p className="text-xs text-muted-foreground line-through">
                        {formatPrice(item.compareAtPrice)}
                      </p>
                    )}
                    <p
                      className={
                        item.compareAtPrice != null
                          ? "text-sm font-semibold text-destructive"
                          : "text-sm font-medium"
                      }
                    >
                      {formatPrice(item.unitPrice)}
                    </p>
                  </div>
                </div>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <div className="flex items-center border border-border">
                    <button
                      type="button"
                      onClick={() => setQty(item.key, item.qty - 1)}
                      className="flex h-9 w-9 items-center justify-center text-muted-foreground transition hover:text-foreground"
                      aria-label={t("product.quantityDown")}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center text-sm tabular-nums">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(item.key, item.qty + 1)}
                      className="flex h-9 w-9 items-center justify-center text-muted-foreground transition hover:text-foreground"
                      aria-label={t("product.quantityUp")}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-5">
                    <p className="font-display text-lg">
                      {formatPrice(item.unitPrice * item.qty)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      aria-label={t("cart.remove")}
                      className="text-muted-foreground transition hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <aside className="h-fit border border-border bg-card p-6 lg:sticky lg:top-32">
          <h2 className="kicker mb-5">{t("cart.summary")}</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("cart.subtotal")}</dt>
              <dd className="font-medium">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("cart.shipping")}</dt>
              <dd className="font-medium">
                {shipping == null
                  ? t("cart.shippingCalculated")
                  : shipping === 0
                    ? t("cart.shippingFree")
                    : formatPrice(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base">
              <dt>{t("cart.total")}</dt>
              <dd className="font-display text-2xl">{formatPrice(total)}</dd>
            </div>
          </dl>
          <Button
            variant="cta"
            size="xl"
            className="mt-6 w-full"
            onClick={handleCheckout}
          >
            {t("cart.checkout")}
            <ArrowRight className="h-4 w-4" />
          </Button>
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {t("cart.or")}
              </span>
            </div>
          </div>
          <Button
            variant="cta-outline"
            size="xl"
            className="w-full"
            onClick={handleCheckout}
          >
            {t("cart.express")}
          </Button>
          <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            {t("cart.guarantee")}
          </div>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            {t("cart.taxesNote")}
          </p>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
