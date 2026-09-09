import { useShopify } from "@/context/ShopifyContext";
import {
  products as demoProducts,
  collections as demoCollections,
} from "@/lib/products";
import type { Collection, Product } from "@/lib/types";

export interface Catalog {
  products: Product[];
  collections: Collection[];
  status: "demo" | "loading" | "ready" | "error";
  error: string | null;
}

/**
 * Single source of products/collections for the storefront.
 * Returns live Shopify data when configured, otherwise falls back to the
 * built-in demo catalog so the store keeps working without credentials.
 */
export const useCatalog = (): Catalog => {
  const shopify = useShopify();
  if (shopify.status === "ready" && shopify.products.length > 0) {
    return {
      products: shopify.products,
      collections: shopify.collections,
      status: shopify.status,
      error: null,
    };
  }
  return {
    products: demoProducts,
    collections: demoCollections,
    status: shopify.status === "loading" ? "loading" : "demo",
    error: shopify.error,
  };
};

/** Price helper that works for both demo (formats) and Shopify (minPrice) products. */
export const priceOf = (p: Product): number =>
  p.minPrice != null ? p.minPrice : demoPriceOf(p);

const demoPriceOf = (p: Product): number =>
  Math.min(
    ...Object.values(p.formats).map((variants) =>
      Math.min(...variants.map((v) => v.price)),
    ),
  );
