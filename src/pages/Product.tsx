import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  Minus,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/store/ProductCard";
import { RatingStars } from "@/components/store/RatingStars";
import { Reveal } from "@/components/store/Reveal";
import {
  getCollection,
  getCollectionProducts,
  products,
  formatPrice,
} from "@/lib/products";
import { FORMATS, FORMAT_LABELS, type Format } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const PAD = "mx-auto max-w-[1440px] px-[clamp(1rem,3vw,2rem)]";

const FRAME_SWATCH: Record<string, string> = {
  "white-oak": "#cfa678",
  walnut: "#6b4a33",
  "matte-black": "#26221d",
  gold: "#d4af5a",
};

/** Approximate star distribution (5→1★) derived for the review summary. */
const REVIEW_BARS = [88, 8, 2, 1, 1];

const Product = () => {
  const { t } = useTranslation();
  const { slug = "" } = useParams<{ slug: string }>();
  const { addItem } = useCart();

  const product = useMemo(() => products.find((p) => p.slug === slug), [slug]);

  const [format, setFormat] = useState<Format>("poster");
  const [size, setSize] = useState<string>("50 × 70");
  const [frame, setFrame] = useState<string | null>("white-oak");
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const related = useMemo(() => {
    if (!product) return [];
    const sameCollection = getCollectionProducts(product.collection).filter(
      (p) => p.slug !== product.slug,
    );
    if (sameCollection.length >= 4) return sameCollection.slice(0, 4);
    const fill = products
      .filter((p) => p.bestseller && p.slug !== product.slug)
      .filter((p) => !sameCollection.some((s) => s.slug === p.slug));
    return [...sameCollection, ...fill].slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <section className={`${PAD} flex min-h-[60vh] flex-col items-center justify-center gap-5 py-24 text-center`}>
        <h1 className="headline-l">{t("notFound.title")}</h1>
        <Link to="/">
          <Button variant="cta" size="xl">
            {t("notFound.actions.backHome")}
          </Button>
        </Link>
      </section>
    );
  }

  const collection = getCollection(product.collection);
  const gallery = product.images.length ? product.images : [product.image];
  const sizes = product.formats[format];
  const currentVariant = sizes.find((v) => v.size === size) ?? sizes[0];
  const selectedFrame = product.frameOptions.find((f) => f.id === frame);
  const frameUpcharge = format === "framed" ? selectedFrame?.upcharge ?? 0 : 0;
  const unitPrice = currentVariant.price + frameUpcharge;
  const onSale = currentVariant.compareAtPrice != null;
  const comparePrice = currentVariant.compareAtPrice
    ? currentVariant.compareAtPrice + frameUpcharge
    : unitPrice;
  const saveAmount = comparePrice - unitPrice;
  const savePct = onSale
    ? Math.round((1 - unitPrice / comparePrice) * 100)
    : 0;

  const selectFormat = (next: Format) => {
    setFormat(next);
    const nextSizes = product.formats[next];
    if (!nextSizes.some((v) => v.size === size)) {
      setSize(nextSizes[0].size);
    }
  };

  const handleAddToCart = () => {
    addItem({
      product,
      format,
      size: currentVariant.size,
      frame: format === "framed" ? frame : null,
      qty,
    });
  };

  const uspList = [
    t("product.usp1"),
    t("product.usp2"),
    t("product.usp3"),
    t("product.usp4"),
  ];

  return (
    <div>
      <section className={`${PAD} py-10 lg:py-16`}>
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <Link to="/" className="transition hover:text-foreground">
            Noewe
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            to={
              collection
                ? `/collections/${collection.slug}`
                : "/collections/all"
            }
            className="transition hover:text-foreground"
          >
            {collection ? collection.name : t("collection.all")}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="relative overflow-hidden bg-muted">
              <img
                key={activeImage}
                src={gallery[activeImage]}
                alt={product.alt}
                crossOrigin="anonymous"
                className="aspect-[4/5] w-full animate-in object-cover fade-in duration-500"
              />
              <div className="absolute left-4 top-4 flex flex-col gap-1.5">
                {onSale && (
                  <span className="bg-destructive px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-destructive-foreground">
                    {t("product.sale")}
                  </span>
                )}
                {product.bestseller && (
                  <span className="bg-background/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground backdrop-blur-sm">
                    {t("product.bestseller")}
                  </span>
                )}
              </div>
            </div>

            {gallery.length > 1 && (
              <div className="mt-3 grid grid-cols-3 gap-3">
                {gallery.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    aria-label={t("product.imageThumb", {
                      n: i + 1,
                      count: gallery.length,
                    })}
                    className={cn(
                      "relative aspect-square overflow-hidden bg-muted ring-1 transition",
                      activeImage === i
                        ? "ring-foreground"
                        : "opacity-70 ring-transparent hover:opacity-100",
                    )}
                  >
                    <img
                      src={src}
                      alt=""
                      crossOrigin="anonymous"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <Reveal>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {product.artist}
              </p>
              <h1 className="display-s mt-2">{product.name}</h1>

              <div className="mt-4 flex items-center gap-2">
                <RatingStars rating={product.rating} />
                <span className="text-sm text-muted-foreground">
                  {product.rating} ·{" "}
                  {t("product.reviews.count", { count: product.reviewCount })}
                </span>
              </div>

              {/* Price */}
              <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
                <p
                  className={cn(
                    "font-display text-3xl",
                    onSale && "text-destructive",
                  )}
                >
                  {formatPrice(unitPrice)}
                </p>
                {onSale && (
                  <>
                    <p className="text-lg text-muted-foreground line-through">
                      {formatPrice(comparePrice)}
                    </p>
                    <span className="bg-destructive/10 px-2 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-destructive">
                      {t("product.save", { amount: formatPrice(saveAmount) })} ·{" "}
                      {savePct}% {t("product.off")}
                    </span>
                  </>
                )}
              </div>
              {format === "framed" && selectedFrame?.upcharge ? (
                <p className="mt-1 text-xs text-muted-foreground">
                  {t("product.frameIncluded", { frame: selectedFrame.label })}
                </p>
              ) : null}

              {/* Edition / shipping line */}
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="h-3.5 w-3.5 text-accent" />
                  {t("product.edition")}
                </span>
                <span className="flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-accent" />
                  {t("product.shipsIn")}
                </span>
              </div>

              <p className="mt-5 max-w-lg leading-relaxed text-muted-foreground">
                {product.description}
              </p>
              {product.longDescription ? (
                <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">
                  {product.longDescription}
                </p>
              ) : null}
            </Reveal>

            {/* Format */}
            <div className="mt-8">
              <span className="kicker mb-3 block">{t("product.format")}</span>
              <div className="grid grid-cols-3 border border-border">
                {FORMATS.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => selectFormat(f)}
                    className={cn(
                      "h-12 text-xs font-semibold uppercase tracking-[0.14em] transition",
                      format === f
                        ? "bg-foreground text-background"
                        : "bg-card text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {FORMAT_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-7">
              <span className="kicker mb-3 block">{t("product.size")}</span>
              <div className="flex flex-wrap gap-2">
                {sizes.map((v) => (
                  <button
                    key={v.size}
                    type="button"
                    onClick={() => setSize(v.size)}
                    className={cn(
                      "min-w-[92px] border px-4 py-3 text-left transition",
                      size === v.size
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-card text-foreground hover:border-foreground/40",
                    )}
                  >
                    <span className="block text-sm">{v.size}</span>
                    {v.compareAtPrice != null ? (
                      <>
                        <span className="mt-0.5 block text-[11px] text-destructive">
                          {formatPrice(v.price)}
                        </span>
                        <span
                          className={cn(
                            "block text-[11px]",
                            size === v.size
                              ? "text-background/70 line-through"
                              : "text-muted-foreground line-through",
                          )}
                        >
                          {formatPrice(v.compareAtPrice)}
                        </span>
                      </>
                    ) : (
                      <span
                        className={cn(
                          "mt-0.5 block text-[11px]",
                          size === v.size ? "opacity-75" : "text-muted-foreground",
                        )}
                      >
                        {formatPrice(v.price)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {t("product.dims", { dims: currentVariant.dims })}
              </p>
            </div>

            {/* Frame */}
            {format === "framed" && (
              <div className="mt-7">
                <span className="kicker mb-3 block">{t("product.frame")}</span>
                <div className="grid grid-cols-4 gap-2">
                  {product.frameOptions.map((fo) => (
                    <button
                      key={fo.id}
                      type="button"
                      onClick={() => setFrame(fo.id)}
                      className={cn(
                        "border p-3 text-left transition",
                        frame === fo.id
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-card hover:border-foreground/40",
                      )}
                    >
                      <span
                        className="block h-8 w-full border border-black/10"
                        style={{ backgroundColor: FRAME_SWATCH[fo.id] }}
                      />
                      <span className="mt-2 block text-xs leading-tight">
                        {fo.label}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 block text-[11px]",
                          frame === fo.id ? "opacity-75" : "text-muted-foreground",
                        )}
                      >
                        {fo.upcharge === 0
                          ? t("product.included")
                          : `+${formatPrice(fo.upcharge)}`}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Qty + CTA */}
            <div className="mt-8 flex gap-3">
              <div className="flex shrink-0 items-center border border-border">
                <button
                  type="button"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="flex h-12 w-12 items-center justify-center text-muted-foreground transition hover:text-foreground"
                  aria-label={t("product.quantityDown")}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-sm tabular-nums">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty(qty + 1)}
                  className="flex h-12 w-12 items-center justify-center text-muted-foreground transition hover:text-foreground"
                  aria-label={t("product.quantityUp")}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                variant="cta"
                size="xl"
                className="flex-1"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-4 w-4" />
                {t("product.addToCart")}
              </Button>
            </div>

            {/* USP list */}
            <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
              {uspList.map((text) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-accent" />
                  {text}
                </li>
              ))}
            </ul>

            {/* Trust hints */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" />
                {t("trust.freeShipping.text")}
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                {t("trust.returns.title")}
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                {t("trust.secure.title")}
              </span>
            </div>

            {/* Accordion */}
            <Accordion type="single" collapsible className="mt-8 border-t border-border">
              <AccordionItem value="details" className="border-border">
                <AccordionTrigger className="font-mono text-xs uppercase tracking-[0.18em]">
                  {t("product.details")}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {t("product.detailsText")}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping" className="border-border">
                <AccordionTrigger className="font-mono text-xs uppercase tracking-[0.18em]">
                  {t("product.shipping")}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {t("product.shippingText")}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="materials" className="border-border">
                <AccordionTrigger className="font-mono text-xs uppercase tracking-[0.18em]">
                  {t("product.materials")}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {t("product.materialsText")}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-20 border-t border-border pt-12">
          <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
            <div>
              <span className="kicker">{t("product.reviews.title")}</span>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-display text-5xl">{product.rating}</span>
                <RatingStars rating={product.rating} size="h-5 w-5" />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("product.reviews.basedOn", { count: product.reviewCount })}
              </p>
              <div className="mt-6 space-y-2">
                {REVIEW_BARS.map((pct, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs">
                    <span className="w-6 shrink-0 text-muted-foreground">
                      {5 - i}★
                    </span>
                    <div className="h-1.5 flex-1 bg-muted">
                      <div
                        className="h-full bg-foreground"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 shrink-0 text-right text-muted-foreground">
                      {pct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              {product.reviews.map((review) => (
                <figure key={review.author} className="border-b border-border pb-8 last:border-b-0">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-display text-sm">
                        {review.author.charAt(0)}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{review.author}</p>
                        <p className="text-xs text-muted-foreground">
                          {t("product.reviews.verified")} · {review.date}
                        </p>
                      </div>
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>
                  <blockquote className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
                    {review.text}
                  </blockquote>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Related */}
        <section className="mt-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="kicker">{t("product.related")}</span>
              <h2 className="headline-l mt-2">{t("product.relatedTitle")}</h2>
            </div>
          </div>
          <Carousel>
            <CarouselContent className="-ml-4">
              {related.map((p) => (
                <CarouselItem
                  key={p.slug}
                  className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/4"
                >
                  <ProductCard product={p} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </section>
    </div>
  );
};

export default Product;
