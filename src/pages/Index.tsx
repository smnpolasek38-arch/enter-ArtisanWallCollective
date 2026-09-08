import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, Quote } from "lucide-react";
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
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ProductCard } from "@/components/store/ProductCard";
import { RatingStars } from "@/components/store/RatingStars";
import { SectionHeading } from "@/components/store/SectionHeading";
import { TrustBadges } from "@/components/store/TrustBadges";
import { Newsletter } from "@/components/store/Newsletter";
import { Reveal } from "@/components/store/Reveal";
import {
  collections,
  products,
  HERO_IMAGE,
  INTERIOR_BEDROOM,
  INTERIOR_GALLERY,
} from "@/lib/products";

const bestsellers = products.filter((p) => p.bestseller);

const PRESS = [
  "Elle Decor",
  "Architectural Digest",
  "Kinfolk",
  "Monocle",
  "Vogue Living",
];

const PAD = "mx-auto max-w-[1440px] px-[clamp(1rem,3vw,2rem)]";
const SECTION = "py-[clamp(4rem,8vw,8rem)]";

const Index = () => {
  const { t } = useTranslation();

  const stats = [
    { value: "12k+", label: t("home.stats.homes") },
    { value: "4.9/5", label: t("home.stats.rating") },
    { value: "30-day", label: t("home.stats.returns") },
    { value: "100%", label: t("home.stats.oak") },
  ];

  const faqs = [
    { q: t("home.faq.q1"), a: t("home.faq.a1") },
    { q: t("home.faq.q2"), a: t("home.faq.a2") },
    { q: t("home.faq.q3"), a: t("home.faq.a3") },
    { q: t("home.faq.q4"), a: t("home.faq.a4") },
    { q: t("home.faq.q5"), a: t("home.faq.a5") },
  ];

  const testimonials = [
    {
      quote: t("home.testimonials.one.quote"),
      author: t("home.testimonials.one.author"),
    },
    {
      quote: t("home.testimonials.two.quote"),
      author: t("home.testimonials.two.author"),
    },
    {
      quote: t("home.testimonials.three.quote"),
      author: t("home.testimonials.three.author"),
    },
  ];

  const editorialFeatures = [
    t("home.editorial.feature1"),
    t("home.editorial.feature2"),
    t("home.editorial.feature3"),
  ];

  return (
    <div>
      {/* ============ Hero ============ */}
      <section className="relative min-h-[80vh] overflow-hidden bg-secondary">
        <img
          src={HERO_IMAGE}
          alt=""
          crossOrigin="anonymous"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-overlay" />
        <div
          className={`${PAD} relative flex min-h-[80vh] flex-col justify-end pb-16 pt-28`}
        >
          <Reveal>
            <span className="kicker text-background">{t("home.hero.kicker")}</span>
            <h1 className="display-l mt-4 max-w-4xl text-background">
              {t("home.hero.title")}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-background/85">
              {t("home.hero.subtitle")}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/collections/all">
                <Button variant="cta-inverse" size="xl" className="w-full sm:w-auto">
                  {t("home.hero.cta")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#collections">
                <Button
                  variant="cta-outline"
                  size="xl"
                  className="w-full border-background/40 text-background hover:bg-background/10 sm:w-auto"
                >
                  {t("home.hero.ctaSecondary")}
                </Button>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ Stats strip ============ */}
      <section className="border-b border-border bg-card">
        <div className={`${PAD} grid grid-cols-2 gap-y-8 py-10 lg:grid-cols-4`}>
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl md:text-4xl">{s.value}</p>
              <p className="mt-1.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ Collections ============ */}
      <section id="collections" className={`${PAD} ${SECTION} scroll-mt-28`}>
        <SectionHeading
          kicker={t("home.collections.kicker")}
          title={t("home.collections.title")}
          subtitle={t("home.collections.subtitle")}
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08}>
              <Link
                to={`/collections/${c.slug}`}
                className="group relative block overflow-hidden bg-muted"
              >
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.name}
                    crossOrigin="anonymous"
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out-quart group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-overlay" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-2xl text-background">
                    {c.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-background/85">
                    {t("home.collections.cta")}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ Press ============ */}
      <section className={`${PAD} ${SECTION} pb-0`}>
        <div className="flex flex-col items-center gap-6 border-y border-border py-10">
          <span className="kicker">{t("home.press.kicker")}</span>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-70">
            {PRESS.map((name) => (
              <span key={name} className="font-display text-xl md:text-2xl">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ Bestsellers ============ */}
      <section className={`${PAD} ${SECTION} pt-0`}>
        <div className="flex items-end justify-between gap-6">
          <SectionHeading
            kicker={t("home.bestsellers.kicker")}
            title={t("home.bestsellers.title")}
            subtitle={t("home.bestsellers.subtitle")}
            className="mb-0"
          />
        </div>
        <Carousel className="mt-10">
          <CarouselContent className="-ml-4">
            {bestsellers.map((p) => (
              <CarouselItem
                key={p.slug}
                className="basis-1/2 pl-4 md:basis-1/3 lg:basis-1/4"
              >
                <ProductCard product={p} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
            <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {t("home.bestsellers.slide")}
            </span>
            <div className="flex gap-2">
              <CarouselPrevious className="static left-auto right-auto top-auto h-10 w-10 -translate-x-0 translate-y-0 rounded-none border border-border bg-card shadow-none hover:bg-foreground hover:text-background" />
              <CarouselNext className="static left-auto right-auto top-auto h-10 w-10 -translate-x-0 translate-y-0 rounded-none border border-border bg-card shadow-none hover:bg-foreground hover:text-background" />
            </div>
          </div>
        </Carousel>
      </section>

      {/* ============ Editorial ============ */}
      <section className="bg-secondary/50 py-[clamp(4rem,8vw,8rem)]">
        <div className={`${PAD} grid items-center gap-12 lg:grid-cols-2`}>
          <Reveal>
            <div className="relative overflow-hidden">
              <img
                src={INTERIOR_BEDROOM}
                alt=""
                crossOrigin="anonymous"
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="kicker">{t("home.editorial.kicker")}</span>
            <h2 className="headline-l mt-3 max-w-lg">
              {t("home.editorial.title")}
            </h2>
            <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
              {t("home.editorial.text")}
            </p>
            <ul className="mt-7 space-y-3">
              {editorialFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link to="/collections/all" className="mt-9 inline-block">
              <Button variant="cta" size="xl">
                {t("home.editorial.cta")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ Interior gallery band ============ */}
      <section className={`${PAD} ${SECTION}`}>
        <Reveal>
          <img
            src={INTERIOR_GALLERY}
            alt=""
            crossOrigin="anonymous"
            loading="lazy"
            className="aspect-[21/9] w-full object-cover max-md:aspect-[4/3]"
          />
        </Reveal>
      </section>

      {/* ============ Testimonials ============ */}
      <section className={`${PAD} ${SECTION} pt-0`}>
        <SectionHeading
          align="center"
          kicker={t("home.testimonials.kicker")}
          title={t("home.testimonials.title")}
          subtitle={t("home.testimonials.subtitle")}
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.author} delay={i * 0.08}>
              <figure className="flex h-full flex-col gap-4 border border-border bg-card p-7 shadow-card">
                <Quote className="h-5 w-5 text-accent" />
                <blockquote className="text-base leading-relaxed">
                  “{item.quote}”
                </blockquote>
                <figcaption className="mt-auto pt-2">
                  <RatingStars rating={5} />
                  <p className="mt-2 text-sm font-medium">{item.author}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("home.testimonials.verified")}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ Trust ============ */}
      <section className="border-y border-border bg-secondary/50 py-14">
        <div className={`${PAD}`}>
          <TrustBadges />
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className={`${PAD} ${SECTION}`}>
        <SectionHeading
          align="center"
          kicker={t("home.faq.kicker")}
          title={t("home.faq.title")}
          subtitle={t("home.faq.subtitle")}
        />
        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="border-t border-border">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`} className="border-border">
                <AccordionTrigger className="text-left font-display text-lg">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ============ Newsletter ============ */}
      <section className="bg-foreground py-[clamp(4rem,8vw,8rem)] text-background">
        <div className="mx-auto max-w-2xl px-[clamp(1rem,3vw,2rem)] text-center">
          <Reveal>
            <span className="kicker text-accent">
              {t("home.newsletter.kicker")}
            </span>
            <h2 className="headline-l mt-3">{t("home.newsletter.title")}</h2>
            <p className="mt-4 leading-relaxed text-background/75">
              {t("home.newsletter.subtitle")}
            </p>
            <div className="mt-8">
              <Newsletter />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default Index;
