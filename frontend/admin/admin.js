// Health Nutra - Comprehensive Admin Portal Client Logic
let productsList = [];
let ordersList = [];
let enquiriesList = [];
let productToDeleteId = null;
let orderToDeleteId = null;
let enquiryToDeleteId = null;
let activeTab = 'products';
let imageInputMode = 'upload'; // 'upload' or 'url'

// DOM Elements - Sidebar & Layout
const sidebar = document.getElementById('sidebar');
const sidebarBackdrop = document.getElementById('sidebarBackdrop');
const mobileSidebarToggleBtn = document.getElementById('mobileSidebarToggleBtn');
const closeSidebarBtn = document.getElementById('closeSidebarBtn');
const navTabProducts = document.getElementById('navTabProducts');
const navTabOrders = document.getElementById('navTabOrders');
const navTabEnquiries = document.getElementById('navTabEnquiries');
const navTabAnalytics = document.getElementById('navTabAnalytics');
const pageHeading = document.getElementById('pageHeading');
const pageSubheading = document.getElementById('pageSubheading');
const adminNameDisplay = document.getElementById('adminNameDisplay');
const logoutBtn = document.getElementById('logoutBtn');
const sidebarProductsCount = document.getElementById('sidebarProductsCount');
const sidebarOrdersPending = document.getElementById('sidebarOrdersPending');
const sidebarEnquiriesNew = document.getElementById('sidebarEnquiriesNew');

// DOM Elements - Views
const viewProducts = document.getElementById('viewProducts');
const viewOrders = document.getElementById('viewOrders');
const viewEnquiries = document.getElementById('viewEnquiries');
const viewAnalytics = document.getElementById('viewAnalytics');

// DOM Elements - Enquiries View
const enquiriesTableBody = document.getElementById('enquiriesTableBody');
const enquiriesEmptyState = document.getElementById('enquiriesEmptyState');
const searchEnquiryInput = document.getElementById('searchEnquiryInput');
const filterEnquiryStatus = document.getElementById('filterEnquiryStatus');
const refreshEnquiriesBtn = document.getElementById('refreshEnquiriesBtn');
const statEnquiriesTotal = document.getElementById('statEnquiriesTotal');
const statEnquiriesNew = document.getElementById('statEnquiriesNew');
const statEnquiriesContacted = document.getElementById('statEnquiriesContacted');
const statEnquiriesResolved = document.getElementById('statEnquiriesResolved');

// DOM Elements - Products View
const productsTableBody = document.getElementById('productsTableBody');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const statusFilter = document.getElementById('statusFilter');
const refreshProductsBtn = document.getElementById('refreshProductsBtn');
const statTotal = document.getElementById('statTotal');
const statActive = document.getElementById('statActive');
const statHidden = document.getElementById('statHidden');
const statCategories = document.getElementById('statCategories');

// DOM Elements - Orders View
const ordersTableBody = document.getElementById('ordersTableBody');
const orderSearchInput = document.getElementById('orderSearchInput');
const orderStatusFilter = document.getElementById('orderStatusFilter');
const refreshOrdersBtn = document.getElementById('refreshOrdersBtn');
const orderStatTotal = document.getElementById('orderStatTotal');
const orderStatPending = document.getElementById('orderStatPending');
const orderStatShipped = document.getElementById('orderStatShipped');
const orderStatDelivered = document.getElementById('orderStatDelivered');
const orderStatRevenue = document.getElementById('orderStatRevenue');

// DOM Elements - Product Modal
const productModal = document.getElementById('productModal');
const openAddModalBtn = document.getElementById('openAddModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const productForm = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');
const modalAlertBox = document.getElementById('modalAlertBox');
const saveBtnText = document.getElementById('saveBtnText');
const imgModeUploadBtn = document.getElementById('imgModeUploadBtn');
const imgModeUrlBtn = document.getElementById('imgModeUrlBtn');
const imgUploadContainer = document.getElementById('imgUploadContainer');
const imgUrlContainer = document.getElementById('imgUrlContainer');
const prodImageInput = document.getElementById('prodImage');
const prodImageUrlInput = document.getElementById('prodImageUrl');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const imagePreviewText = document.getElementById('imagePreviewText');
const imagePreviewSubtext = document.getElementById('imagePreviewSubtext');

// DOM Elements - Order Modal
const orderModal = document.getElementById('orderModal');
const orderModalTitle = document.getElementById('orderModalTitle');
const closeOrderModalBtn = document.getElementById('closeOrderModalBtn');
const cancelOrderModalBtn = document.getElementById('cancelOrderModalBtn');
const orderCustomerName = document.getElementById('orderCustomerName');
const orderCustomerPhone = document.getElementById('orderCustomerPhone');
const orderShippingAddress = document.getElementById('orderShippingAddress');
const orderItemsTableBody = document.getElementById('orderItemsTableBody');
const orderGrandTotal = document.getElementById('orderGrandTotal');
const orderStatusForm = document.getElementById('orderStatusForm');
const editOrderId = document.getElementById('editOrderId');
const editOrderStatus = document.getElementById('editOrderStatus');
const editPaymentStatus = document.getElementById('editPaymentStatus');
const editOrderNotes = document.getElementById('editOrderNotes');

// DOM Elements - Delete Modals
const deleteModal = document.getElementById('deleteModal');
const closeDeleteModalBtn = document.getElementById('closeDeleteModalBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const deleteProductName = document.getElementById('deleteProductName');

const deleteOrderModal = document.getElementById('deleteOrderModal');
const cancelDeleteOrderBtn = document.getElementById('cancelDeleteOrderBtn');
const confirmDeleteOrderBtn = document.getElementById('confirmDeleteOrderBtn');
const deleteOrderNumber = document.getElementById('deleteOrderNumber');

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
// Initialization
// -----------------------------------------------------------------
async function init() {
  if (window.lucide) window.lucide.createIcons();
  await verifySession();
  bindSidebarEvents();
  bindProductEvents();
  bindOrderEvents();
  bindEnquiryEvents();
  await Promise.all([loadProducts(), loadOrders(), loadEnquiries()]);
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
  } catch {
    window.location.href = '/admin/login';
  }
}

