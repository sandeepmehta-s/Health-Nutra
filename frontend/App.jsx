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

  const cleanPath = currentPath.toLowerCase().replace(/\/$/, "");

  if (
    cleanPath === "/omega" ||
    cleanPath === "/omega-3" ||
    cleanPath === "/omega3" ||
    cleanPath === "/9g" ||
    cleanPath === "/10q" ||
    cleanPath === "/green-tea" ||
    cleanPath === "/greentea" ||
    cleanPath.startsWith("/product/") ||
    cleanPath === "/product" ||
    (cleanPath.startsWith("/products/") && cleanPath !== "/products")
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

  if (
    currentPath === "/privacy-policy" ||
    currentPath === "/privacy-policy/" ||
    currentPath === "/privacy" ||
    currentPath === "/privacy/"
  ) {
    return <PrivacyPolicyPage />;
  }

  if (
    currentPath === "/terms-and-conditions" ||
    currentPath === "/terms-and-conditions/" ||
    currentPath === "/terms" ||
    currentPath === "/terms/" ||
    currentPath === "/terms-of-supply" ||
    currentPath === "/terms-of-supply/"
  ) {
    return <TermsPage />;
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
