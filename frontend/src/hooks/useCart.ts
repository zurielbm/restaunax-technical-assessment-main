import { useCallback, useState } from "react";
import { MenuItem } from "../../../shared/types";

export interface CartLine {
  item: MenuItem;
  quantity: number;
}

interface CartResult {
  lines: CartLine[];
  total: number;
  add: (item: MenuItem) => void;
  changeQuantity: (itemId: string, delta: number) => void;
  clear: () => void;
}

export function useCart(): CartResult {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = useCallback((item: MenuItem) => {
    setLines((current) => {
      const existing = current.find((line) => line.item.id === item.id);
      if (!existing) return [...current, { item, quantity: 1 }];
      return current.map((line) =>
        line.item.id === item.id
          ? { ...line, quantity: line.quantity + 1 }
          : line,
      );
    });
  }, []);

  const changeQuantity = useCallback((itemId: string, delta: number) => {
    setLines((current) =>
      current.flatMap((line) => {
        if (line.item.id !== itemId) return [line];
        const quantity = line.quantity + delta;
        return quantity <= 0 ? [] : [{ ...line, quantity }];
      }),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const totalCents = lines.reduce(
    (sum, line) => sum + Math.round(line.item.price * 100) * line.quantity,
    0,
  );

  return { lines, total: totalCents / 100, add, changeQuantity, clear };
}
