// Health Nutra - Public Storefront (Vanilla JS)
let allActiveProducts = [];
let currentCategory = 'All';

const productsGrid = document.getElementById('productsGrid');
const categoryTabs = document.getElementById('categoryTabs');
const detailModal = document.getElementById('detailModal');
const closeDetailModalBtn = document.getElementById('closeDetailModalBtn');

// Modal Elements
const modalImg = document.getElementById('modalImg');
const modalCategory = document.getElementById('modalCategory');
const modalName = document.getElementById('modalName');
const modalPrice = document.getElementById('modalPrice');
const modalUnit = document.getElementById('modalUnit');
const modalShortDesc = document.getElementById('modalShortDesc');
const modalFullDesc = document.getElementById('modalFullDesc');

// Initialize public website
async function initStorefront() {
  await fetchProducts();
}

async function fetchProducts() {
  try {
    productsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🌱</div>
        <p style="font-weight: 700; color: var(--primary-dark);">Loading Fresh Formulations...</p>
      </div>
    `;

    const res = await fetch('/api/products');
    const result = await res.json();

    if (res.ok && result.success) {
      allActiveProducts = result.data || [];
      buildCategoryTabs(allActiveProducts);
      renderProducts(filterProductsByCategory(currentCategory));
    } else {
      productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #dc2626;">
          <p>Failed to load products. Please check back shortly.</p>
        </div>
      `;
    }
  } catch (err) {
    console.error('Fetch error:', err);
    productsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: #dc2626;">
        <p>Could not connect to the product API. Server might be offline.</p>
      </div>
    `;
  }
}

function buildCategoryTabs(products) {
  const distinct = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const categories = ['All', ...distinct];

  categoryTabs.innerHTML = categories
    .map(
      (cat) => `
      <button class="tab-btn ${cat === currentCategory ? 'active' : ''}" data-category="${escapeHtml(cat)}">
        ${escapeHtml(cat)}
      </button>
    `
    )
    .join('');

  categoryTabs.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      categoryTabs.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderProducts(filterProductsByCategory(currentCategory));
    });
  });
}

function filterProductsByCategory(category) {
  if (category === 'All') return allActiveProducts;
  return allActiveProducts.filter((p) => p.category === category);
}

function renderProducts(products) {
  if (products.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: #ffffff; border-radius: var(--radius-lg); border: 1px solid var(--border);">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
        <h3 style="font-size: 1.125rem; font-weight: 800; color: var(--primary-dark);">No Products in this Category</h3>
        <p style="font-size: 0.8125rem; color: var(--text-muted); margin-top: 0.25rem;">Try selecting another category above.</p>
      </div>
    `;
    return;
  }

  productsGrid.innerHTML = products
    .map((p) => {
      return `
        <article class="product-card" data-id="${p._id}">
          <span class="card-category-badge">${escapeHtml(p.category)}</span>
          
          <div class="card-image-box">
            <img src="${p.image || '/uploads/9g.png'}" 
                 alt="${escapeHtml(p.name)}" 
                 loading="lazy"
                 onerror="this.src='/uploads/9g.png'">
          </div>

          <div class="card-body">
            <h3 class="card-title">${escapeHtml(p.name)}</h3>
            <p class="card-desc">${escapeHtml(p.shortDescription)}</p>

            <div class="card-footer">
              <div>
                <span class="card-price">₹${p.price}</span>
                <span class="card-unit">/ ${escapeHtml(p.unit || 'Strip')}</span>
              </div>
              <button class="btn-details view-details-btn" data-id="${p._id}">
                View Details
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  // Attach click events for "View Details"
  productsGrid.querySelectorAll('.view-details-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const prod = allActiveProducts.find((x) => x._id === id);
      if (prod) openProductModal(prod);
    });
  });
}

// Open Detail Modal
function openProductModal(p) {
  modalImg.src = p.image || '/uploads/9g.png';
  modalImg.onerror = () => (modalImg.src = '/uploads/9g.png');
  modalCategory.textContent = p.category;
  modalName.textContent = p.name;
  modalPrice.textContent = `₹${p.price}`;
  modalUnit.textContent = `/ ${p.unit || 'Strip'}`;
  modalShortDesc.textContent = p.shortDescription;
  modalFullDesc.textContent = p.fullDescription || 'Scientifically formulated with pure, natural ingredients to promote everyday vitality and holistic health.';

  detailModal.classList.remove('hidden');
}

function closeProductModal() {
  detailModal.classList.add('hidden');
}

closeDetailModalBtn.addEventListener('click', closeProductModal);
detailModal.addEventListener('click', (e) => {
  if (e.target === detailModal) closeProductModal();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !detailModal.classList.contains('hidden')) {
    closeProductModal();
  }
});

// Helper: Escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

// Start
initStorefront();
