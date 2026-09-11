import type { Collection, Product, ShopifyVariant } from "./types";

/**
 * Shopify headless configuration.
 *
 * Set `storeDomain` (e.g. "yourstore.myshopify.com") and the **Storefront API**
 * access token from Shopify Admin → Settings → Apps and sales channels →
 * Develop apps → your app → Storefront API integration.
 *
 * Use the *Storefront API* access token (a 32-character public token), NOT the
 * Admin API token that starts with "shpat_" — that one is secret and must never
 * be shipped in frontend code. Storefront API tokens are designed by Shopify to
 * be publishable in frontend code, so they are safe to keep in the app bundle.
 */
export const SHOPIFY_CONFIG = {
  storeDomain: "7yqn60-s2.myshopify.com",
  storefrontAccessToken: "",
  apiVersion: "2026-07",
};

export const isShopifyConfigured = (): boolean =>
  Boolean(
    SHOPIFY_CONFIG.storeDomain && SHOPIFY_CONFIG.storefrontAccessToken,
  );

export class ShopifyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ShopifyError";
  }
}

const money = (s?: string | null): number =>
  s ? Math.round(Number(s) * 100) / 100 : 0;

async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (!isShopifyConfigured()) {
    throw new ShopifyError(
      "Shopify is not configured yet. Add your store domain and Storefront API access token.",
    );
  }
  const res = await fetch(
    `https://${SHOPIFY_CONFIG.storeDomain}/api/${SHOPIFY_CONFIG.apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token":
          SHOPIFY_CONFIG.storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  const json = (await res.json()) as {
    data?: T;
    errors?: { message: string }[];
  };
  if (!res.ok || json.errors?.length || json.data == null) {
    throw new ShopifyError(
      json.errors?.[0]?.message ?? `Shopify request failed (${res.status})`,
    );
  }
  return json.data;
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

const PRODUCT_FIELDS = `
  id
  handle
  title
  description
  tags
  featuredImage { url altText }
  priceRange { minVariantPrice { amount currencyCode } }
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
  variants(first: 100) {
    edges { node {
      id
      title
      availableForSale
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
      image { url altText }
    } }
  }
`;

interface ShopifyProductNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  tags: string[];
  featuredImage?: { url: string; altText?: string | null };
  variants?: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price?: { amount: string };
        compareAtPrice?: { amount: string } | null;
        image?: { url: string } | null;
      };
    }[];
  };
}

/** Maps a Storefront API product node into the app's Product shape. */
export const mapShopifyProduct = (
  node: ShopifyProductNode,
  collection: string,
): Product => {
  const images: string[] = [];
  if (node.featuredImage?.url) images.push(node.featuredImage.url);
  node.variants?.edges.forEach(({ node: v }) => {
    if (v.image?.url && !images.includes(v.image.url)) images.push(v.image.url);
  });

  const shopifyVariants: ShopifyVariant[] = (
    node.variants?.edges ?? []
  ).map(({ node: v }) => ({
    id: v.id,
    title: v.title,
    price: money(v.price?.amount),
    compareAtPrice:
      v.compareAtPrice?.amount != null ? money(v.compareAtPrice.amount) : undefined,
    availableForSale: v.availableForSale,
    image: v.image?.url,
  }));

  const prices = shopifyVariants.map((v) => v.price);
  const comparePrices = shopifyVariants
    .map((v) => v.compareAtPrice)
    .filter((p): p is number => p != null);

  return {
    slug: node.handle,
    name: node.title,
    artist: "Noewe",
    collection,
    image: images[0] ?? "",
    images,
    alt: node.featuredImage?.altText ?? node.title,
    description: node.description ?? "",
    formats: {} as Product["formats"],
    frameOptions: [],
    tags: node.tags ?? [],
    featured: false,
    bestseller: false,
    rating: 0,
    reviewCount: 0,
    reviews: [],
    source: "shopify",
    shopifyId: node.id,
    shopifyVariants,
    minPrice: prices.length ? Math.min(...prices) : 0,
    minComparePrice: comparePrices.length ? Math.min(...comparePrices) : undefined,
    hasSale: shopifyVariants.some(
      (v) => v.compareAtPrice != null && v.compareAtPrice > v.price,
    ),
  };
};

export const getShopifyProducts = async (
  first = 100,
): Promise<Product[]> => {
  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProductNode }[] };
  }>(`query Products($first: Int!) {
    products(first: $first) { edges { node { ${PRODUCT_FIELDS} } } }
  }`, { first });
  return data.products.edges.map(({ node }) => mapShopifyProduct(node, "all"));
};

export const getShopifyProductByHandle = async (
  handle: string,
): Promise<Product | null> => {
  const data = await shopifyFetch<{
    productByHandle: ShopifyProductNode | null;
  }>(`query Product($handle: String!) {
    productByHandle(handle: $handle) { ${PRODUCT_FIELDS} }
  }`, { handle });
  return data.productByHandle
    ? mapShopifyProduct(data.productByHandle, "all")
    : null;
};

/* ------------------------------------------------------------------ */
/* Collections                                                         */
/* ------------------------------------------------------------------ */

interface ShopifyCollectionNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: { url: string } | null;
}

const mapShopifyCollection = (node: ShopifyCollectionNode): Collection => ({
  slug: node.handle,
  name: node.title,
  blurb: node.description,
  image: node.image?.url ?? "",
});

export const getShopifyCollections = async (
  first = 50,
): Promise<Collection[]> => {
  const data = await shopifyFetch<{
    collections: { edges: { node: ShopifyCollectionNode }[] };
  }>(`query Collections($first: Int!) {
    collections(first: $first) { edges { node { id handle title description image { url } } } }
  }`, { first });
  return data.collections.edges.map(({ node }) =>
    mapShopifyCollection(node),
  );
};

/** Returns the products belonging to one collection (for catalog tagging). */
export const getShopifyCollectionProducts = async (
  handle: string,
  first = 100,
): Promise<Product[]> => {
  const data = await shopifyFetch<{
    collectionByHandle: {
      products: { edges: { node: ShopifyProductNode }[] };
    } | null;
  }>(`query CollectionProducts($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      products(first: $first) { edges { node { ${PRODUCT_FIELDS} } } }
    }
  }`, { handle, first });
  return (
    data.collectionByHandle?.products.edges.map(({ node }) =>
      mapShopifyProduct(node, handle),
    ) ?? []
  );
};

/* ------------------------------------------------------------------ */
/* Cart (Storefront Cart API — the 2026 supported model)               */
/* ------------------------------------------------------------------ */

export interface ShopifyCartLine {
  id: string;
  merchandiseId: string;
  variantTitle: string;
  productTitle: string;
  handle: string;
  image: string;
  qty: number;
  unitPrice: number;
  compareAtPrice?: number;
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: ShopifyCartLine[];
  subtotal: number;
  currencyCode: string;
}

interface CartNode {
  id: string;
  checkoutUrl: string;
  cost?: { subtotalAmount?: { amount: string; currencyCode: string } };
  lines?: {
    edges: {
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title?: string;
          price?: { amount: string };
          compareAtPrice?: { amount: string } | null;
          product?: { handle: string; title: string; featuredImage?: { url: string } | null };
        };
      };
    }[];
  };
}

const CART_FIELDS = `
  id
  checkoutUrl
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 50) {
    edges { node {
      id
      quantity
      merchandise { ... on ProductVariant {
        id
        title
        price { amount currencyCode }
        compareAtPrice { amount currencyCode }
        product { handle title featuredImage { url } }
      } }
    } }
  }
