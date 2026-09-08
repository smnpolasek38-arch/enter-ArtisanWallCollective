import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, productMinPrice } from "@/lib/products";
import { useCart } from "@/context/CartContext";
import { RatingStars } from "./RatingStars";

export const ProductCard = ({ product }: { product: Product }) => {
  const { t } = useTranslation();
  const { addItem } = useCart();
  const minPrice = productMinPrice(product);
  const defaultVariant = product.formats.poster[0];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      product,
      format: "poster",
      size: defaultVariant.size,
      frame: null,
      qty: 1,
    });
  };

  return (
    <Link to={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.alt}
          crossOrigin="anonymous"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out-quart group-hover:scale-105"
        />
        {product.bestseller && (
          <span className="absolute left-3 top-3 bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground backdrop-blur-sm">
            {t("product.bestseller")}
          </span>
        )}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="flex h-11 w-full items-center justify-center gap-2 bg-background/95 text-xs font-semibold uppercase tracking-[0.14em] text-foreground shadow-card backdrop-blur-sm transition hover:bg-background"
          >
            <Plus className="h-4 w-4" />
            {t("product.quickAdd")}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-base leading-snug">{product.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{product.artist}</p>
        </div>
        <p className="whitespace-nowrap text-sm font-medium">
          {t("product.from")} {formatPrice(minPrice)}
        </p>
      </div>

      <div className="mt-2 flex items-center gap-2">
        <RatingStars rating={product.rating} />
        <span className="text-xs text-muted-foreground">
          ({product.reviewCount})
        </span>
      </div>
    </Link>
  );
};
