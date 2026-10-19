import { createContext, useContext, useEffect, useState } from "react";
import seed from "../data/products.json";

const Ctx = createContext();
const KEY = "hn_products";
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || seed; } catch { return seed; } };

export function ProductProvider({ children }) {
  const [products, setProducts] = useState(load);

  useEffect(() => {
    // Try fetching from backend API if available
    fetch("/api/products")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map((p) => ({
            id: p._id || p.id,
            name: p.name,
            desc: p.shortDescription || p.desc,
            details: p.fullDescription || p.details,
            price: p.price,
            unit: p.unit || "Strip",
            cat: p.category || p.cat,
            img: p.image || p.img || "/uploads/9g.png",
            stock: p.stock || 100,
          }));
          setProducts(mapped);
        }
      })
      .catch(() => {
        // Backend not running, keep local storage / seed
      });
  }, []);

  useEffect(() => localStorage.setItem(KEY, JSON.stringify(products)), [products]);

  const saveProduct = (p) =>
    setProducts((list) => p.id ? list.map((x) => (x.id === p.id ? p : x)) : [...list, { ...p, id: Date.now() }]);
  const deleteProduct = (id) => setProducts((l) => l.filter((x) => x.id !== id));
  const resetProducts = () => setProducts(seed);

  return <Ctx.Provider value={{ products, saveProduct, deleteProduct, resetProducts }}>{children}</Ctx.Provider>;
}
export const useProducts = () => useContext(Ctx);
