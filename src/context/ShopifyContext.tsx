import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Collection, Product } from "@/lib/types";
import {
  isShopifyConfigured,
  getShopifyCollections,
  getShopifyCollectionProducts,
} from "@/lib/shopify";

interface ShopifyContextValue {
  /** "demo" when no credentials are set, "loading"/"ready"/"error" otherwise. */
  status: "demo" | "loading" | "ready" | "error";
  products: Product[];
  collections: Collection[];
  error: string | null;
  reload: () => void;
}

const ShopifyContext = createContext<ShopifyContextValue | null>(null);

const loadCatalog = async () => {
  const collections = await getShopifyCollections();
  const byId = new Map<string, Product>();
  // Fetch each collection's products so every product is tagged with its collection.
  await Promise.all(
    collections.map(async (c) => {
      const products = await getShopifyCollectionProducts(c.slug);
      products.forEach((p) => {
        if (p.shopifyId) byId.set(p.shopifyId, p);
      });
    }),
  );
  return { collections, products: Array.from(byId.values()) };
};

export const ShopifyProvider = ({ children }: { children: ReactNode }) => {
  const [status, setStatus] = useState<
    "demo" | "loading" | "ready" | "error"
  >(isShopifyConfigured() ? "loading" : "demo");
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (!isShopifyConfigured()) {
      setStatus("demo");
      setProducts([]);
      setCollections([]);
      setError(null);
      return;
    }
    setStatus("loading");
    setError(null);
    loadCatalog()
      .then(({ collections: c, products: p }) => {
        setCollections(c);
        setProducts(p);
        setStatus("ready");
      })
      .catch((e: Error) => {
        setError(e.message);
        setStatus("error");
      });
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <ShopifyContext.Provider
      value={{ status, products, collections, error, reload }}
    >
      {children}
    </ShopifyContext.Provider>
  );
};

export const useShopify = (): ShopifyContextValue => {
  const ctx = useContext(ShopifyContext);
  if (!ctx) throw new Error("useShopify must be used within a ShopifyProvider");
  return ctx;
};
