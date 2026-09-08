import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Format, Product } from "@/lib/types";

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
}

interface CartContextValue {
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
  removeItem: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  subtotal: number;
  itemCount: number;
  freeShippingThreshold: number;
}

const FREE_SHIPPING_THRESHOLD = 75;
const STORAGE_KEY = "noewe-cart";

const CartContext = createContext<CartContextValue | null>(null);

const loadCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(loadCart);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

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
    [],
  );

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.key !== key)
        : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { subtotal, itemCount } = useMemo(
    () => ({
      subtotal: items.reduce((sum, i) => sum + i.unitPrice * i.qty, 0),
      itemCount: items.reduce((sum, i) => sum + i.qty, 0),
    }),
    [items],
  );

  const value: CartContextValue = {
    items,
    isOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    setQty,
    clear,
    subtotal,
    itemCount,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
