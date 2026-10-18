import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ProductProvider } from "./context/ProductContext";
import { CartProvider } from "./context/CartContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ProductProvider><CartProvider><App /></CartProvider></ProductProvider>
  </BrowserRouter>
);