// -----------------------------------------------------------------
// Sidebar & Tab Navigation Logic
// -----------------------------------------------------------------
function bindSidebarEvents() {
  // Mobile drawer open/close
  if (mobileSidebarToggleBtn) {
    mobileSidebarToggleBtn.addEventListener('click', () => {
      sidebar.classList.remove('-translate-x-full');
      sidebarBackdrop.classList.remove('hidden');
    });
  }

  const closeSidebar = () => {
    sidebar.classList.add('-translate-x-full');
    sidebarBackdrop.classList.add('hidden');
  };

  if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

  // Tab switching
  navTabProducts.addEventListener('click', () => switchTab('products'));
  navTabOrders.addEventListener('click', () => switchTab('orders'));
  if (navTabEnquiries) navTabEnquiries.addEventListener('click', () => switchTab('enquiries'));
  navTabAnalytics.addEventListener('click', () => switchTab('analytics'));

  // Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        await fetch('/api/admin/logout', { method: 'POST' });
      } finally {
        window.location.href = '/';
      }
    });
  }
}

function switchTab(tab) {
  activeTab = tab;

  // Update nav buttons styling
  [navTabProducts, navTabOrders, navTabEnquiries, navTabAnalytics].filter(Boolean).forEach((btn) => {
    btn.className = 'nav-tab-btn w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all';
  });

  // Hide all views
  if (viewProducts) viewProducts.classList.add('hidden');
  if (viewOrders) viewOrders.classList.add('hidden');
  if (viewEnquiries) viewEnquiries.classList.add('hidden');
  if (viewAnalytics) viewAnalytics.classList.add('hidden');

  // Toggle Add Product button in top header based on active tab
  if (openAddModalBtn) {
    if (tab === 'products') {
      openAddModalBtn.classList.remove('hidden');
    } else {
      openAddModalBtn.classList.add('hidden');
    }
  }

  if (tab === 'products') {
    navTabProducts.className = 'nav-tab-btn active w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all bg-brand-50 text-brand-800';
    if (viewProducts) viewProducts.classList.remove('hidden');
    pageHeading.textContent = 'Formulations Catalog';
    pageSubheading.textContent = 'Manage active vitamins, syrups & botanical supplements';
  } else if (tab === 'orders') {
    navTabOrders.className = 'nav-tab-btn active w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all bg-brand-50 text-brand-800';
    if (viewOrders) viewOrders.classList.remove('hidden');
    pageHeading.textContent = 'Orders Management';
    pageSubheading.textContent = 'Track and process customer orders, shipments, and fulfillment';
    loadOrders();
  } else if (tab === 'enquiries') {
    if (navTabEnquiries) navTabEnquiries.className = 'nav-tab-btn active w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all bg-brand-50 text-brand-800';
    if (viewEnquiries) viewEnquiries.classList.remove('hidden');
    pageHeading.textContent = 'Customer Enquiries';
    pageSubheading.textContent = 'Direct inquiries, clinic communications & dealership leads';
    loadEnquiries();
  } else if (tab === 'analytics') {
    navTabAnalytics.className = 'nav-tab-btn active w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all bg-brand-50 text-brand-800';
    if (viewAnalytics) viewAnalytics.classList.remove('hidden');
    pageHeading.textContent = 'Sales & Overview';
    pageSubheading.textContent = 'Real-time performance metrics and formulation distribution';
    updateOverviewStats();
  }

  // Close sidebar on mobile
  sidebar.classList.add('-translate-x-full');
  sidebarBackdrop.classList.add('hidden');

  if (window.lucide) window.lucide.createIcons();
}

// -----------------------------------------------------------------
// Product Management Logic
// -----------------------------------------------------------------
function bindProductEvents() {
  searchInput.addEventListener('input', debounce(loadProducts, 300));
  categoryFilter.addEventListener('change', loadProducts);
  statusFilter.addEventListener('change', loadProducts);
  if (refreshProductsBtn) refreshProductsBtn.addEventListener('click', loadProducts);

  openAddModalBtn.addEventListener('click', () => openProductModal(null));
  closeModalBtn.addEventListener('click', closeProductModal);
  cancelModalBtn.addEventListener('click', closeProductModal);
  productModal.addEventListener('click', (e) => {
    if (e.target === productModal) closeProductModal();
  });

  // Image mode tabs
  imgModeUploadBtn.addEventListener('click', () => setImageMode('upload'));
  imgModeUrlBtn.addEventListener('click', () => setImageMode('url'));

  // File preview
  prodImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showToast('Image file exceeds maximum 2MB size limit.', 'error');
        prodImageInput.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        imagePreview.src = event.target.result;
        imagePreviewText.textContent = file.name;
        imagePreviewSubtext.textContent = `${(file.size / 1024).toFixed(1)} KB uploaded file`;
        imagePreviewContainer.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    }
  });

  // URL preview
  prodImageUrlInput.addEventListener('input', (e) => {
    const url = e.target.value.trim();
    if (url) {
      imagePreview.src = url;
      imagePreviewText.textContent = 'Web Image Link';
      imagePreviewSubtext.textContent = url;
      imagePreviewContainer.classList.remove('hidden');
    }
  });

  // Form Submit
  productForm.addEventListener('submit', handleProductSubmit);

  // Delete modal
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);
  confirmDeleteBtn.addEventListener('click', executeDeleteProduct);
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) closeDeleteModal();
  });
}

