import type {
  Collection,
  CollectionSlug,
  Format,
  FrameOption,
  Product,
  VariantPrice,
} from "./types";

const CDN = "https://cdn.enter.pro/resources/uid_100527261/";
const img = (name: string) => `${CDN}${name}.png`;

/** Imagery used by page-level sections (hero, editorial, collections). */
export const HERO_IMAGE = img("noewe-hero_6a5937ca");
export const INTERIOR_BEDROOM = img("noewe-interior-bedroom_1796a426");
export const INTERIOR_GALLERY = img("noewe-interior-gallery_9bb33d3f");

const POSTER_SIZES: VariantPrice[] = [
  { size: "30 × 40", dims: "30 × 40 cm", price: 39 },
  { size: "50 × 70", dims: "50 × 70 cm", price: 59 },
  { size: "70 × 100", dims: "70 × 100 cm", price: 89 },
];
const FRAMED_SIZES: VariantPrice[] = [
  { size: "30 × 40", dims: "30 × 40 cm", price: 129 },
  { size: "50 × 70", dims: "50 × 70 cm", price: 169 },
  { size: "70 × 100", dims: "70 × 100 cm", price: 229 },
];
const CANVAS_SIZES: VariantPrice[] = [
  { size: "30 × 40", dims: "30 × 40 cm", price: 149 },
  { size: "40 × 60", dims: "40 × 60 cm", price: 199 },
  { size: "60 × 90", dims: "60 × 90 cm", price: 279 },
];

const FRAMES: FrameOption[] = [
  { id: "white-oak", label: "White Oak", upcharge: 0 },
  { id: "walnut", label: "Walnut", upcharge: 15 },
  { id: "matte-black", label: "Matte Black", upcharge: 10 },
  { id: "gold", label: "Gold", upcharge: 25 },
];

/** Returns the preset size list with a uniform per-product price offset. */
const sizes = (list: VariantPrice[], offset = 0): VariantPrice[] =>
  list.map((v) => ({ ...v, price: v.price + offset }));

export const collections: Collection[] = [
  {
    slug: "abstract",
    name: "Abstract",
    blurb: "Soft shapes and warm gradients that give a room a sense of calm.",
    image: img("noewe-amber-drift_45c6e41a"),
  },
  {
    slug: "botanical",
    name: "Botanical",
    blurb: "Botanical studies and organic forms that bring the outside in.",
    image: img("noewe-mimosa-study_d3b9a337"),
  },
  {
    slug: "architecture",
    name: "Architecture",
    blurb: "Quiet geometry, light and line from the world's buildings.",
    image: img("noewe-casa-arches_02a9b656"),
  },
  {
    slug: "figurative",
    name: "Figurative",
    blurb: "Expressive figures and still lifes with an editorial sensibility.",
    image: img("noewe-quiet-figure_de0f76ed"),
  },
];

