import { createContext, useContext, useEffect, useState } from "react";
import { useProducts } from "./ProductContext";

const Ctx = createContext();
const KEY = "hn_cart";

export function CartProvider({ children }) {
  const { products } = useProducts();
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } });
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(items)), [items]);

  const add = (id, qty = 1) =>
    setItems((l) => l.some((i) => i.id === id) ? l.map((i) => i.id === id ? { ...i, qty: i.qty + qty } : i) : [...l, { id, qty }]);
  const setQty = (id, qty) => setItems((l) => qty < 1 ? l.filter((i) => i.id !== id) : l.map((i) => i.id === id ? { ...i, qty } : i));
  const remove = (id) => setItems((l) => l.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const lines = items.map((i) => ({ ...products.find((p) => p.id === i.id), qty: i.qty })).filter((l) => l.name);
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  return <Ctx.Provider value={{ lines, total, count, add, setQty, remove, clear }}>{children}</Ctx.Provider>;
}
export const useCart = () => useContext(Ctx);