function setImageMode(mode) {
  imageInputMode = mode;
  if (mode === 'upload') {
    imgModeUploadBtn.className = 'px-2.5 py-1 rounded-lg bg-white text-slate-900 shadow-xs transition-all';
    imgModeUrlBtn.className = 'px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-900 transition-all';
    imgUploadContainer.classList.remove('hidden');
    imgUrlContainer.classList.add('hidden');
  } else {
    imgModeUrlBtn.className = 'px-2.5 py-1 rounded-lg bg-white text-slate-900 shadow-xs transition-all';
    imgModeUploadBtn.className = 'px-2.5 py-1 rounded-lg text-slate-500 hover:text-slate-900 transition-all';
    imgUrlContainer.classList.remove('hidden');
    imgUploadContainer.classList.add('hidden');
  }
}

async function loadProducts() {
  try {
    const search = encodeURIComponent(searchInput.value.trim());
    const category = encodeURIComponent(categoryFilter.value);
    const status = encodeURIComponent(statusFilter.value);

    const res = await fetch(`/api/admin/products?search=${search}&category=${category}&status=${status}`);
    const result = await res.json();

    if (res.ok && result.success) {
      productsList = result.data || [];
      renderProductsTable(productsList);
      updateProductStats(result.stats);
      updateCategoryDropdown(result.categories);
      updateOverviewStats();
    } else {
      showToast(result.message || 'Failed to load products.', 'error');
    }
  } catch {
    showToast('Network error while loading products.', 'error');
  }
}

function updateProductStats(stats) {
  if (!stats) return;
  statTotal.textContent = stats.total ?? 0;
  statActive.textContent = stats.active ?? 0;
  statHidden.textContent = stats.hidden ?? 0;
  statCategories.textContent = stats.categoriesCount ?? 0;
  sidebarProductsCount.textContent = stats.total ?? 0;
}

