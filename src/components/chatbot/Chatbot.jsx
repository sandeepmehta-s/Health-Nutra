import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useProducts } from "../../context/ProductContext";

// Simple rule-based bot. Swap `getReply` with an API call to use a real AI backend.
function getReply(q, products) {
  q = q.toLowerCase();
  const p = products.find((x) => [...x.name.toLowerCase().split(" "), x.cat.toLowerCase()].some((w) => w.length > 3 && !["health", "nutra"].includes(w) && q.includes(w)));
  if (p) return `${p.name}: ${p.desc} Price ₹${p.price} / ${p.unit}.`;
  if (/price|cost|rate/.test(q)) return products.map((x) => `${x.name} - ₹${x.price}/${x.unit}`).join("\n");
  if (/product|medicine|available|list/.test(q)) return "We offer: " + products.map((x) => x.name).join(", ") + ".";
  if (/order|buy|cart/.test(q)) return "Open a product, tap Add to Cart or Buy Now, then fill in your details at checkout.";
  if (/contact|phone|call|email|address/.test(q)) return "Call +91 98765 43210 or email healthnutra16@gmail.com.";
  if (/hi|hello|hey/.test(q)) return "Hello! Ask me about our products, prices or how to order.";
  return "Sorry, I didn't get that. Try asking about products, prices, ordering or contact details.";
}

export default function Chatbot() {
  const { products } = useProducts();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState([{ from: "bot", text: "Hi! I'm the Health Nutra assistant. How can I help?" }]);
  const end = useRef();
  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, open]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setMsgs((m) => [...m, { from: "me", text }, { from: "bot", text: getReply(text, products) }]);
    setText("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open && (
        <div className="mb-3 flex h-96 w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-lg bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-green-800 px-4 py-3 text-white"><b>Health Nutra Assistant</b><button onClick={() => setOpen(false)}><X size={18} /></button></div>
          <div className="flex-1 space-y-2 overflow-y-auto bg-green-50 p-3 text-sm">
            {msgs.map((m, i) => <div key={i} className={`flex ${m.from === "me" ? "justify-end" : ""}`}><p className={`max-w-[80%] whitespace-pre-line rounded-lg px-3 py-2 ${m.from === "me" ? "bg-orange-500 text-white" : "bg-white shadow"}`}>{m.text}</p></div>)}
            <div ref={end} />
          </div>
          <form onSubmit={send} className="flex gap-2 border-t p-2">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." className="flex-1 rounded border px-3 py-2 text-sm" />
            <button className="rounded bg-green-800 px-3 text-white" aria-label="Send"><Send size={16} /></button>
          </form>
        </div>
      )}
      <button onClick={() => setOpen(!open)} className="ml-auto grid h-14 w-14 place-items-center rounded-full bg-orange-500 text-white shadow-lg hover:bg-orange-600" aria-label="Chat"><MessageCircle /></button>
    </div>
  );
}
