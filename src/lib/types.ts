export type Format = "poster" | "framed" | "canvas";

export const FORMAT_LABELS: Record<Format, string> = {
  poster: "Poster",
  framed: "Framed print",
  canvas: "Canvas",
};

export const FORMATS: Format[] = ["poster", "framed", "canvas"];

export interface VariantPrice {
  /** Human-friendly size label, e.g. "50 × 70" */
  size: string;
  /** Exact dimensions, e.g. "50 × 70 cm" */
  dims: string;
  /** Sale price in USD (frame upcharge added separately) */
  price: number;
  /** Original price before the current sale. Present = the variant is on sale. */
  compareAtPrice?: number;
}

export interface FrameOption {
  id: string;
  label: string;
  upcharge: number;
}

export interface Review {
  author: string;
  rating: number;
  date: string;
  text: string;
}

export type CollectionSlug = "abstract" | "botanical" | "architecture" | "figurative";

export interface Collection {
  slug: CollectionSlug;
  name: string;
  blurb: string;
  image: string;
}

export interface Product {
  slug: string;
  name: string;
  artist: string;
  collection: CollectionSlug;
  /** Primary artwork image */
  image: string;
  /** Gallery images shown on the product page (artwork, lifestyle, detail). */
  images: string[];
  alt: string;
  description: string;
  /** Longer editorial description for the product page. */
  longDescription?: string;
  formats: Record<Format, VariantPrice[]>;
  frameOptions: FrameOption[];
  tags: string[];
  featured: boolean;
  bestseller: boolean;
  rating: number;
  reviewCount: number;
  reviews: Review[];
}