`;

const mapCartNode = (cart: CartNode): ShopifyCart => ({
  id: cart.id,
  checkoutUrl: cart.checkoutUrl,
  lines: (cart.lines?.edges ?? []).map(({ node }) => ({
    id: node.id,
    merchandiseId: node.merchandise.id,
    variantTitle: node.merchandise.title ?? "",
    productTitle: node.merchandise.product?.title ?? "Product",
    handle: node.merchandise.product?.handle ?? "",
    image: node.merchandise.product?.featuredImage?.url ?? "",
    qty: node.quantity,
    unitPrice: money(node.merchandise.price?.amount),
    compareAtPrice:
      node.merchandise.compareAtPrice?.amount != null
        ? money(node.merchandise.compareAtPrice.amount)
        : undefined,
  })),
  subtotal: money(cart.cost?.subtotalAmount?.amount),
  currencyCode: cart.cost?.subtotalAmount?.currencyCode ?? "USD",
});

export const createShopifyCart = async (
  merchandiseId: string,
  quantity: number,
): Promise<ShopifyCart> => {
  const data = await shopifyFetch<{ cartCreate: { cart: CartNode | null } }>(
    `mutation CartCreate($merchandiseId: ID!, $quantity: Int!) {
      cartCreate(input: { lines: [{ merchandiseId: $merchandiseId, quantity: $quantity }] }) {
        cart { ${CART_FIELDS} }
      }
    }`,
    { merchandiseId, quantity },
  );
  if (!data.cartCreate.cart) throw new ShopifyError("Could not create the cart.");
  return mapCartNode(data.cartCreate.cart);
};

export const getShopifyCart = async (cartId: string): Promise<ShopifyCart> => {
  const data = await shopifyFetch<{ cart: CartNode | null }>(
    `query Cart($cartId: ID!) { cart(id: $cartId) { ${CART_FIELDS} } }`,
    { cartId },
  );
  if (!data.cart) throw new ShopifyError("Cart not found.");
  return mapCartNode(data.cart);
};

export const addShopifyCartLine = async (
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<ShopifyCart> => {
  const data = await shopifyFetch<{
    cartLinesAdd: { cart: CartNode | null };
  }>(
    `mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } }
    }`,
    { cartId, lines: [{ merchandiseId, quantity }] },
  );
  if (!data.cartLinesAdd.cart) throw new ShopifyError("Could not update the cart.");
  return mapCartNode(data.cartLinesAdd.cart);
};

export const updateShopifyCartLine = async (
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<ShopifyCart> => {
  const data = await shopifyFetch<{
    cartLinesUpdate: { cart: CartNode | null };
  }>(
    `mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { ${CART_FIELDS} } }
    }`,
    { cartId, lines: [{ id: lineId, quantity }] },
  );
  if (!data.cartLinesUpdate.cart) throw new ShopifyError("Could not update the cart.");
  return mapCartNode(data.cartLinesUpdate.cart);
};

export const removeShopifyCartLine = async (
  cartId: string,
  lineIds: string[],
): Promise<ShopifyCart> => {
  const data = await shopifyFetch<{
    cartLinesRemove: { cart: CartNode | null };
  }>(
    `mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { ${CART_FIELDS} } }
    }`,
    { cartId, lineIds },
  );
  if (!data.cartLinesRemove.cart) throw new ShopifyError("Could not update the cart.");
  return mapCartNode(data.cartLinesRemove.cart);
};
