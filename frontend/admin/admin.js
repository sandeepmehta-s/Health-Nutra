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
  if (!container) return;
  const toast = document.createElement('div');
  const isSuccess = type === 'success';
  toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold transition-all transform duration-300 translate-y-2 opacity-0 ${
    isSuccess ? 'bg-slate-900 text-white border border-emerald-500/30' : 'bg-rose-900 text-white border border-rose-500/30'
  }`;
  toast.innerHTML = `
    <i data-lucide="${isSuccess ? 'check-circle' : 'alert-circle'}" class="w-4 h-4 ${isSuccess ? 'text-emerald-400' : 'text-rose-400'} shrink-0"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  });
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// -----------------------------------------------------------------
// Initial Initialization
// -----------------------------------------------------------------
async function init() {
  if (window.lucide) window.lucide.createIcons();
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
        <td colspan="7" class="py-12 text-center text-slate-400">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
            <i data-lucide="package-search" class="w-6 h-6"></i>
          </div>
          <h4 class="font-bold text-slate-700 text-sm">No formulations found</h4>
          <p class="text-xs text-slate-400 mt-1">Try modifying your search or category filters.</p>
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  productsTableBody.innerHTML = products
    .map((p) => {
      const id = p.id || p._id;
      const isActive = p.status === 'active';
      return `
        <tr data-id="${id}" class="hover:bg-slate-50/80 transition-colors">
          <td class="py-3.5 px-6">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                <img src="${p.image || '/uploads/9g.png'}" 
                     alt="${escapeHtml(p.name)}" 
                     class="max-h-full max-w-full object-contain p-1"
                     onerror="this.onerror=null; this.parentElement.innerHTML='<i data-lucide=\\'pill\\' class=\\'w-5 h-5 text-emerald-600\\'></i>'; if(window.lucide) window.lucide.createIcons();">
              </div>
              <div class="min-w-0">
                <h4 class="font-bold text-slate-900 text-xs truncate">${escapeHtml(p.name)}</h4>
                <p class="text-[11px] text-slate-400 truncate max-w-xs" title="${escapeHtml(p.shortDescription)}">${escapeHtml(p.shortDescription)}</p>
              </div>
            </div>
          </td>
          <td class="py-3.5 px-4">
            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
              <i data-lucide="tag" class="w-3 h-3 text-slate-400"></i>
              ${escapeHtml(p.category)}
            </span>
          </td>
          <td class="py-3.5 px-4 font-black text-brand-800 text-xs">
            ₹${p.price}
          </td>
          <td class="py-3.5 px-4 text-slate-500 font-semibold text-xs">
            ${escapeHtml(p.unit || 'Strip')}
          </td>
          <td class="py-3.5 px-4">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
              isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
            }">
              <span class="w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}"></span>
              ${isActive ? 'Active' : 'Hidden'}
            </span>
          </td>
          <td class="py-3.5 px-4">
            <button class="toggle-status-btn inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              isActive 
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-600' 
                : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
            }" data-id="${id}" title="Toggle active or hidden">
              <i data-lucide="${isActive ? 'eye-off' : 'eye'}" class="w-3.5 h-3.5"></i>
              <span>${isActive ? 'Hide' : 'Show'}</span>
            </button>
          </td>
          <td class="py-3.5 px-6 text-right">
            <div class="inline-flex items-center gap-2">
              <button class="edit-btn inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer" data-id="${id}">
                <i data-lucide="edit-2" class="w-3.5 h-3.5"></i>
                <span>Edit</span>
              </button>
              <button class="delete-btn inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer" data-id="${id}" data-name="${escapeHtml(p.name)}">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                <span>Delete</span>
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  if (window.lucide) window.lucide.createIcons();
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

