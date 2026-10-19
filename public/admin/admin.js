// Health Nutra - Admin Dashboard Client Logic (Vanilla JS)
let productsList = [];
let productToDeleteId = null;

// DOM Elements
const productsTableBody = document.getElementById('productsTableBody');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const statusFilter = document.getElementById('statusFilter');
const statTotal = document.getElementById('statTotal');
const statActive = document.getElementById('statActive');
const statHidden = document.getElementById('statHidden');
const statCategories = document.getElementById('statCategories');
const adminNameDisplay = document.getElementById('adminNameDisplay');
const logoutBtn = document.getElementById('logoutBtn');

// Modal Elements
const productModal = document.getElementById('productModal');
const openAddModalBtn = document.getElementById('openAddModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const modalAlertBox = document.getElementById('modalAlertBox');
const saveBtnText = document.getElementById('saveBtnText');
const prodImageInput = document.getElementById('prodImage');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewText = document.getElementById('imagePreviewText');

// Delete Modal Elements
const deleteModal = document.getElementById('deleteModal');
const closeDeleteModalBtn = document.getElementById('closeDeleteModalBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deleteProductName = document.getElementById('deleteProductName');

// Toast Notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// -----------------------------------------------------------------
// Initial Initialization
// -----------------------------------------------------------------
async function init() {
  await verifySession();
  await loadProducts();
}

async function verifySession() {
  try {
    const res = await fetch('/api/admin/me');
    if (!res.ok) {
      window.location.href = '/admin/login';
      return;
    }
    const data = await res.json();
    if (data.success && data.admin) {
      adminNameDisplay.textContent = data.admin.username;
    }
  } catch (err) {
    window.location.href = '/admin/login';
  }
}

// -----------------------------------------------------------------
// Fetch & Render Products
// -----------------------------------------------------------------
async function loadProducts() {
  try {
    const search = encodeURIComponent(searchInput.value.trim());
    const category = encodeURIComponent(categoryFilter.value);
    const status = encodeURIComponent(statusFilter.value);

    const res = await fetch(`/api/admin/products?search=${search}&category=${category}&status=${status}`);
    const result = await res.json();

    if (res.ok && result.success) {
      productsList = result.data || [];
      renderTable(productsList);
      updateStats(result.stats);
      updateCategoryDropdown(result.categories);
    } else {
      showToast(result.message || 'Failed to load products.', 'error');
    }
  } catch (err) {
    showToast('Network error while loading products.', 'error');
  }
}

function updateStats(stats) {
  if (!stats) return;
  statTotal.textContent = stats.total ?? 0;
  statActive.textContent = stats.active ?? 0;
  statHidden.textContent = stats.hidden ?? 0;
  statCategories.textContent = stats.categoriesCount ?? 0;
}

function updateCategoryDropdown(categories = []) {
  const currentVal = categoryFilter.value;
  // Preserve "all" option
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
  if (categories.includes(currentVal)) {
    categoryFilter.value = currentVal;
  }
}

function renderTable(products) {
  if (products.length === 0) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <div class="empty-icon">📦</div>
          <h4 class="empty-title">No products found</h4>
          <p class="empty-desc">Try clearing filters or add a new formulation.</p>
        </td>
      </tr>
    `;
    return;
  }

  productsTableBody.innerHTML = products
    .map((p) => {
      const isActive = p.status === 'active';
      return `
        <tr data-id="${p._id}">
          <td>
            <div class="product-cell">
              <img src="${p.image || '/uploads/9g.png'}" 
                   alt="${escapeHtml(p.name)}" 
                   class="product-thumb"
                   onerror="this.src='/uploads/9g.png'">
              <div class="product-info">
                <h4>${escapeHtml(p.name)}</h4>
                <p title="${escapeHtml(p.shortDescription)}">${escapeHtml(p.shortDescription)}</p>
              </div>
            </div>
          </td>
          <td>
            <span class="badge badge-category">${escapeHtml(p.category)}</span>
          </td>
          <td>
            <strong style="color: var(--primary-dark); font-weight: 800;">₹${p.price}</strong>
          </td>
          <td>
            <span style="font-size: 0.8125rem; color: var(--text-muted);">${escapeHtml(p.unit || 'Strip')}</span>
          </td>
          <td>
            <span class="badge ${isActive ? 'badge-active' : 'badge-hidden'}">
              ${isActive ? '● Active' : '○ Hidden'}
            </span>
          </td>
          <td>
            <button class="btn btn-secondary btn-sm toggle-status-btn" 
                    data-id="${p._id}" 
                    title="Click to toggle active/hidden state">
              ${isActive ? '👁️ Hide' : '✨ Show'}
            </button>
          </td>
          <td style="text-align: right;">
            <div class="action-buttons" style="justify-content: flex-end;">
              <button class="btn btn-secondary btn-sm edit-btn" data-id="${p._id}">
                ✏️ Edit
              </button>
              <button class="btn btn-danger btn-sm delete-btn" data-id="${p._id}" data-name="${escapeHtml(p.name)}">
                🗑️ Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

// -----------------------------------------------------------------
// Event Listeners for Filters & Search (Debounced)
// -----------------------------------------------------------------
let searchTimeout;
searchInput.addEventListener('input', () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(loadProducts, 250);
});

categoryFilter.addEventListener('change', loadProducts);
statusFilter.addEventListener('change', loadProducts);

// -----------------------------------------------------------------
// Table Delegated Actions (Toggle, Edit, Delete)
// -----------------------------------------------------------------
productsTableBody.addEventListener('click', async (e) => {
  const toggleBtn = e.target.closest('.toggle-status-btn');
  const editBtn = e.target.closest('.edit-btn');
  const deleteBtn = e.target.closest('.delete-btn');

  // 1. Toggle Visibility
  if (toggleBtn) {
    const id = toggleBtn.getAttribute('data-id');
    toggleBtn.disabled = true;
    try {
      const res = await fetch(`/api/admin/products/${id}/toggle-status`, { method: 'PATCH' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, 'success');
        await loadProducts();
      } else {
        showToast(data.message || 'Could not update visibility.', 'error');
        toggleBtn.disabled = false;
      }
    } catch (err) {
      showToast('Network error while updating status.', 'error');
      toggleBtn.disabled = false;
    }
  }

  // 2. Edit Product
  if (editBtn) {
    const id = editBtn.getAttribute('data-id');
    openEditModal(id);
  }

  // 3. Delete Product
  if (deleteBtn) {
    const id = deleteBtn.getAttribute('data-id');
    const name = deleteBtn.getAttribute('data-name');
    openDeleteModal(id, name);
  }
});

// -----------------------------------------------------------------
// Modal Handlers (Add & Edit)
// -----------------------------------------------------------------
function openAddModal() {
  productForm.reset();
  document.getElementById('productId').value = '';
  modalTitle.textContent = 'Add New Product';
  saveBtnText.textContent = 'Create Product';
  modalAlertBox.classList.add('hidden');
  imagePreviewContainer.classList.add('hidden');
  imagePreview.src = '';
  productModal.classList.remove('hidden');
}

async function openEditModal(id) {
  productForm.reset();
  modalAlertBox.classList.add('hidden');
  modalTitle.textContent = 'Edit Product';
  saveBtnText.textContent = 'Update Product';

  try {
    const res = await fetch(`/api/admin/products/${id}`);
    const result = await res.json();
    if (!res.ok || !result.success) {
      showToast('Product not found.', 'error');
      return;
    }

    const p = result.data;
    document.getElementById('productId').value = p._id;
    document.getElementById('prodName').value = p.name || '';
    document.getElementById('prodCategory').value = p.category || '';
    document.getElementById('prodUnit').value = p.unit || '';
    document.getElementById('prodPrice').value = p.price || '';
    document.getElementById('prodStatus').value = p.status || 'active';
    document.getElementById('prodShortDesc').value = p.shortDescription || '';
    document.getElementById('prodFullDesc').value = p.fullDescription || '';

    if (p.image) {
      imagePreview.src = p.image;
      imagePreviewText.textContent = 'Existing Product Image';
      imagePreviewContainer.classList.remove('hidden');
    } else {
      imagePreviewContainer.classList.add('hidden');
    }

    productModal.classList.remove('hidden');
  } catch (err) {
    showToast('Failed to retrieve product details.', 'error');
  }
}

function closeModal() {
  productModal.classList.add('hidden');
  productForm.reset();
}

openAddModalBtn.addEventListener('click', openAddModal);
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);

// Live preview for selected image file
prodImageInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    // Check file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size exceeds 2MB limit. Please choose a smaller image.');
      this.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreviewText.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      imagePreviewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }
});

