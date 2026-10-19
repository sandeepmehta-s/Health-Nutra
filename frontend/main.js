import { store } from "./store.js";
import { NavigationManager } from "./navigation.js";

// DOM Elements
const categoryTabsContainer = document.getElementById("categoryTabs");
const productsGrid = document.getElementById("productsGrid");
const productSearchInput = document.getElementById("productSearchInput");
const productCounter = document.getElementById("productCounter");

// Modal Elements
const detailModal = document.getElementById("detailModal");
const closeDetailModalBtn = document.getElementById("closeDetailModalBtn");
const modalCloseActionBtn = document.getElementById("modalCloseActionBtn");
const modalImg = document.getElementById("modalImg");
const modalCategory = document.getElementById("modalCategory");
const modalName = document.getElementById("modalName");
const modalShortDesc = document.getElementById("modalShortDesc");
const modalPrice = document.getElementById("modalPrice");
const modalUnit = document.getElementById("modalUnit");
const modalFullDesc = document.getElementById("modalFullDesc");

// Initialize application
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize Navigation
  const navManager = new NavigationManager();
  navManager.init();

  // Subscribe UI to store state changes
  store.subscribe(renderUI);

  // Bind Search Input
  if (productSearchInput) {
    let debounceTimer;
    productSearchInput.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        store.setSearchQuery(e.target.value);
        renderProducts(store.getFilteredProducts());
      }, 200);
    });
  }

  // Bind Modal Close
  if (closeDetailModalBtn) {
    closeDetailModalBtn.addEventListener("click", () => store.closeProductModal());
  }
  if (modalCloseActionBtn) {
    modalCloseActionBtn.addEventListener("click", () => store.closeProductModal());
  }
  if (detailModal) {
    detailModal.addEventListener("click", (e) => {
      if (e.target === detailModal) store.closeProductModal();
    });
  }

  // Load store data from api.json
  await store.init();
});

// Render complete UI from state
function renderUI(state) {
  renderCategoryTabs(state.categories, state.selectedCategory);
  renderProducts(store.getFilteredProducts());
  renderDetailModal(state.selectedProduct);
}

// Render Category Filter Pills with Lucide Icons
function renderCategoryTabs(categories, selectedCategory) {
  if (!categoryTabsContainer) return;

  const allCategories = categories.includes("All") ? categories : ["All", ...categories];

  categoryTabsContainer.innerHTML = allCategories
    .map((cat) => {
      const isSelected = cat.toLowerCase() === selectedCategory.toLowerCase();
      const icon = store.getCategoryIcon(cat);

      if (isSelected) {
        return `
          <button 
            data-category="${cat}"
            class="category-tab-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-700 shadow-sm shadow-brand-700/30 transition-all scale-105"
          >
            <i data-lucide="${icon}" class="w-3.5 h-3.5"></i>
            <span>${cat}</span>
          </button>
        `;
      }

      return `
        <button 
          data-category="${cat}"
          class="category-tab-btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 transition-all"
        >
          <i data-lucide="${icon}" class="w-3.5 h-3.5 text-slate-400"></i>
          <span>${cat}</span>
        </button>
      `;
    })
    .join("");

  // Attach tab switch events
  categoryTabsContainer.querySelectorAll(".category-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cat = btn.getAttribute("data-category");
      store.setCategory(cat);
    });
  });
}

// Render Product Grid with Tailwind and Lucide Icons
function renderProducts(products) {
  if (!productsGrid) return;

  if (productCounter) {
    productCounter.textContent = `${products.length} Active Formulations`;
  }

  if (products.length === 0) {
    productsGrid.innerHTML = `
      <div class="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8">
        <div class="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center mb-4">
          <i data-lucide="package-search" class="w-8 h-8"></i>
        </div>
        <h3 class="text-lg font-bold text-slate-800">No Formulations Found</h3>
        <p class="text-sm text-slate-500 max-w-sm mx-auto mt-1">
          No active products match your current search criteria or category filter.
        </p>
        <button onclick="window.resetSearch()" class="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors">
          Clear Filters
        </button>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = products
    .map((p) => {
      const id = p.id || p._id;
      const catIcon = store.getCategoryIcon(p.category);
      const imgPath = p.image || "/uploads/9g.png";

      return `
        <article class="product-card group bg-white rounded-3xl border border-slate-200/80 hover:border-brand-500/40 p-5 shadow-sm hover:shadow-xl hover:shadow-brand-900/5 transition-all duration-300 flex flex-col justify-between">
          
          <!-- Product Thumbnail Box -->
          <div class="relative w-full h-52 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-4 overflow-hidden mb-4 group-hover:bg-brand-50/30 transition-colors">
            <img 
              src="${imgPath}" 
              alt="${p.name}" 
              class="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
              onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'flex flex-col items-center justify-center text-slate-300\\'><i data-lucide=\\'pill\\' class=\\'w-12 h-12 text-emerald-600 mb-1\\'></i><span class=\\'text-xs font-bold text-slate-400\\'>Health Nutra</span></div>'; if (window.lucide) window.lucide.createIcons();"
            >
            <span class="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-sm text-brand-800 shadow-sm border border-slate-200/60">
              <i data-lucide="${catIcon}" class="w-3 h-3 text-emerald-600"></i>
              ${p.category}
            </span>
          </div>

          <!-- Content -->
          <div class="space-y-2 flex-grow">
            <h3 class="text-base font-extrabold text-slate-900 line-clamp-1 group-hover:text-brand-700 transition-colors">
              ${p.name}
            </h3>
            <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              ${p.shortDescription || "Pure nutraceutical formulation designed for vitality."}
            </p>
          </div>

          <!-- Pricing & Action Bar -->
          <div class="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Price</span>
              <div class="flex items-baseline gap-1">
                <span class="text-lg font-black text-brand-800">₹${p.price}</span>
                <span class="text-xs font-semibold text-slate-400">/ ${p.unit || "Strip"}</span>
              </div>
            </div>

            <button 
              data-id="${id}" 
              class="view-details-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-brand-700 hover:text-white transition-all shadow-sm group-hover:bg-brand-700 group-hover:text-white"
            >
              <i data-lucide="eye" class="w-3.5 h-3.5"></i>
              <span>Details</span>
            </button>
          </div>

        </article>
      `;
    })
    .join("");

  // Attach View Details Click Events
  productsGrid.querySelectorAll(".view-details-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      store.openProductModal(id);
    });
  });
}

// Render Detail Modal
function renderDetailModal(product) {
  if (!detailModal) return;

  if (!product) {
    detailModal.classList.add("hidden");
    return;
  }

  modalImg.src = product.image || "/uploads/9g.png";
  modalName.textContent = product.name;
  modalShortDesc.textContent = product.shortDescription || "";
  modalCategory.innerHTML = `
    <i data-lucide="${store.getCategoryIcon(product.category)}" class="w-3.5 h-3.5"></i>
    <span>${product.category}</span>
  `;
  modalPrice.textContent = `₹${product.price}`;
  modalUnit.textContent = `/ ${product.unit || "Strip"}`;
  modalFullDesc.textContent = product.fullDescription || product.shortDescription || "No detailed clinical description provided.";

  detailModal.classList.remove("hidden");
}

// Helper to reset search
window.resetSearch = () => {
  if (productSearchInput) productSearchInput.value = "";
  store.setSearchQuery("");
  store.setCategory("All");
};