function updateCategoryDropdown(categories = []) {
  const currentVal = categoryFilter.value;
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

function renderProductsTable(products) {
  if (products.length === 0) {
    productsTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="py-12 text-center text-slate-400">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
            <i data-lucide="package-x" class="w-6 h-6"></i>
          </div>
          <p class="font-bold text-slate-700">No products found</p>
          <p class="text-[11px] text-slate-400 mt-0.5">Try altering your search keywords or category filters</p>
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  productsTableBody.innerHTML = products.map((p) => {
    const id = p.id || p._id;
    const isActive = p.status === 'active';
    const imgUrl = p.image || '/uploads/9g.png';

    return `
      <tr class="hover:bg-slate-50/70 transition-colors">
        <!-- Details -->
        <td class="py-3.5 px-6">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
              <img src="${imgUrl}" alt="${p.name}" class="max-h-full max-w-full object-contain" onerror="this.onerror=null; this.src='/uploads/9g.png';">
            </div>
            <div class="min-w-0">
              <h4 class="font-black text-slate-900 truncate">${p.name}</h4>
              <p class="text-[11px] text-slate-500 line-clamp-1 mt-0.5">${p.shortDescription || ''}</p>
            </div>
          </div>
        </td>

        <!-- Category -->
        <td class="py-3.5 px-4 whitespace-nowrap">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            ${p.category}
          </span>
        </td>

        <!-- Price -->
        <td class="py-3.5 px-4 whitespace-nowrap">
          <span class="font-black text-slate-900 text-sm">₹${p.price}</span>
        </td>

        <!-- Unit -->
        <td class="py-3.5 px-4 whitespace-nowrap text-slate-500 font-medium">
          ${p.unit || 'Strip'}
        </td>

        <!-- Status Badge -->
        <td class="py-3.5 px-4 whitespace-nowrap">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold ${
            isActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
          }">
            <span class="w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}"></span>
            ${isActive ? 'Active' : 'Hidden'}
          </span>
        </td>

        <!-- Toggle Switch -->
        <td class="py-3.5 px-4 whitespace-nowrap">
          <button 
            type="button" 
            onclick="toggleStatus('${id}')" 
            title="${isActive ? 'Click to hide product from public website' : 'Click to show product on public website'}"
            class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isActive ? 'bg-brand-700' : 'bg-slate-200'
            }"
          >
            <span class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              isActive ? 'translate-x-5' : 'translate-x-0'
            }"></span>
          </button>
        </td>

        <!-- Actions -->
        <td class="py-3.5 px-6 text-right whitespace-nowrap space-x-2">
          <button 
            type="button" 
            onclick="editProduct('${id}')" 
            class="p-2 rounded-xl text-slate-500 hover:text-brand-800 hover:bg-brand-50 transition-colors"
            title="Edit Formulation"
          >
            <i data-lucide="edit-3" class="w-4 h-4"></i>
          </button>
          <button 
            type="button" 
            onclick="promptDeleteProduct('${id}')" 
            class="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            title="Delete Formulation"
          >
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

window.toggleStatus = async function(id) {
  try {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}/toggle-status`, { method: 'PATCH' });
    const result = await res.json();
    if (res.ok && result.success) {
      const statusText = result.status || result.data?.status || result.product?.status || 'updated';
      showToast(`Status updated to: ${statusText}`);
      await loadProducts();
    } else {
      showToast(result.message || 'Status toggle failed.', 'error');
    }
  } catch {
    showToast('Network error while toggling visibility.', 'error');
  }
};

window.editProduct = function(id) {
  const p = productsList.find((item) => (item.id || item._id) === id);
  if (!p) return;
  openProductModal(p);
};

function openProductModal(product = null) {
  modalAlertBox.classList.add('hidden');
  productForm.reset();
  imagePreviewContainer.classList.add('hidden');

  if (product) {
    modalTitle.innerHTML = `<i data-lucide="edit-3" class="w-5 h-5 text-brand-700"></i><span>Edit Product Formulation</span>`;
    saveBtnText.textContent = 'Update Product';
    document.getElementById('productId').value = product.id || product._id;
    document.getElementById('prodName').value = product.name;
    document.getElementById('prodCategory').value = product.category;
    document.getElementById('prodUnit').value = product.unit || 'Strip';
    document.getElementById('prodPrice').value = product.price;
    document.getElementById('prodStatus').value = product.status || 'active';
    document.getElementById('prodShortDesc').value = product.shortDescription || '';
    document.getElementById('prodFullDesc').value = product.fullDescription || '';

    if (product.image) {
      imagePreview.src = product.image;
      imagePreviewText.textContent = 'Existing Formulation Image';
      imagePreviewSubtext.textContent = product.image;
      imagePreviewContainer.classList.remove('hidden');
      if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
        setImageMode('url');
        prodImageUrlInput.value = product.image;
      } else {
        setImageMode('upload');
      }
    }
  } else {
    modalTitle.innerHTML = `<i data-lucide="package-plus" class="w-5 h-5 text-brand-700"></i><span>Add New Product</span>`;
    saveBtnText.textContent = 'Save Product';
    document.getElementById('productId').value = '';
    document.getElementById('prodStatus').value = 'active';
    setImageMode('upload');
  }

  productModal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
}

function closeProductModal() {
  productModal.classList.add('hidden');
}

async function handleProductSubmit(e) {
  e.preventDefault();
  modalAlertBox.classList.add('hidden');

  const id = document.getElementById('productId').value;
  const isEditing = Boolean(id);

  const formData = new FormData();
  formData.append('name', document.getElementById('prodName').value.trim());
  formData.append('category', document.getElementById('prodCategory').value.trim());
  formData.append('unit', document.getElementById('prodUnit').value.trim());
  formData.append('price', document.getElementById('prodPrice').value.trim());
  formData.append('status', document.getElementById('prodStatus').value);
  formData.append('shortDescription', document.getElementById('prodShortDesc').value.trim());
  formData.append('fullDescription', document.getElementById('prodFullDesc').value.trim());

  // Attach Image: File or URL
  if (imageInputMode === 'upload' && prodImageInput.files[0]) {
    formData.append('image', prodImageInput.files[0]);
  } else if (imageInputMode === 'url' && prodImageUrlInput.value.trim()) {
    formData.append('imageUrl', prodImageUrlInput.value.trim());
  }

  const endpoint = isEditing ? `/api/admin/products/${id}` : '/api/admin/products';
  const method = isEditing ? 'PUT' : 'POST';

  try {
    saveBtnText.textContent = isEditing ? 'Updating...' : 'Saving...';
    const res = await fetch(endpoint, {
      method,
      body: formData,
    });
    const result = await res.json();

    if (res.ok && result.success) {
      showToast(result.message || 'Product saved successfully!');
      closeProductModal();
      await loadProducts();
    } else {
      modalAlertBox.textContent = result.message || 'Validation error occurred.';
      modalAlertBox.classList.remove('hidden');
    }
  } catch {
    modalAlertBox.textContent = 'Network communication failure. Please retry.';
    modalAlertBox.classList.remove('hidden');
  } finally {
    saveBtnText.textContent = isEditing ? 'Update Product' : 'Save Product';
  }
}

window.promptDeleteProduct = function(id) {
  const p = productsList.find((item) => (item.id || item._id) === id);
  const name = p ? p.name : 'this formulation';
  productToDeleteId = id;
  if (deleteProductName) deleteProductName.textContent = `"${name}"`;
  if (deleteModal) {
    deleteModal.classList.remove('hidden');
  } else if (confirm(`Are you sure you want to permanently delete "${name}"?`)) {
    executeDeleteProduct();
  }
};

function closeDeleteModal() {
  productToDeleteId = null;
  if (deleteModal) deleteModal.classList.add('hidden');
}

async function executeDeleteProduct() {
  if (!productToDeleteId) return;
  try {
    const res = await fetch(`/api/admin/products/${encodeURIComponent(productToDeleteId)}`, { method: 'DELETE' });
    const result = await res.json();
    if (res.ok && result.success) {
      showToast(result.message || 'Product removed successfully.');
      closeDeleteModal();
      await loadProducts();
    } else {
      showToast(result.message || 'Delete operation failed.', 'error');
    }
  } catch {
    showToast('Network error while deleting product.', 'error');
  }
}

// -----------------------------------------------------------------
// Order Management Logic
// -----------------------------------------------------------------
function bindOrderEvents() {
  orderSearchInput.addEventListener('input', debounce(loadOrders, 300));
  orderStatusFilter.addEventListener('change', loadOrders);
  if (refreshOrdersBtn) refreshOrdersBtn.addEventListener('click', loadOrders);

  closeOrderModalBtn.addEventListener('click', closeOrderModal);
  cancelOrderModalBtn.addEventListener('click', closeOrderModal);
  orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) closeOrderModal();
  });

  orderStatusForm.addEventListener('submit', handleOrderStatusUpdate);

  cancelDeleteOrderBtn.addEventListener('click', closeDeleteOrderModal);
  confirmDeleteOrderBtn.addEventListener('click', executeDeleteOrder);
  deleteOrderModal.addEventListener('click', (e) => {
    if (e.target === deleteOrderModal) closeDeleteOrderModal();
  });
}

async function loadOrders() {
  try {
    const search = encodeURIComponent(orderSearchInput.value.trim());
    const status = encodeURIComponent(orderStatusFilter.value);

    const res = await fetch(`/api/admin/orders?search=${search}&status=${status}`);
    const result = await res.json();

    if (res.ok && result.success) {
      ordersList = result.data || [];
      renderOrdersTable(ordersList);
      updateOrderStats(result.stats);
      updateOverviewStats();
    } else {
      showToast(result.message || 'Failed to load orders.', 'error');
    }
  } catch {
    showToast('Network error while loading orders.', 'error');
  }
}

