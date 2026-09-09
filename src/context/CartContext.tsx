import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Format, Product, ShopifyVariant } from "@/lib/types";
import {
  isShopifyConfigured,
  createShopifyCart,
  getShopifyCart,
  addShopifyCartLine,
  updateShopifyCartLine,
  removeShopifyCartLine,
  type ShopifyCart,
} from "@/lib/shopify";

export interface CartItem {
  key: string;
  productSlug: string;
  name: string;
  image: string;
  artist: string;
  format: Format;
  size: string;
  dims: string;
  frame: string | null;
  qty: number;
  unitPrice: number;
  /** Original (pre-sale) unit price when the variant is on sale. */
  compareAtPrice?: number;
  /** Shopify line id when the cart is backed by the Storefront API. */
  lineId?: string;
  /** Shopify variant id when the cart is backed by the Storefront API. */
  merchandiseId?: string;
  /** Shopify variant title (used instead of format/size/frame when present). */
  variantTitle?: string;
}

interface CartContextValue {
  mode: "demo" | "shopify";
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (params: {
    product: Product;
    format: Format;
    size: string;
    frame: string | null;
    qty: number;
  }) => void;
  /** Shopify-only: adds a specific Storefront variant to the Shopify cart. */
  addVariant: (product: Product, variant: ShopifyVariant, qty: number) => void;
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  itemCount: number;
  freeShippingThreshold: number;
  /** Redirect target for Shopify-hosted checkout (null in demo mode). */
  checkoutUrl: string | null;
  cartError: string | null;
}

const FREE_SHIPPING_THRESHOLD = 75;
const STORAGE_KEY = "noewe-cart";
const SHOPIFY_CART_KEY = "noewe-shopify-cart";

const CartContext = createContext<CartContextValue | null>(null);

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

