import Hero from "../components/home/Hero";
import ProductGrid from "../components/home/ProductGrid";
import About from "../components/home/About";
import Leadership from "../components/home/Leadership";
import Contact from "../components/home/Contact";

export default function Home() {
  return <><Hero /><ProductGrid limit={4} /><About /><Leadership /><Contact /></>;
}
