import { useState } from "react";
import { Lock, Shield, Plus, Edit2, Trash2, RotateCcw, LogOut, Package, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import Logo from "../components/common/Logo";

const EMPTY = { name: "", desc: "", details: "", price: "", unit: "Strip", cat: "", img: "", stock: "" };

export default function Admin() {
  const [authed, setAuthed] = useState(sessionStorage.getItem("hn_admin") === "1");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [err, setErr] = useState("");
  const { products, saveProduct, deleteProduct, resetProducts } = useProducts();
  const [form, setForm] = useState(EMPTY);
  const [filter, setFilter] = useState("");

  const on = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const input =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-700/20";

  const handleLogin = (e) => {
    e.preventDefault();
    const correctPass = import.meta.env.VITE_ADMIN_PASS || "change-me";
    if (pass === correctPass) {
      sessionStorage.setItem("hn_admin", "1");
      setAuthed(true);
      setErr("");
    } else {
      setErr("Invalid administrator password. Please try again.");
    }
  };

  if (!authed) {
    return (
      <div className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-8 shadow-xl text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <Logo />
          </div>
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-800">
            <Lock size={22} />
          </div>
          <h1 className="text-xl font-black text-green-950">Admin Authentication</h1>
          <p className="mt-1 text-xs text-gray-500 mb-6">Enter password to manage inventory and products.</p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter admin password"
                  className={input}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {err && <p className="text-xs font-semibold text-rose-600">{err}</p>}

            <button
              type="submit"
              className="w-full rounded-xl bg-green-800 py-3 text-xs font-bold text-white shadow-md shadow-green-900/20 hover:bg-green-900 transition-all"
            >
              Authenticate & Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    saveProduct({ ...form, price: Number(form.price), stock: Number(form.stock) });
    setForm(EMPTY);
  };

  const displayedProducts = filter
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(filter.toLowerCase()) ||
          p.cat.toLowerCase().includes(filter.toLowerCase())
      )
    : products;

  return (
    <div className="flex-1 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
          <div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
              Administrative Control Panel
            </span>
            <h1 className="mt-1 text-3xl font-black text-green-950">Product & Inventory Management</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => confirm("Reset all products to factory defaults?") && resetProducts()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              <RotateCcw size={14} /> Reset Defaults
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("hn_admin");
                setAuthed(false);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Add / Edit Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
              <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-green-950">
                <Plus size={18} className="text-orange-500" />
                {form.id ? "Edit Formulation" : "Create New Product"}
              </h2>

              <form onSubmit={submit} className="space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">Product Name *</label>
                  <input required placeholder="e.g. Health Nutra 9G" className={input} value={form.name} onChange={on("name")} />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">Short Summary *</label>
                  <input required placeholder="e.g. Complete daily nutrition with vitamins" className={input} value={form.desc} onChange={on("desc")} />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">Detailed Description</label>
                  <textarea rows={3} placeholder="Full benefits and dosage instructions" className={input} value={form.details} onChange={on("details")} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-gray-700">Price (₹) *</label>
                    <input required type="number" min="0" placeholder="235" className={input} value={form.price} onChange={on("price")} />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-gray-700">Unit Type</label>
                    <input placeholder="Strip / Box / 200ml" className={input} value={form.unit} onChange={on("unit")} />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-gray-700">Category *</label>
                    <input required placeholder="Multivitamin" className={input} value={form.cat} onChange={on("cat")} />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold text-gray-700">Inventory Stock *</label>
                    <input required type="number" min="0" placeholder="100" className={input} value={form.stock} onChange={on("stock")} />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-gray-700">Image Asset Path / URL</label>
                  <input placeholder="/images/9g.png" className={input} value={form.img} onChange={on("img")} />
                </div>

                {/* Form Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-green-800 py-3 text-xs font-bold text-white shadow-md shadow-green-900/20 hover:bg-green-900"
                  >
                    {form.id ? "Update Product" : "Publish Product"}
                  </button>
                  {form.id && (
                    <button
                      type="button"
                      onClick={() => setForm(EMPTY)}
                      className="rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Product Inventory Table */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-100 p-4">
                <span className="text-xs font-bold text-gray-700">Active Catalog ({products.length})</span>
                <input
                  type="text"
                  placeholder="Filter products..."
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs focus:outline-none"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5">Product</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {displayedProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-50 p-1">
                              <img
                                src={p.img}
                                alt=""
                                onError={(e) => {
                                  e.currentTarget.src = "/images/hero-showcase.png";
                                }}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <span className="font-bold text-gray-900">{p.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                            {p.cat}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-green-900">₹{p.price} / {p.unit}</td>
                        <td className="p-3.5">
                          <span className={`font-semibold ${p.stock > 0 ? "text-emerald-700" : "text-rose-600"}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => {
                              setForm(p);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="inline-flex items-center gap-1 text-emerald-700 hover:underline font-bold"
                          >
                            <Edit2 size={12} /> Edit
                          </button>
                          <button
                            onClick={() => confirm(`Delete ${p.name}?`) && deleteProduct(p.id)}
                            className="inline-flex items-center gap-1 text-rose-600 hover:underline font-bold"
                          >
                            <Trash2 size={12} /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
