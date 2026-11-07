// SKILLVAULT AI - Main Application Logic
// State Management
const STATE = {
  activeTab: 'projects', // 'projects' | 'categories' | 'skills' | 'guide'
  selectedCategory: 'all',
  searchQuery: '',
  curatedOnly: false,
  projects: [],
  categories: [],
  skills: [],
  filteredSkills: [],
  displayedSkillsCount: 30,
  cart: [],
  selectedItem: null, // For detail modal
  currentOrder: null,
  bankConfig: {
    bankId: 'MB',
    bankName: 'MB Bank (Quân Đội)',
    accountNo: '0987654321',
    accountName: 'NGUYEN VAN A',
    template: 'compact2'
  }
};

// Supported Banks for VietQR
const SUPPORTED_BANKS = [
  { id: 'MB', name: 'MB Bank (Ngân hàng Quân Đội)', bin: '970422' },
  { id: 'VCB', name: 'Vietcombank (Ngoại thương)', bin: '970436' },
  { id: 'TCB', name: 'Techcombank (Kỹ thương)', bin: '970407' },
  { id: 'VPB', name: 'VPBank (Việt Nam Thịnh Vượng)', bin: '970432' },
  { id: 'ACB', name: 'ACB (Á Châu)', bin: '970416' },
  { id: 'BIDV', name: 'BIDV (Đầu tư & Phát triển)', bin: '970418' },
  { id: 'ICB', name: 'VietinBank (Công thương)', bin: '970415' },
  { id: 'TPB', name: 'TPBank (Tiên Phong)', bin: '970458' },
  { id: 'STB', name: 'Sacombank (Sài Gòn Thương Tín)', bin: '970403' },
  { id: 'HDB', name: 'HDBank (Phát triển TP.HCM)', bin: '970437' },
  { id: 'VIB', name: 'VIB (Quốc tế)', bin: '970441' }
];

// Formatting Utilities
function formatVND(number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
  loadLocalStorage();
  await loadData();
  setupEventListeners();
  renderApp();
  lucide.createIcons();
});

function loadLocalStorage() {
  const savedBank = localStorage.getItem('skillvault_bank');
  if (savedBank) {
    try { STATE.bankConfig = JSON.parse(savedBank); } catch(e){}
  }
  const savedCart = localStorage.getItem('skillvault_cart');
  if (savedCart) {
    try { STATE.cart = JSON.parse(savedCart); } catch(e){}
  }
  updateCartBadge();
}

function saveLocalStorage() {
  localStorage.setItem('skillvault_bank', JSON.stringify(STATE.bankConfig));
  localStorage.setItem('skillvault_cart', JSON.stringify(STATE.cart));
  updateCartBadge();
}

async function loadData() {
  try {
    const [projRes, catRes, skillsRes] = await Promise.all([
      fetch('data/projects.json').then(r => r.json()),
      fetch('data/categories.json').then(r => r.json()),
      fetch('skills-data.json').then(r => r.json())
    ]);
    STATE.projects = projRes;
    STATE.categories = catRes;
    STATE.skills = skillsRes;
    filterSkills();
  } catch (err) {
    console.error('Error loading data:', err);
  }
}

function setupEventListeners() {
  // Navigation Tabs
  document.querySelectorAll('[data-nav-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tab = btn.getAttribute('data-nav-tab');
      setTab(tab);
    });
  });

  // Global Search input
  const searchInput = document.getElementById('global-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      STATE.searchQuery = e.target.value.trim().toLowerCase();
      filterSkills();
      if (STATE.activeTab === 'projects') {
        renderProjects();
      } else {
        renderSkills();
      }
    });
  }

  // Quick search pills in hero
  document.querySelectorAll('[data-quick-search]').forEach(pill => {
    pill.addEventListener('click', () => {
      const query = pill.getAttribute('data-quick-search');
      if (searchInput) searchInput.value = query;
      STATE.searchQuery = query.toLowerCase();
      setTab('skills');
      filterSkills();
      renderSkills();
    });
  });

  // Cart Button
  document.getElementById('cart-btn')?.addEventListener('click', openCartModal);
  
  // Bank Settings Button
  document.getElementById('bank-settings-btn')?.addEventListener('click', openBankModal);

  // Close Modals on click outside or close buttons
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      closeAllModals();
    });
  });
}