const lineToItem = (
  line: ShopifyCart["lines"][number],
): CartItem => ({
  key: line.id,
  productSlug: line.handle,
  name: line.productTitle,
  image: line.image,
  artist: "",
  format: "poster",
  size: "",
  dims: "",
  frame: null,
  qty: line.qty,
  unitPrice: line.unitPrice,
  compareAtPrice: line.compareAtPrice,
  lineId: line.id,
  merchandiseId: line.merchandiseId,
  variantTitle: line.variantTitle,
});

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const shopifyMode = isShopifyConfigured();

  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [shopifyCart, setShopifyCart] = useState<ShopifyCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  /* Restore the Shopify cart id on mount. */
  useEffect(() => {
    if (!shopifyMode) return;
    const id = localStorage.getItem(SHOPIFY_CART_KEY);
    if (!id) return;
    getShopifyCart(id)
      .then(setShopifyCart)
      .catch((e: Error) => {
        setCartError(e.message);
        setShopifyCart(null);
      });
  }, [shopifyMode]);

  /* Persist the demo cart. */
  useEffect(() => {
    if (!shopifyMode) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, shopifyMode]);

  const applyCart = useCallback(
    (cart: ShopifyCart | null) => {
      setShopifyCart(cart);
      if (cart) localStorage.setItem(SHOPIFY_CART_KEY, cart.id);
      else localStorage.removeItem(SHOPIFY_CART_KEY);
    },
    [],
  );

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  /* Demo cart: add a local line item. */
  const addItem = useCallback(
    ({
      product,
      format,
      size,
      frame,
      qty,
    }: {
      product: Product;
      format: Format;
      size: string;
      frame: string | null;
      qty: number;
    }) => {
      if (shopifyMode) return;
      const variant = product.formats[format].find((v) => v.size === size);
      if (!variant) return;
      const frameOption = frame
        ? product.frameOptions.find((f) => f.id === frame)
        : undefined;
      const frameUpcharge = format === "framed" ? frameOption?.upcharge ?? 0 : 0;
      const unitPrice = variant.price + frameUpcharge;
      const compareAtPrice =
        variant.compareAtPrice != null
          ? variant.compareAtPrice + frameUpcharge
          : undefined;

      setItems((prev) => {
        const key = [product.slug, format, size, frame ?? "none"].join("|");
        const existing = prev.find((i) => i.key === key);
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, qty: i.qty + qty } : i,
          );
        }
        return [
          ...prev,
          {
            key,
            productSlug: product.slug,
            name: product.name,
            image: product.image,
            artist: product.artist,
            format,
            size,
            dims: variant.dims,
            frame: frame ? frameOption?.label ?? null : null,
            qty,
            unitPrice,
            compareAtPrice,
          },
        ];
      });
      setIsOpen(true);
    },
    [shopifyMode],
  );

  /* Shopify cart: add a Storefront variant. */
  const addVariant = useCallback(
    (product: Product, variant: ShopifyVariant, qty: number) => {
      if (!shopifyMode) return;
      setCartError(null);
      const run = async () => {
        let cart: ShopifyCart;
        if (shopifyCart) {
          cart = await addShopifyCartLine(
            shopifyCart.id,
            variant.id,
            qty,
          );
        } else {
          cart = await createShopifyCart(variant.id, qty);
        }
        applyCart(cart);
      };
      void run().catch((e: Error) => setCartError(e.message));
      setIsOpen(true);
    },
    [shopifyMode, shopifyCart, applyCart],
  );

  const removeItem = useCallback(
    (key: string) => {
      if (shopifyMode) {
        if (!shopifyCart) return;
        removeShopifyCartLine(shopifyCart.id, [key])
          .then(applyCart)
          .catch((e: Error) => setCartError(e.message));
        return;
      }
      setItems((prev) => prev.filter((i) => i.key !== key));
    },
    [shopifyMode, shopifyCart, applyCart],
  );

  const setQty = useCallback(
    (key: string, qty: number) => {
      if (shopifyMode) {
        if (!shopifyCart) return;
        const line = shopifyCart.lines.find((l) => l.id === key);
        if (!line) return;
        if (qty <= 0) {
          removeShopifyCartLine(shopifyCart.id, [key])
            .then(applyCart)
            .catch((e: Error) => setCartError(e.message));
        } else {
          updateShopifyCartLine(shopifyCart.id, key, qty)
            .then(applyCart)
            .catch((e: Error) => setCartError(e.message));
        }
        return;
      }
      setItems((prev) =>
        qty <= 0
          ? prev.filter((i) => i.key !== key)
          : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
      );
    },
    [shopifyMode, shopifyCart, applyCart],
  );

  const clear = useCallback(() => {
    if (shopifyMode) {
      if (!shopifyCart) return;
      const ids = shopifyCart.lines.map((l) => l.id);
      if (ids.length === 0) return;
      removeShopifyCartLine(shopifyCart.id, ids)
        .then(applyCart)
        .catch((e: Error) => setCartError(e.message));
      return;
    }
    setItems([]);
  }, [shopifyMode, shopifyCart, applyCart]);

  const unifiedItems: CartItem[] = shopifyMode
    ? (shopifyCart?.lines ?? []).map(lineToItem)
    : items;

  const { subtotal, itemCount } = useMemo(() => {
    if (shopifyMode) {
      return {
        subtotal: shopifyCart?.subtotal ?? 0,
        itemCount: (shopifyCart?.lines ?? []).reduce(
          (sum, l) => sum + l.qty,
          0,
        ),
      };
    }
    return {
      subtotal: items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0),
      itemCount: items.reduce((sum, i) => sum + i.qty, 0),
    };
  }, [shopifyMode, shopifyCart, items]);

  const value: CartContextValue = {
    mode: shopifyMode ? "shopify" : "demo",
    items: unifiedItems,
    isOpen,
    openCart,
    closeCart,
    addItem,
    addVariant,
    removeItem,
    setQty,
    clear,
    subtotal,
    itemCount,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    checkoutUrl: shopifyMode ? (shopifyCart?.checkoutUrl ?? null) : null,
    cartError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