// Product Form Submission (Add or Edit)
productForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  modalAlertBox.classList.add('hidden');
  const saveBtn = document.getElementById('saveProductBtn');
  saveBtn.disabled = true;
  saveBtnText.textContent = 'Saving...';

  const productId = document.getElementById('productId').value;
  const isEdit = Boolean(productId);

  // Client Validation
  const name = document.getElementById('prodName').value.trim();
  const price = Number(document.getElementById('prodPrice').value);

  if (!name) {
    showModalAlert('Product name cannot be empty.');
    saveBtn.disabled = false;
    saveBtnText.textContent = isEdit ? 'Update Product' : 'Create Product';
    return;
  }

  if (isNaN(price) || price <= 0) {
    showModalAlert('Price must be a valid positive number greater than 0.');
    saveBtn.disabled = false;
    saveBtnText.textContent = isEdit ? 'Update Product' : 'Create Product';
    return;
  }

  const formData = new FormData(productForm);
  // Remove empty productId from formData body if adding
  if (!isEdit) {
    formData.delete('productId');
  }

  const url = isEdit ? `/api/admin/products/${productId}` : '/api/admin/products';
  const method = isEdit ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      body: formData,
    });
    const result = await res.json();

    if (res.ok && result.success) {
      closeModal();
      showToast(result.message || 'Product saved successfully!', 'success');
      await loadProducts();
    } else {
      showModalAlert(result.message || 'Operation failed. Please review the form.');
    }
  } catch (err) {
    showModalAlert('Network or server error while saving product.');
  } finally {
    saveBtn.disabled = false;
    saveBtnText.textContent = isEdit ? 'Update Product' : 'Create Product';
  }
});

