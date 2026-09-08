import { StoreLayout } from "./components/store/StoreLayout";
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import NotFound from "./pages/NotFound";

export const routers = [
  {
    path: "/",
    element: <StoreLayout />,
    children: [
      { path: "/", name: "home", element: <Index /> },
      { path: "/collections/:slug", name: "collection", element: <Collection /> },
      { path: "/products/:slug", name: "product", element: <Product /> },
      { path: "/cart", name: "cart", element: <Cart /> },
    ],
  },
  /* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */
  {
    path: "*",
    name: "404",
    element: <NotFound />,
  },
];

declare global {
  interface Window {
    __routers__: typeof routers;
  }
}

window.__routers__ = routers;
