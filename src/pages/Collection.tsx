import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductCard } from "@/components/store/ProductCard";
import { Reveal } from "@/components/store/Reveal";
import {
  getCollection,
  getCollectionProducts,
  productMinPrice,
  HERO_IMAGE,
} from "@/lib/products";
import { cn } from "@/lib/utils";

type Tier = "all" | "lt100" | "100to200" | "gt200";
type Sort = "featured" | "price-asc" | "price-desc" | "newest";

const PAD = "mx-auto max-w-[1440px] px-[clamp(1rem,3vw,2rem)]";

const Collection = () => {
  const { t } = useTranslation();
  const { slug = "all" } = useParams<{ slug: string }>();

  const collection = slug === "all" ? undefined : getCollection(slug);
  const all = useMemo(() => getCollectionProducts(slug), [slug]);

  const [tier, setTier] = useState<Tier>("all");
  const [sort, setSort] = useState<Sort>("featured");

  const tiers: { id: Tier; label: string }[] = [
    { id: "all", label: t("collection.allFormats") },
    { id: "lt100", label: t("collection.tier.lt100") },
    { id: "100to200", label: t("collection.tier.mid") },
    { id: "gt200", label: t("collection.tier.gt200") },
  ];

  const matchesTier = (price: number) => {
    if (tier === "all") return true;
    if (tier === "lt100") return price < 100;
    if (tier === "100to200") return price >= 100 && price <= 200;
    return price > 200;
  };

  const visible = useMemo(() => {
    const filtered = all.filter((p) => matchesTier(productMinPrice(p)));
    const sorted = [...filtered];
    if (sort === "price-asc") {
      sorted.sort((a, b) => productMinPrice(a) - productMinPrice(b));
    } else if (sort === "price-desc") {
      sorted.sort((a, b) => productMinPrice(b) - productMinPrice(a));
    } else if (sort === "newest") {
      sorted.reverse();
    } else {
      sorted.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
    }
    return sorted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, tier, sort]);

  const bannerImage = collection ? collection.image : HERO_IMAGE;

  return (
    <div>
      {/* Banner */}
      <section className="relative flex min-h-[46vh] items-end overflow-hidden bg-secondary">
        <img
          src={bannerImage}
          alt={collection?.name ?? ""}
          crossOrigin="anonymous"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div className={`${PAD} relative w-full pb-14 pt-32`}>
          <Reveal>
            <span className="kicker text-background">
              {t("collection.kicker")}
            </span>
            <h1 className="display-s mt-3 max-w-3xl text-background">
              {collection ? collection.name : t("collection.all")}
            </h1>
            <p className="mt-4 max-w-xl text-background/85">
              {collection ? collection.blurb : t("collection.allBlurb")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Controls */}
      <section className={`${PAD} py-10`}>
        <div className="flex flex-col gap-4 border-b border-border pb-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {tiers.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTier(item.id)}
                className={cn(
                  "h-10 rounded-none border px-4 text-xs font-semibold uppercase tracking-[0.14em] transition",
                  tier === item.id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:border-foreground/40 hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select
              value={sort}
              onValueChange={(v) => setSort(v as Sort)}
            >
              <SelectTrigger className="w-[200px] rounded-none border-border bg-card text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="featured">
                  {t("collection.sort.featured")}
                </SelectItem>
                <SelectItem value="price-asc">
                  {t("collection.sort.priceAsc")}
                </SelectItem>
                <SelectItem value="price-desc">
                  {t("collection.sort.priceDesc")}
                </SelectItem>
                <SelectItem value="newest">
                  {t("collection.sort.newest")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-muted-foreground">
          {t("collection.results", { count: visible.length })}
        </p>
      </section>

      {/* Grid */}
      <section className={`${PAD} pb-[clamp(4rem,8vw,8rem)]`}>
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <p className="text-muted-foreground">{t("collection.empty")}</p>
            <Button
              variant="cta"
              size="xl"
              onClick={() => {
                setTier("all");
                setSort("featured");
              }}
            >
              <RotateCcw className="h-4 w-4" />
              {t("collection.emptyCta")}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 xl:grid-cols-4">
            {visible.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 0.06}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-16 flex justify-center">
          <Link to="/collections/all">
            <Button variant="cta-outline" size="xl">
              {t("collection.browseAll")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Collection;