export const products: Product[] = [
  {
    slug: "amber-drift",
    name: "Amber Drift",
    artist: "Studio Noewe",
    collection: "abstract",
    image: img("noewe-amber-drift_45c6e41a"),
    alt: "Abstract artwork with flowing amber and terracotta gradients",
    description:
      "A study in warmth. Amber Drift layers soft organic gradients that catch the light at different times of day, bringing a quiet sense of movement to any wall.",
    formats: {
      poster: sizes(POSTER_SIZES, 5),
      framed: sizes(FRAMED_SIZES, 5),
      canvas: sizes(CANVAS_SIZES, 10),
    },
    frameOptions: FRAMES,
    tags: ["abstract", "warm", "terracotta"],
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewCount: 214,
    reviews: [
      {
        author: "Mara T.",
        rating: 5,
        date: "Aug 2026",
        text: "The colours are even richer in person. It completely changed the feel of our living room.",
      },
      {
        author: "Daniel K.",
        rating: 5,
        date: "Jul 2026",
        text: "Incredible print quality and the oak frame is beautifully made. Arrived well packaged.",
      },
      {
        author: "Priya S.",
        rating: 4,
        date: "Jun 2026",
        text: "Gorgeous piece. Took a while to choose a size but the 50×70 was perfect over the sofa.",
      },
    ],
  },
  {
    slug: "quiet-geometry",
    name: "Quiet Geometry",
    artist: "Lena Marchetti",
    collection: "abstract",
    image: img("noewe-quiet-geometry_86f71011"),
    alt: "Minimal abstract composition of geometric shapes in black, sand and terracotta",
    description:
      "Three simple shapes hold the whole composition. Quiet Geometry is precision without noise — made for hallways, studies and considered corners.",
    formats: {
      poster: sizes(POSTER_SIZES),
      framed: sizes(FRAMED_SIZES),
      canvas: sizes(CANVAS_SIZES, -10),
    },
    frameOptions: FRAMES,
    tags: ["abstract", "minimal", "line"],
    featured: false,
    bestseller: true,
    rating: 4.8,
    reviewCount: 168,
    reviews: [
      {
        author: "Tomás R.",
        rating: 5,
        date: "Aug 2026",
        text: "Bought the matte black frame. Clean, sharp, exactly as photographed.",
      },
      {
        author: "Hannah L.",
        rating: 5,
        date: "May 2026",
        text: "My favourite piece at home. Simple but everyone comments on it.",
      },
    ],
  },
  {
    slug: "stone-study",
    name: "Stone Study",
    artist: "Studio Noewe",
    collection: "abstract",
    image: img("noewe-stone-study_653258b5"),
    alt: "Abstract close-up of layered limestone and travertine textures",
    description:
      "Layered limestone veining, printed as a large-format study. Stone Study brings the quiet tactility of natural material into interior spaces.",
    formats: {
      poster: sizes(POSTER_SIZES, -4),
      framed: sizes(FRAMED_SIZES, -4),
      canvas: sizes(CANVAS_SIZES),
    },
    frameOptions: FRAMES,
    tags: ["abstract", "texture", "neutral"],
    featured: false,
    bestseller: false,
    rating: 4.7,
    reviewCount: 96,
    reviews: [
      {
        author: "Bea W.",
        rating: 5,
        date: "Jul 2026",
        text: "Looks incredible printed large. Pairs beautifully with warm plaster walls.",
      },
    ],
  },
  {
    slug: "mimosa-study",
    name: "Mimosa Study",
    artist: "Iris Moreau",
    collection: "botanical",
    image: img("noewe-mimosa-study_d3b9a337"),
    alt: "Hand-drawn botanical ink study of mimosa branches",
    description:
      "A delicate ink study of mimosa, drawn by hand and reproduced in museum-grade detail. Light, optimistic, and endlessly easy to live with.",
    formats: {
      poster: sizes(POSTER_SIZES),
      framed: sizes(FRAMED_SIZES, 10),
      canvas: sizes(CANVAS_SIZES),
    },
    frameOptions: FRAMES,
    tags: ["botanical", "ink", "spring"],
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewCount: 301,
    reviews: [
      {
        author: "Claire D.",
        rating: 5,
        date: "Aug 2026",
        text: "The ink detail is stunning. It brightens our breakfast nook every morning.",
      },
      {
        author: "Jonas P.",
        rating: 5,
        date: "Jun 2026",
        text: "Framed in walnut. Quality of the frame exceeded expectations.",
      },
      {
        author: "Aiko N.",
        rating: 5,
        date: "Apr 2026",
        text: "Bought as a gift — the recipient was over the moon. Packaging was beautiful too.",
      },
    ],
  },
  {
    slug: "monstera-leaf",
    name: "Monstera No. 2",
    artist: "Amara Osei",
    collection: "botanical",
    image: img("noewe-monstera_ac7a1ac8"),
    alt: "Botanical print of a single monstera leaf in sage and forest green",
    description:
      "One leaf, three shades of green. Monstera No. 2 is a soft, contemporary take on the classic botanical print.",
    formats: {
      poster: sizes(POSTER_SIZES, -6),
      framed: sizes(FRAMED_SIZES, -6),
      canvas: sizes(CANVAS_SIZES, -15),
    },
    frameOptions: FRAMES,
    tags: ["botanical", "green", "leaf"],
    featured: false,
    bestseller: true,
    rating: 4.8,
    reviewCount: 143,
    reviews: [
      {
        author: "Nina V.",
        rating: 5,
        date: "Jul 2026",
        text: "Perfect muted greens. Looks like it was made for our home office.",
      },
    ],
  },
  {
    slug: "wild-poppy",
    name: "Wild Poppy",
    artist: "Lena Marchetti",
    collection: "botanical",
    image: img("noewe-wild-poppy_30d59b03"),
    alt: "Editorial still life of dried poppies and grasses in a ceramic vase",
    description:
      "Dried poppies, low light, long shadows. Wild Poppy captures the mood of an autumn afternoon and holds it on your wall.",
    formats: {
      poster: sizes(POSTER_SIZES, -2),
      framed: sizes(FRAMED_SIZES),
      canvas: sizes(CANVAS_SIZES, 5),
    },
    frameOptions: FRAMES,
    tags: ["botanical", "still-life", "dried-flowers"],
    featured: false,
    bestseller: false,
    rating: 4.7,
    reviewCount: 87,
    reviews: [
      {
        author: "Oliver F.",
        rating: 5,
        date: "May 2026",
        text: "Subtle and beautiful. The shadows really come alive in natural light.",
      },
    ],
  },
  {
    slug: "casa-arches",
    name: "Casa Arches",
    artist: "Studio Noewe",
    collection: "architecture",
    image: img("noewe-casa-arches_02a9b656"),
    alt: "Photograph of warm Mediterranean arches casting long shadows",
    description:
      "Golden hour through a limestone colonnade. Casa Arches is a calm architectural escape printed at large scale for full effect.",
    formats: {
      poster: sizes(POSTER_SIZES),
      framed: sizes(FRAMED_SIZES, 15),
      canvas: sizes(CANVAS_SIZES, 20),
    },
    frameOptions: FRAMES,
    tags: ["architecture", "mediterranean", "sun"],
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewCount: 256,
    reviews: [
      {
        author: "Sofia M.",
        rating: 5,
        date: "Aug 2026",
        text: "The 70×100 canvas is a statement piece. Feels like standing in the sun.",
      },
      {
        author: "Ethan B.",
        rating: 5,
        date: "Jun 2026",
        text: "Warm, timeless, perfectly printed. Highly recommend.",
      },
    ],
  },
  {
    slug: "brutalist-facade",
    name: "Brutalist Facade",
    artist: "Jonas Weber",
    collection: "architecture",
    image: img("noewe-brutalist-facade_ea53e7df"),
    alt: "Minimalist photograph of a warm concrete facade with geometric shadows",
    description:
      "Order, repetition and shadow. Brutalist Facade turns a rigorous building into a soft, warm composition.",
    formats: {
      poster: sizes(POSTER_SIZES, -3),
      framed: sizes(FRAMED_SIZES),
      canvas: sizes(CANVAS_SIZES, -5),
    },
    frameOptions: FRAMES,
    tags: ["architecture", "minimal", "shadow"],
    featured: false,
    bestseller: false,
    rating: 4.8,
    reviewCount: 112,
    reviews: [
      {
        author: "Milan H.",
        rating: 5,
        date: "Jul 2026",
        text: "Clean geometry and beautiful print depth. Looks great in the study.",
      },
    ],
  },
  {
    slug: "coastal-line",
    name: "Coastal Line",
    artist: "Iris Moreau",
    collection: "architecture",
    image: img("noewe-coastal-line_edddbb9d"),
    alt: "Minimal line-art print of a coastline in sand and muted teal",
    description:
      "A horizon drawn in a few confident lines. Coastal Line brings the calm of the sea to modern, pared-back interiors.",
    formats: {
      poster: sizes(POSTER_SIZES, -5),
      framed: sizes(FRAMED_SIZES, -8),
      canvas: sizes(CANVAS_SIZES, -20),
    },
    frameOptions: FRAMES,
    tags: ["architecture", "line", "coastal"],
    featured: false,
    bestseller: true,
    rating: 4.8,
    reviewCount: 176,
    reviews: [
      {
        author: "Freya G.",
        rating: 5,
        date: "May 2026",
        text: "Understated and perfect. The white oak frame suits it so well.",
      },
      {
        author: "Luca R.",
        rating: 4,
        date: "Mar 2026",
        text: "Lovely print. Wish there was a larger canvas size available.",
      },
    ],
  },
  {
    slug: "quiet-figure",
    name: "Quiet Figure",
    artist: "Amara Osei",
    collection: "figurative",
    image: img("noewe-quiet-figure_de0f76ed"),
    alt: "Photograph of a smooth abstract sculptural figure in travertine",
    description:
      "A soft sculptural head in warm stone. Quiet Figure adds gallery-like presence without raising its voice.",
    formats: {
      poster: sizes(POSTER_SIZES, 3),
      framed: sizes(FRAMED_SIZES, 8),
      canvas: sizes(CANVAS_SIZES, 15),
    },
    frameOptions: FRAMES,
    tags: ["figurative", "sculpture", "stone"],
    featured: true,
    bestseller: true,
    rating: 4.9,
    reviewCount: 198,
    reviews: [
      {
        author: "Chloe A.",
        rating: 5,
        date: "Aug 2026",
        text: "Instantly elevated our entrance hall. Guests always ask about it.",
      },
      {
        author: "Marco J.",
        rating: 5,
        date: "Apr 2026",
        text: "The print texture is wonderful — almost like the real sculpture.",
      },
    ],
  },
  {
    slug: "gestural-figure",
    name: "Gestural Figure",
    artist: "Lena Marchetti",
    collection: "figurative",
    image: img("noewe-gestural-figure_f0600b2c"),
    alt: "Expressive minimal figure drawing in ochre and charcoal on cream paper",
    description:
      "One loose sweep of sanguine, one line of charcoal. Gestural Figure is emotion drawn at full speed, framed and held still.",
    formats: {
      poster: sizes(POSTER_SIZES, -1),
      framed: sizes(FRAMED_SIZES),
      canvas: sizes(CANVAS_SIZES, 5),
    },
    frameOptions: FRAMES,
    tags: ["figurative", "drawing", "expressive"],
    featured: false,
    bestseller: false,
    rating: 4.7,
    reviewCount: 74,
    reviews: [
      {
        author: "Yuki T.",
        rating: 5,
        date: "Jun 2026",
        text: "Has so much character for such a simple piece. Love it.",
      },
    ],
  },
  {
    slug: "still-life-no-4",
    name: "Still Life No. 4",
    artist: "Studio Noewe",
    collection: "figurative",
    image: img("noewe-still-life_ad63e755"),
    alt: "Modern still-life painting of a clay amphora, fruit and linen",
    description:
      "A quiet arrangement of clay, fruit and linen. Still Life No. 4 is a contemporary classic that works anywhere.",
    formats: {
      poster: sizes(POSTER_SIZES, 2),
      framed: sizes(FRAMED_SIZES, 5),
      canvas: sizes(CANVAS_SIZES, 10),
    },
    frameOptions: FRAMES,
    tags: ["figurative", "still-life", "painterly"],
    featured: false,
    bestseller: true,
    rating: 4.8,
    reviewCount: 131,
    reviews: [
      {
        author: "Renata L.",
        rating: 5,
        date: "Jul 2026",
        text: "Warm, painterly, timeless. Framed in gold it looks genuinely expensive.",
      },
    ],
  },
];

export const getProduct = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const getCollectionProducts = (slug: string): Product[] =>
  slug === "all"
    ? products
    : products.filter((p) => p.collection === slug);

export const getCollection = (slug: string): Collection | undefined =>
  collections.find((c) => c.slug === slug);

/** Minimum price across all formats, used for filtering / sorting. */
export const productMinPrice = (p: Product): number =>
  Math.min(
    ...Object.values(p.formats).map((variants) =>
      Math.min(...variants.map((v) => v.price)),
    ),
  );

export const formatPrice = (n: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export const formatLabel = (format: Format): string =>
  ({ poster: "Poster", framed: "Framed print", canvas: "Canvas" })[format];