function updateOrderStats(stats) {
  if (!stats) return;
  orderStatTotal.textContent = stats.total ?? 0;
  orderStatPending.textContent = stats.pending ?? 0;
  orderStatShipped.textContent = stats.shipped ?? 0;
  orderStatDelivered.textContent = stats.delivered ?? 0;
  orderStatRevenue.textContent = `₹${(stats.revenue ?? 0).toLocaleString('en-IN')}`;
  sidebarOrdersPending.textContent = stats.pending ?? 0;
}

function renderOrdersTable(orders) {
  if (orders.length === 0) {
    ordersTableBody.innerHTML = `
      <tr>
        <td colspan="7" class="py-12 text-center text-slate-400">
          <div class="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
            <i data-lucide="shopping-bag" class="w-6 h-6"></i>
          </div>
          <p class="font-bold text-slate-700">No orders found</p>
          <p class="text-[11px] text-slate-400 mt-0.5">Customer orders will appear here automatically</p>
        </td>
      </tr>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  ordersTableBody.innerHTML = orders.map((o) => {
    const orderId = o.orderId || o.id;
    const dateFormatted = new Date(o.createdAt).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const itemsSummary = (o.items || [])
      .map((it) => `${it.quantity}x ${it.name}`)
      .join(', ');

    // Status colors
    const statusBadges = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      processing: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      shipped: 'bg-blue-50 text-blue-700 border-blue-200',
      delivered: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    };

    const paymentBadges = {
      paid: 'bg-emerald-100 text-emerald-800',
      cod: 'bg-orange-100 text-orange-800',
      pending: 'bg-slate-100 text-slate-700',
    };

    return `
      <tr class="hover:bg-slate-50/70 transition-colors">
        <!-- Order ID & Date -->
        <td class="py-3.5 px-6 whitespace-nowrap">
          <span class="font-black text-slate-900 block">${orderId}</span>
          <span class="text-[10px] text-slate-400 block mt-0.5">${dateFormatted}</span>
        </td>

        <!-- Customer Details -->
        <td class="py-3.5 px-4">
          <p class="font-bold text-slate-900">${o.customerName}</p>
          <p class="text-[11px] text-slate-500 font-mono">${o.customerPhone}</p>
          ${o.city ? `<span class="text-[10px] text-slate-400">${o.city}</span>` : ''}
        </td>

        <!-- Items Summary -->
        <td class="py-3.5 px-4 max-w-xs">
          <p class="text-[11px] text-slate-700 font-medium line-clamp-2" title="${itemsSummary}">${itemsSummary || 'Standard formulation'}</p>
          <span class="text-[10px] font-bold text-slate-400">${(o.items || []).length} item(s)</span>
        </td>

        <!-- Total Amount -->
        <td class="py-3.5 px-4 whitespace-nowrap">
          <span class="font-black text-slate-900 text-sm">₹${o.totalAmount}</span>
        </td>

        <!-- Payment -->
        <td class="py-3.5 px-4 whitespace-nowrap">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            paymentBadges[o.paymentStatus] || 'bg-slate-100 text-slate-700'
          }">
            ${o.paymentStatus || 'pending'}
          </span>
        </td>

        <!-- Order Status Dropdown (Customer Enquiries Style) -->
        <td class="py-3.5 px-4 whitespace-nowrap">
          <select
            onchange="updateOrderStatusDirect('${orderId}', this.value)"
            class="text-xs font-bold rounded-xl px-2.5 py-1.5 border focus:outline-none cursor-pointer ${
              o.orderStatus === 'delivered'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : o.orderStatus === 'shipped'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : o.orderStatus === 'processing'
                ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                : o.orderStatus === 'cancelled'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }"
          >
            <option value="pending" ${o.orderStatus === 'pending' ? 'selected' : ''}>Pending</option>
            <option value="processing" ${o.orderStatus === 'processing' ? 'selected' : ''}>Processing</option>
            <option value="shipped" ${o.orderStatus === 'shipped' ? 'selected' : ''}>Shipped</option>
            <option value="delivered" ${o.orderStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
            <option value="cancelled" ${o.orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>

        <!-- Actions -->
        <td class="py-3.5 px-6 text-right whitespace-nowrap space-x-2">
          <button 
            type="button" 
            onclick="downloadOrderInvoice('${orderId}')" 
            class="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-brand-50 hover:text-brand-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
            title="Download / Print PDF Invoice"
          >
            <i data-lucide="download" class="w-3.5 h-3.5 text-brand-700"></i>
            <span>PDF</span>
          </button>
          <button 
            type="button" 
            onclick="viewOrderDetails('${orderId}')" 
            class="px-3 py-1.5 rounded-xl text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <i data-lucide="eye" class="w-3.5 h-3.5"></i>
            <span>Details</span>
          </button>
          <button 
            type="button" 
            onclick="promptDeleteOrder('${orderId}')" 
            class="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            title="Delete Order Record"
          >
            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

window.updateOrderStatusDirect = async function(orderId, newStatus) {
  try {
    const cleanId = encodeURIComponent(orderId);
    const res = await fetch(`/api/admin/orders/${cleanId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus: newStatus, status: newStatus }),
    });
    const result = await res.json();
    if (res.ok && result.success) {
      showToast(result.message || `Order #${orderId} updated to "${newStatus}"`);
      await loadOrders();
    } else {
      showToast(result.message || 'Status update failed', 'error');
    }
  } catch {
    showToast('Network error while updating order status', 'error');
  }
};

function generateInvoiceHtml(order) {
  const orderId = order.orderId || order.id || 'HN-ORD-PENDING';
  const customerName = order.customerName || 'Valued Customer';
  const customerPhone = order.customerPhone || 'Not provided';
  const customerEmail = order.customerEmail || 'Not provided';
  const shippingAddress = order.shippingAddress || 'Customer Delivery Address';
  const paymentMethod = order.paymentMethod || 'Cash on Delivery (COD)';
  const totalAmount = order.totalAmount || 0;
  const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' }) : new Date().toLocaleString('en-IN');
  const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [
    { name: order.productName || 'Health Nutra Formulation', quantity: order.quantity || 1, price: order.totalAmount || 0, unit: 'Unit' }
  ];

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Health Nutra - Tax Invoice #${orderId}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1e293b; background: #fff; margin: 0; padding: 25px; font-size: 13px; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #166534; padding-bottom: 15px; margin-bottom: 20px; }
    .logo-box { display: flex; align-items: center; gap: 12px; }
    .logo-img { width: 56px; height: 56px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; }
    .brand-title { font-size: 20px; font-weight: 900; color: #166534; margin: 0; }
    .brand-sub { font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin: 2px 0 0 0; }
    .invoice-badge { text-align: right; }
    .invoice-title { font-size: 18px; font-weight: 900; color: #0f172a; margin: 0; }
    .invoice-id { font-size: 13px; font-weight: 700; color: #166534; font-family: monospace; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; }
    .card-title { font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b; margin-bottom: 6px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f1f5f9; color: #475569; font-size: 11px; text-transform: uppercase; font-weight: 800; padding: 10px 12px; text-align: left; border-bottom: 2px solid #cbd5e1; }
    td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
    .total-row { font-size: 15px; font-weight: 900; color: #166534; }
    .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b; }
    .print-btn { background: #166534; color: white; padding: 8px 18px; border-radius: 6px; border: none; font-weight: bold; cursor: pointer; margin-bottom: 20px; font-size: 13px; }
    @media print { .print-btn { display: none; } }
  </style>
</head>
<body>
  <button class="print-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
  <div class="header">
    <div class="logo-box">
      <img src="https://res.cloudinary.com/usqwgkl7/image/upload/v1792576055/logo.jpg" alt="Health Nutra" class="logo-img" />
      <div>
        <h1 class="brand-title">HEALTH NUTRA™</h1>
        <p class="brand-sub">Pharmaceutical & Botanical Formulations</p>
      </div>
    </div>
    <div class="invoice-badge">
      <h2 class="invoice-title">TAX INVOICE</h2>
      <div class="invoice-id">#${orderId}</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 2px;">Date: ${createdAt}</div>
    </div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-title">Marketed & Dispatched By</div>
      <strong style="color: #0f172a;">HEALTH NUTRA™</strong><br>
      Shop No/ Plot No.: 247, SLICE-2, SECTOR-A, SCHEME NO 78,<br>
      INDORE - 452010 Dist.-INDORE (M.P.)<br>
      <strong>Hotline:</strong> +91 8809672959 / +91 7024308660<br>
      <strong>Email:</strong> healthnutra16@gmail.com
    </div>
    <div class="card">
      <div class="card-title">Customer & Delivery Info</div>
      <strong style="color: #0f172a;">${customerName}</strong><br>
      <strong>Phone:</strong> ${customerPhone}<br>
      <strong>Email:</strong> ${customerEmail}<br>
      <strong>Address:</strong> ${shippingAddress}
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 50%;">Formulation Description</th>
        <th style="text-align: center;">Unit</th>
        <th style="text-align: right;">Price (₹)</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Amount (₹)</th>
      </tr>
    </thead>
    <tbody>
      ${items.map(it => {
        const p = parseFloat(it.price) || 0;
        const q = parseInt(it.quantity, 10) || 1;
        return `
          <tr>
            <td><strong>${it.name || 'Health Nutra Product'}</strong></td>
            <td style="text-align: center;">${it.unit || 'Strip'}</td>
            <td style="text-align: right;">₹${p.toFixed(2)}</td>
            <td style="text-align: center;">${q}</td>
            <td style="text-align: right; font-weight: bold;">₹${(p * q).toFixed(2)}</td>
          </tr>
        `;
      }).join('')}
      <tr class="total-row">
        <td colspan="4" style="text-align: right; padding-top: 15px;">Grand Total (${paymentMethod}):</td>
        <td style="text-align: right; padding-top: 15px;">₹${parseFloat(totalAmount).toFixed(2)}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <p>This is a computer-generated tax invoice and requires no physical signature.</p>
    <p>Marketed by: HEALTH NUTRA™ • TM TRADEMARK APPLIED FOR • Customer Care: +91 8809672959 / +91 7024308660</p>
  </div>
</body>
</html>`;
}

window.downloadOrderInvoice = function(orderId) { /* download PDF */
  const o = ordersList.find((item) => item.orderId === orderId || item.id === orderId);
  if (!o) {
    showToast("Order record not found", "error");
    return;
  }
  try {
    const id = o.orderId || o.id || orderId;
    const cleanId = encodeURIComponent(id);
    const downloadUrl = `/api/orders/${cleanId}/invoice/download`;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `HealthNutra_Invoice_${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      try {
        if (a.parentNode) document.body.removeChild(a);
      } catch (e) {}
    }, 500);
    showToast(`Downloading official PDF invoice for #${id}...`);
  } catch (err) {
    showToast("Error downloading invoice: " + err.message, "error");
  }
};

window.viewOrderDetails = function(orderId) {
  const o = ordersList.find((item) => item.orderId === orderId || item.id === orderId);
  if (!o) {
    showToast('Order details not found', 'error');
    return;
  }

  const phone = String(o.customerPhone || '').trim();
  const digits = phone.replace(/[^0-9]/g, '');

  if (orderModalTitle) orderModalTitle.innerHTML = `<i data-lucide="shopping-bag" class="w-5 h-5 text-brand-700"></i><span>#${o.orderId || orderId}</span>`;
  if (orderCustomerName) orderCustomerName.textContent = o.customerName || 'Valued Customer';
  if (orderCustomerPhone) {
    orderCustomerPhone.innerHTML = `${phone || 'Not provided'} ${digits ? `&bull; <a href="https://wa.me/${digits}" target="_blank" class="text-emerald-700 underline font-bold">WhatsApp</a>` : ''}`;
  }
  if (orderShippingAddress) {
    orderShippingAddress.textContent = `${o.shippingAddress || ''}${o.city ? ', ' + o.city : ''}${o.pincode ? ' - ' + o.pincode : ''}` || 'Not provided';
  }

  if (orderGrandTotal) orderGrandTotal.textContent = `₹${o.totalAmount || 0}`;
  if (editOrderId) editOrderId.value = o.orderId || o.id;
  if (editOrderStatus) editOrderStatus.value = o.orderStatus || 'pending';
  if (editPaymentStatus) editPaymentStatus.value = o.paymentStatus || 'pending';
  if (editOrderNotes) editOrderNotes.value = o.notes || '';

  // Render items safely
  if (orderItemsTableBody) {
    const items = Array.isArray(o.items) && o.items.length > 0 ? o.items : [
      { name: o.productName || 'Health Nutra Formulation', price: o.totalAmount || 0, quantity: o.quantity || 1, unit: 'Unit' }
    ];
    orderItemsTableBody.innerHTML = items.map((it) => {
      const price = parseFloat(it.price) || 0;
      const qty = parseInt(it.quantity, 10) || 1;
      const subtotal = (price * qty).toFixed(2);
      return `
        <tr>
          <td class="py-2.5 px-3">
            <div class="flex items-center gap-2">
              <img src="${it.image || '/uploads/9g.png'}" class="w-8 h-8 rounded-lg object-contain bg-slate-50 border border-slate-200" onerror="this.src='/uploads/9g.png'">
              <div>
                <p class="font-bold text-slate-900">${it.name || 'Formulation'}</p>
                <span class="text-[10px] text-slate-400">${it.unit || 'Strip'}</span>
              </div>
            </div>
          </td>
          <td class="py-2.5 px-3 font-semibold text-slate-700">₹${price}</td>
          <td class="py-2.5 px-3 font-bold text-slate-900">${qty}</td>
          <td class="py-2.5 px-3 text-right font-black text-brand-800">₹${subtotal}</td>
        </tr>
      `;
    }).join('');
  }

  if (orderModal) orderModal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

function closeOrderModal() {
  if (orderModal) orderModal.classList.add('hidden');
}

async function handleOrderStatusUpdate(e) {
  e.preventDefault();
  const id = editOrderId.value;
  const status = editOrderStatus.value;
  const payment = editPaymentStatus.value;
  const notes = editOrderNotes.value.trim();

  try {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderStatus: status,
        status: status,
        paymentStatus: payment,
        notes,
      }),
    });
    const result = await res.json();
    if (res.ok && result.success) {
      showToast(result.message || 'Order updated successfully!');
      closeOrderModal();
      await loadOrders();
    } else {
      showToast(result.message || 'Update failed.', 'error');
    }
  } catch {
    showToast('Network error while updating order.', 'error');
  }
}

window.promptDeleteOrder = function(orderId) {
  orderToDeleteId = orderId;
  if (deleteOrderNumber) deleteOrderNumber.textContent = `#${orderId}`;
  if (deleteOrderModal) {
    deleteOrderModal.classList.remove('hidden');
  } else if (confirm(`Are you sure you want to permanently delete order #${orderId}?`)) {
    executeDeleteOrder();
  }
};

function closeDeleteOrderModal() {
  orderToDeleteId = null;
  if (deleteOrderModal) deleteOrderModal.classList.add('hidden');
}

async function executeDeleteOrder() {
  if (!orderToDeleteId) return;
  try {
    const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderToDeleteId)}`, { method: 'DELETE' });
    const result = await res.json();
    if (res.ok && result.success) {
      showToast(result.message || 'Order record deleted.');
      closeDeleteOrderModal();
      await loadOrders();
    } else {
      showToast(result.message || 'Failed to delete order.', 'error');
    }
  } catch {
    showToast('Network error while deleting order.', 'error');
  }
}

// -----------------------------------------------------------------
// Overview & Analytics Sync
// -----------------------------------------------------------------
function updateOverviewStats() {
  const overviewActiveCount = document.getElementById('overviewActiveCount');
  const overviewHiddenCount = document.getElementById('overviewHiddenCount');
  const overviewTotalCount = document.getElementById('overviewTotalCount');
  const overviewPendingOrders = document.getElementById('overviewPendingOrders');
  const overviewShippedOrders = document.getElementById('overviewShippedOrders');
  const overviewDeliveredOrders = document.getElementById('overviewDeliveredOrders');

  if (overviewActiveCount && statActive) overviewActiveCount.textContent = statActive.textContent;
  if (overviewHiddenCount && statHidden) overviewHiddenCount.textContent = statHidden.textContent;
  if (overviewTotalCount && statTotal) overviewTotalCount.textContent = statTotal.textContent;

  if (overviewPendingOrders && orderStatPending) overviewPendingOrders.textContent = orderStatPending.textContent;
  if (overviewShippedOrders && orderStatShipped) overviewShippedOrders.textContent = orderStatShipped.textContent;
  if (overviewDeliveredOrders && orderStatDelivered) overviewDeliveredOrders.textContent = orderStatDelivered.textContent;
}

// Debounce helper
function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// HTML escape helper for XSS prevention
function escapeHtml(str) {
  if (typeof str !== 'string') return String(str || '');
  return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}

// -----------------------------------------------------------------
// Enquiries Management Logic
// -----------------------------------------------------------------
function bindEnquiryEvents() {
  if (searchEnquiryInput) {
    searchEnquiryInput.addEventListener('input', debounce(loadEnquiries, 300));
  }
  if (filterEnquiryStatus) {
    filterEnquiryStatus.addEventListener('change', loadEnquiries);
  }
  if (refreshEnquiriesBtn) {
    refreshEnquiriesBtn.addEventListener('click', loadEnquiries);
  }
}

async function loadEnquiries() {
  try {
    const search = searchEnquiryInput ? searchEnquiryInput.value.trim() : '';
    const status = filterEnquiryStatus ? filterEnquiryStatus.value : 'All';
    let url = `/api/admin/enquiries?page=1&limit=100`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (status && status !== 'All') url += `&status=${encodeURIComponent(status)}`;

    const res = await fetch(url);
    if (!res.ok) return;
    const result = await res.json();
    if (result.success) {
      enquiriesList = result.data || [];
      if (result.counts) {
        if (statEnquiriesTotal) statEnquiriesTotal.textContent = result.counts.total ?? 0;
        if (statEnquiriesNew) statEnquiriesNew.textContent = result.counts.new ?? 0;
        if (statEnquiriesContacted) statEnquiriesContacted.textContent = result.counts.contacted ?? 0;
        if (statEnquiriesResolved) statEnquiriesResolved.textContent = result.counts.resolved ?? 0;
        if (sidebarEnquiriesNew) {
          sidebarEnquiriesNew.textContent = result.counts.new ?? 0;
        }
      }
      renderEnquiries(enquiriesList);
    }
  } catch (err) {
    console.error('Failed to load enquiries:', err);
  }
}

function renderEnquiries(list) {
  if (!enquiriesTableBody) return;
  enquiriesTableBody.innerHTML = '';

  if (!list || list.length === 0) {
    if (enquiriesEmptyState) enquiriesEmptyState.classList.remove('hidden');
    return;
  }
  if (enquiriesEmptyState) enquiriesEmptyState.classList.add('hidden');

  list.forEach((item) => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition-colors';

    const dateFormatted = item.createdAt
      ? new Date(item.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—';

    const safeName = escapeHtml(item.name || 'Anonymous');
    const safeEmail = escapeHtml(item.email || '');
    const safePhone = escapeHtml(item.phone || '');
    const safeSubject = escapeHtml(item.subject || 'General');
    const safeMsg = escapeHtml(item.message || '');
    const initial = (safeName[0] || 'U').toUpperCase();

    tr.innerHTML = `
      <td class="py-4 px-4 whitespace-nowrap text-slate-500 font-medium">${dateFormatted}</td>
      <td class="py-4 px-4">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs flex items-center justify-center shrink-0">
            ${initial}
          </div>
          <div>
            <div class="font-bold text-slate-900">${safeName}</div>
          </div>
        </div>
      </td>
      <td class="py-4 px-4 whitespace-nowrap">
        <div class="space-y-0.5">
          ${safeEmail ? `<a href="mailto:${safeEmail}" class="text-brand-700 hover:underline font-semibold flex items-center gap-1.5"><i data-lucide="mail" class="w-3.5 h-3.5 text-slate-400"></i>${safeEmail}</a>` : ''}
          ${safePhone ? `<a href="tel:${safePhone}" class="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5"><i data-lucide="phone" class="w-3.5 h-3.5 text-slate-400"></i>${safePhone}</a>` : ''}
        </div>
      </td>
      <td class="py-4 px-4 whitespace-nowrap">
        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
          ${safeSubject}
        </span>
      </td>
      <td class="py-4 px-4 max-w-xs sm:max-w-md">
        <p class="text-xs text-slate-700 font-normal leading-relaxed break-words whitespace-pre-line">${safeMsg}</p>
      </td>
      <td class="py-4 px-4 text-center whitespace-nowrap">
        <select
          onchange="updateEnquiryStatus('${item.id}', this.value)"
          class="text-xs font-bold rounded-xl px-2.5 py-1.5 border focus:outline-none cursor-pointer ${
            item.status === 'resolved'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : item.status === 'contacted'
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-blue-50 text-blue-800 border-blue-200'
          }"
        >
          <option value="new" ${item.status === 'new' ? 'selected' : ''}>New</option>
          <option value="contacted" ${item.status === 'contacted' ? 'selected' : ''}>Contacted</option>
          <option value="resolved" ${item.status === 'resolved' ? 'selected' : ''}>Resolved</option>
        </select>
      </td>
      <td class="py-4 px-4 text-right whitespace-nowrap">
        <button
          onclick="promptDeleteEnquiry('${item.id}')"
          class="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title="Delete Enquiry"
        >
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </td>
    `;
    enquiriesTableBody.appendChild(tr);
  });

  if (window.lucide) window.lucide.createIcons();
}

window.updateEnquiryStatus = async function(id, newStatus) {
  try {
    const res = await fetch(`/api/admin/enquiries/${encodeURIComponent(id)}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    const result = await res.json();
    if (res.ok && result.success) {
      showToast(result.message || 'Status updated');
      await loadEnquiries();
    } else {
      showToast(result.message || 'Failed to update status', 'error');
    }
  } catch {
    showToast('Network error while updating status', 'error');
  }
};

window.promptDeleteEnquiry = async function(id) {
  const item = enquiriesList.find((e) => (e.id || e._id) === id);
  const name = item ? item.name : 'this contact lead';
  if (!confirm(`Are you sure you want to delete inquiry from "${name}"?`)) return;
  try {
    const res = await fetch(`/api/admin/enquiries/${encodeURIComponent(id)}`, { method: 'DELETE' });
    const result = await res.json();
    if (res.ok && result.success) {
      showToast(result.message || 'Enquiry deleted');
      await loadEnquiries();
    } else {
      showToast(result.message || 'Failed to delete enquiry', 'error');
    }
  } catch {
    showToast('Network error while deleting enquiry', 'error');
  }
};

// Run immediately if DOM is already parsed, or wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
