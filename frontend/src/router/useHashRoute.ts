import { useCallback, useEffect, useState } from "react";


export type Route =
  | { view: "kitchen" }
  | { view: "cashier" }
  | { view: "order" }
  | { view: "track"; orderId: string };

export type RoutePath = "kitchen" | "cashier" | "order" | `track/${string}`;

function parseHash(hash: string): Route {
  const segments = hash.replace(/^#\/?/, "").split("/").filter(Boolean);

  switch (segments[0]) {
    case "cashier":
      return { view: "cashier" };
    case "order":
      return { view: "order" };
    case "track":
      if (segments[1]) {
        return { view: "track", orderId: segments[1] };
      }
      return { view: "order" };
    default:
      return { view: "kitchen" };
  }
}

export function useHashRoute(): {
  route: Route;
  navigate: (to: RoutePath) => void;
} {
  const [route, setRoute] = useState<Route>(() =>
    parseHash(window.location.hash)
  );

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((to: RoutePath) => {
    window.location.hash = `/${to}`;
  }, []);

  return { route, navigate };
}
