/**
 * Health Nutra - Dynamic Navigation Component
 * Handles responsive desktop/mobile navbar, Lucide icons, scrollspy, and admin state.
 */

export const NAV_ITEMS = [
  { id: "hero", label: "Home", href: "#hero", icon: "home" },
  { id: "products", label: "Products Catalog", href: "#products", icon: "pill" },
  { id: "about", label: "Quality Standards", href: "#about", icon: "shield-check" },
  { id: "contact", label: "Contact & Order", href: "#contact", icon: "phone" },
  {
    id: "admin",
    label: "Admin Portal",
    href: "/admin",
    icon: "lock",
    isSpecial: true,
  },
];

export class NavigationManager {
  constructor() {
    this.desktopContainer = document.getElementById("navLinksDesktop");
    this.mobileContainer = document.getElementById("navLinksMobile");
    this.mobileToggleBtn = document.getElementById("mobileToggleBtn");
    this.mobileMenu = document.getElementById("mobileMenu");
    this.activeSection = "hero";
  }

  init() {
    this.renderDesktop();
    this.renderMobile();
    this.bindEvents();
    this.checkAdminSession();
    this.refreshIcons();
  }

  renderDesktop() {
    if (!this.desktopContainer) return;
    this.desktopContainer.innerHTML = NAV_ITEMS.map((item) => {
      if (item.isSpecial) {
        return `
          <a href="${item.href}" class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all transform hover:-translate-y-0.5" id="navAdminBtn">
            <i data-lucide="${item.icon}" class="w-4 h-4"></i>
            <span>${item.label}</span>
          </a>
        `;
      }
      return `
        <a href="${item.href}" data-nav="${item.id}" class="nav-link inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all">
          <i data-lucide="${item.icon}" class="w-4 h-4 text-emerald-600"></i>
          <span>${item.label}</span>
        </a>
      `;
    }).join("");
  }

  renderMobile() {
    if (!this.mobileContainer) return;
    this.mobileContainer.innerHTML = NAV_ITEMS.map((item) => {
      if (item.isSpecial) {
        return `
          <a href="${item.href}" class="flex items-center justify-between w-full p-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-amber-500 shadow-md mt-2">
            <span class="inline-flex items-center gap-2">
              <i data-lucide="${item.icon}" class="w-4 h-4"></i>
              ${item.label}
            </span>
            <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </a>
        `;
      }
      return `
        <a href="${item.href}" data-nav="${item.id}" class="mobile-nav-link flex items-center gap-3 p-3 rounded-xl text-sm font-semibold text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 transition-all">
          <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <i data-lucide="${item.icon}" class="w-4 h-4"></i>
          </div>
          <span>${item.label}</span>
        </a>
      `;
    }).join("");
  }

  bindEvents() {
    // Mobile Hamburger Toggle
    if (this.mobileToggleBtn && this.mobileMenu) {
      this.mobileToggleBtn.addEventListener("click", () => {
        const isHidden = this.mobileMenu.classList.toggle("hidden");
        const icon = this.mobileToggleBtn.querySelector("i");
        if (icon) {
          icon.setAttribute("data-lucide", isHidden ? "menu" : "x");
          this.refreshIcons();
        }
      });

      // Close mobile menu on link click
      this.mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          this.mobileMenu.classList.add("hidden");
          const icon = this.mobileToggleBtn.querySelector("i");
          if (icon) {
            icon.setAttribute("data-lucide", "menu");
            this.refreshIcons();
          }
        });
      });
    }

    // ScrollSpy for highlighting active section
    window.addEventListener("scroll", () => {
      this.handleScrollSpy();
    });
  }

  handleScrollSpy() {
    const sections = ["hero", "products", "about", "contact"];
    const scrollPos = window.scrollY + 120;

    for (const sectionId of sections) {
      const el = document.getElementById(sectionId);
      if (el) {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          if (this.activeSection !== sectionId) {
            this.activeSection = sectionId;
            this.updateActiveStyles();
          }
          break;
        }
      }
    }
  }

  updateActiveStyles() {
    document.querySelectorAll(".nav-link").forEach((link) => {
      const id = link.getAttribute("data-nav");
      if (id === this.activeSection) {
        link.classList.add("text-emerald-800", "bg-emerald-50", "font-bold");
        link.classList.remove("text-slate-600");
      } else {
        link.classList.remove("text-emerald-800", "bg-emerald-50", "font-bold");
        link.classList.add("text-slate-600");
      }
    });
  }

  async checkAdminSession() {
    try {
      const res = await fetch("/api/admin/me");
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.admin) {
          const btn = document.getElementById("navAdminBtn");
          if (btn) {
            btn.innerHTML = `
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <i data-lucide="shield-check" class="w-4 h-4"></i>
              <span>Dashboard (${data.admin.username})</span>
            `;
            this.refreshIcons();
          }
        }
      }
    } catch {
      // Offline or unauthenticated
    }
  }

  refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  window.navigationManager = new NavigationManager();
  window.navigationManager.init();
});
