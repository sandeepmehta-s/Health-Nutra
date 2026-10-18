import { createContext, useContext, useEffect, useState } from "react";
import seed from "../data/products.json";

const Ctx = createContext();
const KEY = "hn_products";
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || seed; } catch { return seed; } };

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(load);
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(products)), [products]);

  const saveProduct = (p) =>
    setProducts((list) => p.id ? list.map((x) => (x.id === p.id ? p : x)) : [...list, { ...p, id: Date.now() }]);
  const deleteProduct = (id) => setProducts((l) => l.filter((x) => x.id !== id));
  const resetProducts = () => setProducts(seed);

  return <Ctx.Provider value={{ products, saveProduct, deleteProduct, resetProducts }}>{children}</Ctx.Provider>;
}
export const useProducts = () => useContext(Ctx);
