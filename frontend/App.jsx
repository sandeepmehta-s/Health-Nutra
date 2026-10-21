/**
 * Health Nutra - Main Application Controller
 * Routes between HomePage, ProductsPage, AboutUsPage, ContactUsPage, AdminPage, and LoginPage.
 */

function App() {
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Route selector
  if (currentPath === "/admin/login") {
    return <LoginPage />;
  }

  if (currentPath.startsWith("/admin")) {
    return <AdminPage />;
  }

  if (currentPath === "/about-us" || currentPath === "/about-us/") {
    return <AboutUsPage />;
  }

  if (currentPath === "/products" || currentPath === "/products/") {
    return <ProductsPage />;
  }

  if (
    currentPath.startsWith("/product/") ||
    currentPath === "/product" ||
    currentPath === "/product/" ||
    (currentPath.startsWith("/products/") && currentPath !== "/products/")
  ) {
    return <ProductDetailPage />;
  }

  if (
    currentPath === "/contact-us" ||
    currentPath === "/contact-us/" ||
    currentPath === "/contact" ||
    currentPath === "/contact/"
  ) {
    return <ContactUsPage />;
  }

  return <HomePage />;
}

// Render React 18 Application Root
const rootElement = document.getElementById("root");
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

if (typeof window !== "undefined") {
  window.App = App;
}