function showModalAlert(msg) {
  modalAlertBox.className = 'alert-box alert-error';
  modalAlertBox.textContent = msg;
  modalAlertBox.classList.remove('hidden');
}

// -----------------------------------------------------------------
// Delete Modal Handlers
// -----------------------------------------------------------------
function openDeleteModal(id, name) {
  productToDeleteId = id;
  deleteProductName.textContent = `"${name}"`;
  deleteModal.classList.remove('hidden');
}

function closeDeleteModal() {
  deleteModal.classList.add('hidden');
  productToDeleteId = null;
}

closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);

confirmDeleteBtn.addEventListener('click', async () => {
  if (!productToDeleteId) return;
  confirmDeleteBtn.disabled = true;
  confirmDeleteBtn.textContent = 'Deleting...';

  try {
    const res = await fetch(`/api/admin/products/${productToDeleteId}`, {
      method: 'DELETE',
    });
    const result = await res.json();

    if (res.ok && result.success) {
      closeDeleteModal();
      showToast(result.message || 'Product deleted.', 'success');
      await loadProducts();
    } else {
      showToast(result.message || 'Could not delete product.', 'error');
    }
  } catch (err) {
    showToast('Network error while deleting product.', 'error');
  } finally {
    confirmDeleteBtn.disabled = false;
    confirmDeleteBtn.textContent = 'Yes, Delete';
  }
});

// -----------------------------------------------------------------
// Logout Handler
// -----------------------------------------------------------------
logoutBtn.addEventListener('click', async () => {
  if (confirm('Are you sure you want to log out of the admin panel?')) {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      window.location.href = '/admin/login';
    }
  }
});

// -----------------------------------------------------------------
// Helper: HTML Escaping
// -----------------------------------------------------------------
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

// Start application
init();