function setTab(tab) {
  STATE.activeTab = tab;
  document.querySelectorAll('[data-nav-tab]').forEach(btn => {
    if (btn.getAttribute('data-nav-tab') === tab) {
      btn.className = "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20";
    } else {
      btn.className = "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800/60";
    }
  });

  const views = ['projects-view', 'categories-view', 'skills-view', 'guide-view'];
  views.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.classList.add('hidden');
  });

  const activeViewEl = document.getElementById(`${tab}-view`);
  if (activeViewEl) activeViewEl.classList.remove('hidden');

  if (tab === 'projects') renderProjects();
  if (tab === 'categories') renderCategories();
  if (tab === 'skills') renderSkills();

  lucide.createIcons();
}

function filterSkills() {
  STATE.filteredSkills = STATE.skills.filter(s => {
    // Category match
    const matchCat = (STATE.selectedCategory === 'all') || (s.category === STATE.selectedCategory);
    // Curated toggle
    const matchCurated = !STATE.curatedOnly || s.isCurated;
    // Search query match
    const matchQuery = !STATE.searchQuery || 
      s.name.toLowerCase().includes(STATE.searchQuery) ||
      s.description.toLowerCase().includes(STATE.searchQuery) ||
      (s.tags && s.tags.some(t => t.toLowerCase().includes(STATE.searchQuery)));

    return matchCat && matchCurated && matchQuery;
  });
}

// RENDER: PROJECTS (DỰ ÁN BUNDLE)
function renderProjects() {
  const container = document.getElementById('projects-grid');
  if (!container) return;

  let projectsToRender = STATE.projects;
  if (STATE.searchQuery) {
    projectsToRender = projectsToRender.filter(p => 
      p.name.toLowerCase().includes(STATE.searchQuery) ||
      p.summary.toLowerCase().includes(STATE.searchQuery) ||
      p.skills.some(sk => sk.toLowerCase().includes(STATE.searchQuery))
    );
  }

  if (projectsToRender.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-400">
        <i data-lucide="search-x" class="w-12 h-12 mx-auto mb-3 text-slate-600"></i>
        <p class="text-lg font-medium">Không tìm thấy gói dự án phù hợp với từ khóa "${escapeHtml(STATE.searchQuery)}".</p>
        <button onclick="clearSearch()" class="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-sm font-semibold rounded-lg transition">Xóa tìm kiếm</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = projectsToRender.map(p => {
    return `
      <div class="group relative flex flex-col justify-between rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/50 p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1">
        <div class="absolute -top-3 right-6">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-amber-500 to-red-500 text-slate-950 shadow-md">
            <i data-lucide="sparkle" class="w-3 h-3"></i> ${escapeHtml(p.badge)}
          </span>
        </div>

        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white shadow-lg">
              <i data-lucide="${p.icon || 'folder-kanban'}" class="w-6 h-6"></i>
            </div>
            <div>
              <span class="text-xs font-semibold text-slate-400 tracking-wider uppercase">${escapeHtml(p.category)}</span>
              <div class="flex items-center gap-1 text-amber-400 text-xs font-bold mt-0.5">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i> ${p.rating.toFixed(1)}
                <span class="text-slate-500 font-normal">(${p.reviewsCount} đánh giá)</span>
              </div>
            </div>
          </div>

          <h3 class="text-xl font-bold text-white group-hover:text-amber-400 transition mb-2.5 leading-snug">
            ${escapeHtml(p.name)}
          </h3>

          <p class="text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed">
            ${escapeHtml(p.summary)}
          </p>

          <div class="space-y-1.5 mb-5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/50">
            <p class="text-xs font-bold text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <i data-lucide="check-circle" class="w-3.5 h-3.5"></i> Điểm Nhấn Kỹ Thuật:
            </p>
            ${p.highlights.slice(0, 3).map(h => `
              <div class="flex items-start gap-2 text-xs text-slate-300">
                <span class="text-amber-400 mt-0.5 font-bold">›</span>
                <span>${escapeHtml(h)}</span>
              </div>
            `).join('')}
          </div>

          <div class="mb-4">
            <span class="text-xs text-slate-400 block mb-1.5 font-medium">Bao gồm ${p.skills.length} skills cốt lõi:</span>
            <div class="flex flex-wrap gap-1.5">
              ${p.skills.map(sk => `
                <span class="inline-block px-2 py-0.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-mono rounded border border-slate-700/60">
                  ${escapeHtml(sk)}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-slate-800/70 mt-2">
          <div class="flex items-baseline justify-between mb-4">
            <div>
              <span class="text-2xl font-black text-white tracking-tight">${formatVND(p.price)}</span>
              <span class="text-xs text-slate-500 line-through ml-2">${formatVND(p.originalPrice)}</span>
            </div>
            <span class="text-xs font-bold text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-2 py-0.5 rounded-md">
              Tiết kiệm ${p.discount}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button onclick="openDetailModal('project', '${p.id}')" class="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition flex items-center justify-center gap-1.5 border border-slate-700">
              <i data-lucide="info" class="w-3.5 h-3.5"></i> Chi tiết
            </button>
            <button onclick="buyNow('project', '${p.id}')" class="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20">
              <i data-lucide="qr-code" class="w-3.5 h-3.5"></i> Mua Ngay QR
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// RENDER: CATEGORIES (THEO TỪNG MỤC)
function renderCategories() {
  const container = document.getElementById('categories-grid');
  if (!container) return;

  container.innerHTML = STATE.categories.map(c => {
    // Count skills in this category
    const count = STATE.skills.filter(s => s.category === c.slug).length;

    return `
      <div onclick="selectCategoryAndFilter('${c.slug}')" class="group cursor-pointer relative p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white shadow-lg">
              <i data-lucide="${c.icon || 'folder'}" class="w-6 h-6"></i>
            </div>
            <span class="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
              ${c.badge}
            </span>
          </div>

          <h3 class="text-lg font-bold text-white group-hover:text-amber-400 transition mb-2">
            ${escapeHtml(c.name)}
          </h3>

          <p class="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
            ${escapeHtml(c.description)}
          </p>
        </div>

        <div class="pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-amber-400">
          <span>Xem ${count > 0 ? count : 'Kho'} Kỹ Năng</span>
          <i data-lucide="arrow-right" class="w-4 h-4 transition transform group-hover:translate-x-1"></i>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function selectCategoryAndFilter(categorySlug) {
  STATE.selectedCategory = categorySlug;
  setTab('skills');
  const catSelect = document.getElementById('category-filter');
  if (catSelect) catSelect.value = categorySlug;
  filterSkills();
  renderSkills();
}

// RENDER: INDIVIDUAL SKILLS (TỪNG SKILL LẺ)
function renderSkills() {
  const container = document.getElementById('skills-grid');
  const countEl = document.getElementById('skills-count-text');
  if (!container) return;

  if (countEl) {
    countEl.innerText = `Hiển thị ${Math.min(STATE.displayedSkillsCount, STATE.filteredSkills.length)} / ${STATE.filteredSkills.length} kỹ năng phù hợp`;
  }

  const skillsToShow = STATE.filteredSkills.slice(0, STATE.displayedSkillsCount);

  if (skillsToShow.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-400">
        <i data-lucide="folder-search" class="w-12 h-12 mx-auto mb-3 text-slate-600"></i>
        <p class="text-lg font-medium">Không tìm thấy kỹ năng nào phù hợp với bộ lọc hiện tại.</p>
        <button onclick="resetSkillFilters()" class="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-sm font-semibold rounded-lg transition">Đặt lại bộ lọc</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = skillsToShow.map(s => {
    return `
      <div class="group flex flex-col justify-between rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 p-4 transition duration-200 hover:shadow-lg hover:shadow-amber-500/5">
        <div>
          <div class="flex items-start justify-between gap-2 mb-2">
            <span class="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${s.isCurated ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}">
              ${escapeHtml(s.badge)}
            </span>
            <div class="flex items-center gap-1 text-amber-400 text-xs font-semibold">
              <i data-lucide="star" class="w-3 h-3 fill-amber-400"></i>
              <span>${s.rating.toFixed(1)}</span>
            </div>
          </div>

          <h4 class="text-base font-bold text-white group-hover:text-amber-400 transition mb-1 font-mono break-all">
            ${escapeHtml(s.name)}
          </h4>

          <p class="text-xs text-slate-400 line-clamp-3 mb-3 leading-relaxed">
            ${escapeHtml(s.description)}
          </p>

          <div class="flex flex-wrap gap-1 mb-3">
            ${(s.tags || []).slice(0, 3).map(t => `
              <span class="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">${escapeHtml(t)}</span>
            `).join('')}
          </div>
        </div>

        <div class="pt-3 border-t border-slate-800 flex items-center justify-between mt-1">
          <div>
            <span class="text-base font-black text-white">${formatVND(s.price)}</span>
            <span class="text-[11px] text-slate-500 line-through ml-1">${formatVND(s.originalPrice)}</span>
          </div>

          <div class="flex items-center gap-1.5">
            <button onclick="openDetailModal('skill', '${s.id}')" title="Xem chi tiết" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="addToCart('skill', '${s.id}')" title="Thêm vào giỏ" class="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold transition border border-slate-700">
              <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="buyNow('skill', '${s.id}')" class="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1 shadow-md shadow-amber-500/20">
              <i data-lucide="qr-code" class="w-3 h-3"></i> Mua
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Show "Load More" button if needed
  const loadMoreBtn = document.getElementById('load-more-btn');
  if (loadMoreBtn) {
    if (STATE.displayedSkillsCount < STATE.filteredSkills.length) {
      loadMoreBtn.classList.remove('hidden');
    } else {
      loadMoreBtn.classList.add('hidden');
    }
  }

  lucide.createIcons();
}

function loadMoreSkills() {
  STATE.displayedSkillsCount += 30;
  renderSkills();
}

function resetSkillFilters() {
  STATE.searchQuery = '';
  STATE.selectedCategory = 'all';
  STATE.curatedOnly = false;
  const searchInput = document.getElementById('global-search');
  if (searchInput) searchInput.value = '';
  const catSelect = document.getElementById('category-filter');
  if (catSelect) catSelect.value = 'all';
  filterSkills();
  renderSkills();
}

function clearSearch() {
  resetSkillFilters();
  renderProjects();
}

// CART MANAGEMENT
function addToCart(type, id) {
  let item = null;
  if (type === 'project') {
    item = STATE.projects.find(p => p.id === id);
  } else {
    item = STATE.skills.find(s => s.id === id);
  }

  if (!item) return;

  const exists = STATE.cart.find(c => c.id === item.id && c.type === type);
  if (exists) {
    showNotification(`Đã có "${item.name}" trong giỏ hàng!`, 'info');
    openCartModal();
    return;
  }

  STATE.cart.push({
    type,
    id: item.id,
    name: item.name,
    price: item.price,
    badge: item.badge || 'Kỹ năng',
    category: item.category
  });

  saveLocalStorage();
  showNotification(`Đã thêm "${item.name}" vào giỏ hàng!`, 'success');
}

function removeFromCart(index) {
  STATE.cart.splice(index, 1);
  saveLocalStorage();
  renderCartModal();
}

function clearCart() {
  STATE.cart = [];
  saveLocalStorage();
  renderCartModal();
}

function updateCartBadge() {
  const count = STATE.cart.length;
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.innerText = count;
    if (count > 0) {
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
}

// MODAL CONTROLLERS
function closeAllModals() {
  const modals = ['detail-modal', 'cart-modal', 'checkout-modal', 'bank-modal', 'success-modal'];
  modals.forEach(m => document.getElementById(m)?.classList.add('hidden'));
}

// DETAIL MODAL
function openDetailModal(type, id) {
  let item = null;
  if (type === 'project') {
    item = STATE.projects.find(p => p.id === id);
  } else {
    item = STATE.skills.find(s => s.id === id);
  }

  if (!item) return;
  STATE.selectedItem = { type, item };

  const modal = document.getElementById('detail-modal');
  const titleEl = document.getElementById('detail-title');
  const badgeEl = document.getElementById('detail-badge');
  const bodyEl = document.getElementById('detail-body');
  const priceEl = document.getElementById('detail-price');
  const origPriceEl = document.getElementById('detail-original-price');

  if (titleEl) titleEl.innerText = item.name;
  if (badgeEl) badgeEl.innerText = item.badge || 'Kỹ năng Antigravity';
  if (priceEl) priceEl.innerText = formatVND(item.price);
  if (origPriceEl) origPriceEl.innerText = formatVND(item.originalPrice);

  let detailsHtml = '';

  if (type === 'project') {
    detailsHtml = `
      <div class="space-y-5">
        <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(item.description)}</p>

        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <i data-lucide="check-circle" class="w-4 h-4"></i> Đặc quyền gói giải pháp:
          </h4>
          <ul class="space-y-2 text-xs text-slate-300">
            ${item.highlights.map(h => `
              <li class="flex items-start gap-2">
                <span class="text-amber-400 font-bold">✓</span>
                <span>${escapeHtml(h)}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <div>
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2.5">Toàn bộ ${item.skills.length} Kỹ năng bên trong:</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${item.skills.map(sk => `
              <div class="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300">
                <i data-lucide="file-code" class="w-3.5 h-3.5 text-amber-400"></i>
                <span class="font-mono font-medium">${escapeHtml(sk)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl text-xs text-amber-300">
          <p class="font-bold mb-1 flex items-center gap-1.5">
            <i data-lucide="shield-check" class="w-4 h-4 text-amber-400"></i> Cam Kết Chất Lượng:
          </p>
          <p class="text-slate-300">Nhận ngay file zip đầy đủ mã nguồn Python, Node.js, prompt chuẩn hóa, file âm thanh bản quyền và tài liệu hướng dẫn 1-click cài đặt vào Antigravity.</p>
        </div>
      </div>
    `;
  } else {
    detailsHtml = `
      <div class="space-y-5">
        <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(item.description)}</p>

        <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wide flex items-center gap-1.5">
            <i data-lucide="terminal" class="w-4 h-4"></i> Thông Số Kỹ Thuật Skill:
          </h4>
          <div class="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span class="text-slate-500 block">Mã định danh (ID):</span>
              <span class="text-slate-200 font-mono font-bold">${escapeHtml(item.id)}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Chuyên mục:</span>
              <span class="text-slate-200 uppercase font-semibold">${escapeHtml(item.category)}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Độ tin cậy:</span>
              <span class="text-emerald-400 font-semibold">100% Verified Safe</span>
            </div>
            <div>
              <span class="text-slate-500 block">Nền tảng hỗ trợ:</span>
              <span class="text-slate-200">Antigravity / Claude Code</span>
            </div>
          </div>
        </div>

        <div class="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Lệnh kích hoạt nhanh trong Antigravity:</h4>
          <div class="bg-slate-900 px-3 py-2 rounded-lg font-mono text-xs text-amber-300 flex items-center justify-between">
            <span>/skill ${escapeHtml(item.id)}</span>
            <button onclick="copyToClipboard('/skill ${escapeHtml(item.id)}')" class="text-slate-400 hover:text-white" title="Sao chép lệnh">
              <i data-lucide="copy" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (bodyEl) bodyEl.innerHTML = detailsHtml;

  // Setup detail modal CTA buttons
  const detailBuyBtn = document.getElementById('detail-buy-btn');
  const detailCartBtn = document.getElementById('detail-cart-btn');

  if (detailBuyBtn) {
    detailBuyBtn.onclick = () => {
      closeAllModals();
      buyNow(type, item.id);
    };
  }
  if (detailCartBtn) {
    detailCartBtn.onclick = () => {
      addToCart(type, item.id);
      closeAllModals();
    };
  }

  modal?.classList.remove('hidden');
  lucide.createIcons();
}

// CART MODAL
function openCartModal() {
  closeAllModals();
  renderCartModal();
  document.getElementById('cart-modal')?.classList.remove('hidden');
  lucide.createIcons();
}

function renderCartModal() {
  const listEl = document.getElementById('cart-items-list');
  const totalEl = document.getElementById('cart-total-price');
  const emptyEl = document.getElementById('cart-empty');
  const contentEl = document.getElementById('cart-content');

  if (!listEl) return;

  if (STATE.cart.length === 0) {
    emptyEl?.classList.remove('hidden');
    contentEl?.classList.add('hidden');
    return;
  }

  emptyEl?.classList.add('hidden');
  contentEl?.classList.remove('hidden');

  let total = 0;

  listEl.innerHTML = STATE.cart.map((c, idx) => {
    total += c.price;
    return `
      <div class="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800/80">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <i data-lucide="${c.type === 'project' ? 'folder-kanban' : 'file-code'}" class="w-4 h-4"></i>
          </div>
          <div>
            <span class="text-xs font-bold text-white block line-clamp-1">${escapeHtml(c.name)}</span>
            <span class="text-[11px] text-slate-400">${c.type === 'project' ? 'Gói dự án' : 'Kỹ năng lẻ'}</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-sm font-bold text-amber-400">${formatVND(c.price)}</span>
          <button onclick="removeFromCart(${idx})" class="text-slate-500 hover:text-red-400 transition" title="Xóa món">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (totalEl) totalEl.innerText = formatVND(total);
  lucide.createIcons();
}

// BUY NOW & CHECKOUT WITH VIETQR
function buyNow(type, id) {
  let item = null;
  if (type === 'project') {
    item = STATE.projects.find(p => p.id === id);
  } else {
    item = STATE.skills.find(s => s.id === id);
  }

  if (!item) return;

  // Single item checkout order
  const orderId = 'SK' + Math.floor(10000 + Math.random() * 90000);
  STATE.currentOrder = {
    orderId,
    items: [{
      type,
      id: item.id,
      name: item.name,
      price: item.price
    }],
    totalAmount: item.price,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    createdAt: new Date().toISOString()
  };

  openCheckoutModal();
}

function checkoutCart() {
  if (STATE.cart.length === 0) return;

  const totalAmount = STATE.cart.reduce((sum, item) => sum + item.price, 0);
  const orderId = 'SK' + Math.floor(10000 + Math.random() * 90000);

  STATE.currentOrder = {
    orderId,
    items: [...STATE.cart],
    totalAmount,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    createdAt: new Date().toISOString()
  };

  openCheckoutModal();
}

function openCheckoutModal() {
  closeAllModals();
  const order = STATE.currentOrder;
  if (!order) return;

  const modal = document.getElementById('checkout-modal');
  const orderIdEl = document.getElementById('checkout-order-id');
  const amountEl = document.getElementById('checkout-amount');
  const summaryEl = document.getElementById('checkout-summary-list');
  const qrImgEl = document.getElementById('vietqr-image');

  // Banking Info display
  const bankNameEl = document.getElementById('qr-bank-name');
  const accNoEl = document.getElementById('qr-account-no');
  const accNameEl = document.getElementById('qr-account-name');
  const memoEl = document.getElementById('qr-transfer-memo');

  const transferMemo = `${order.orderId}`;

  if (orderIdEl) orderIdEl.innerText = `#${order.orderId}`;
  if (amountEl) amountEl.innerText = formatVND(order.totalAmount);
  if (bankNameEl) bankNameEl.innerText = STATE.bankConfig.bankName;
  if (accNoEl) accNoEl.innerText = STATE.bankConfig.accountNo;
  if (accNameEl) accNameEl.innerText = STATE.bankConfig.accountName;
  if (memoEl) memoEl.innerText = transferMemo;

  // Generate VietQR URL
  // Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<MEMO>&accountName=<NAME>
  const qrUrl = `https://img.vietqr.io/image/${STATE.bankConfig.bankId}-${STATE.bankConfig.accountNo}-${STATE.bankConfig.template}.png?amount=${order.totalAmount}&addInfo=${encodeURIComponent(transferMemo)}&accountName=${encodeURIComponent(STATE.bankConfig.accountName)}`;

  if (qrImgEl) {
    qrImgEl.src = qrUrl;
  }

  // Render items in checkout
  if (summaryEl) {
    summaryEl.innerHTML = order.items.map(it => `
      <div class="flex items-center justify-between text-xs py-1 border-b border-slate-800/60 last:border-0">
        <span class="text-slate-300 font-medium">${escapeHtml(it.name)}</span>
        <span class="text-amber-400 font-bold">${formatVND(it.price)}</span>
      </div>
    `).join('');
  }

  startCountdown(15 * 60); // 15 minutes countdown

  modal?.classList.remove('hidden');
  lucide.createIcons();
}

let countdownInterval = null;
function startCountdown(seconds) {
  if (countdownInterval) clearInterval(countdownInterval);
  const countdownEl = document.getElementById('qr-countdown');
  let remaining = seconds;

  function update() {
    if (!countdownEl) return;
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    countdownEl.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      countdownEl.innerText = "Hết hạn";
    }
    remaining--;
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

// CONFIRM PAYMENT SUCCESS
function confirmPaymentDone() {
  const order = STATE.currentOrder;
  if (!order) return;

  const nameInput = document.getElementById('checkout-customer-name');
  const emailInput = document.getElementById('checkout-customer-email');

  order.customerName = nameInput?.value.trim() || 'Quý khách';
  order.customerEmail = emailInput?.value.trim() || 'khachhang@gmail.com';

  // Clear cart if checkout was from cart
  STATE.cart = [];
  saveLocalStorage();

  closeAllModals();

  // Show Success Delivery Modal
  const successModal = document.getElementById('success-modal');
  const successOrderIdEl = document.getElementById('success-order-id');
  const successEmailEl = document.getElementById('success-customer-email');

  if (successOrderIdEl) successOrderIdEl.innerText = `#${order.orderId}`;
  if (successEmailEl) successEmailEl.innerText = order.customerEmail;

  successModal?.classList.remove('hidden');
  lucide.createIcons();
}

// ADMIN / SELLER BANK CONFIGURATION
function openBankModal() {
  closeAllModals();
  const modal = document.getElementById('bank-modal');
  const bankSelect = document.getElementById('cfg-bank-id');
  const accNoInput = document.getElementById('cfg-account-no');
  const accNameInput = document.getElementById('cfg-account-name');

  // Populate bank options if empty
  if (bankSelect && bankSelect.options.length <= 1) {
    bankSelect.innerHTML = SUPPORTED_BANKS.map(b => `
      <option value="${b.id}" ${b.id === STATE.bankConfig.bankId ? 'selected' : ''}>${b.name}</option>
    `).join('');
  } else if (bankSelect) {
    bankSelect.value = STATE.bankConfig.bankId;
  }

  if (accNoInput) accNoInput.value = STATE.bankConfig.accountNo;
  if (accNameInput) accNameInput.value = STATE.bankConfig.accountName;

  modal?.classList.remove('hidden');
  lucide.createIcons();
}

function saveBankSettings() {
  const bankSelect = document.getElementById('cfg-bank-id');
  const accNoInput = document.getElementById('cfg-account-no');
  const accNameInput = document.getElementById('cfg-account-name');

  const selectedBank = SUPPORTED_BANKS.find(b => b.id === bankSelect.value);

  STATE.bankConfig.bankId = bankSelect.value;
  STATE.bankConfig.bankName = selectedBank ? selectedBank.name : bankSelect.value;
  STATE.bankConfig.accountNo = accNoInput.value.trim();
  STATE.bankConfig.accountName = accNameInput.value.trim().toUpperCase();

  saveLocalStorage();
  closeAllModals();
  showNotification('Đã lưu cấu hình tài khoản ngân hàng thành công!', 'success');
}

// UTILITY HELPERS
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showNotification(`Đã sao chép: "${text}"`, 'success');
  }).catch(() => {
    showNotification('Không thể sao chép tự động!', 'error');
  });
}

function showNotification(message, type = 'info') {
  const toast = document.createElement('div');
  const colors = {
    success: 'bg-emerald-950 border-emerald-500/50 text-emerald-300',
    info: 'bg-slate-900 border-amber-500/50 text-amber-300',
    error: 'bg-red-950 border-red-500/50 text-red-300'
  };

  toast.className = `fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-2xl transition-all duration-300 transform translate-y-10 opacity-0 ${colors[type] || colors.info}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-4 h-4"></i>
    <span class="text-xs font-semibold">${escapeHtml(message)}</span>
  `;

  document.body.appendChild(toast);
  lucide.createIcons();

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function downloadSkillPackage() {
  // Simulate direct download or provide the local path
  showNotification('Đang chuẩn bị gói kỹ năng và tệp cài đặt...', 'info');
  setTimeout(() => {
    alert("ĐÃ KÍCH HOẠT:\n\n1. Kỹ năng đã có sẵn trên máy bạn tại:\n   J:\\Other computers\\My Computer (2)\\MTDES23\\CLAUDE SKILL\\Skills_Antigravity\\skills\\\n\n2. Đã được nạp thẳng vào Antigravity tại:\n   C:\\Users\\NCPC\\.gemini\\config\\skills\\\n\nBạn có thể gõ ngay câu lệnh trong Antigravity để sử dụng!");
  }, 500);
}
