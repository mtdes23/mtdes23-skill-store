// ==========================================================================
// SKILLVAULT AI — Apple.com Signature Application Engine
// Inspired by Apple HIG, SF Pro typography, Fluid Springs, & Apple Pay flow
// ==========================================================================

const STATE = {
  activeTab: 'projects', // 'projects' | 'categories' | 'skills' | 'guide'
  viewMode: 'grid',      // 'grid' | 'table'
  selectedCategory: 'all',
  searchQuery: '',
  curatedOnly: false,
  sortBy: 'popular',     // 'popular' | 'price-asc' | 'price-desc' | 'rating'
  projects: [],
  categories: [],
  skills: [],
  filteredSkills: [],
  displayedSkillsCount: 36,
  cart: [],
  discountCode: '',
  discountPercent: 0,
  selectedItem: null,
  currentOrder: null,
  soundEnabled: true,
  bankConfig: {
    bankId: 'MB',
    bankName: 'MB Bank (Quân Đội)',
    accountNo: '0987654321',
    accountName: 'NGUYEN VAN A',
    template: 'compact2'
  }
};

// Official VietQR Supported Banks
const SUPPORTED_BANKS = [
  { id: 'MB', name: 'MB Bank', bin: '970422', logo: 'https://api.vietqr.io/img/MB.png' },
  { id: 'VCB', name: 'Vietcombank', bin: '970436', logo: 'https://api.vietqr.io/img/VCB.png' },
  { id: 'TCB', name: 'Techcombank', bin: '970407', logo: 'https://api.vietqr.io/img/TCB.png' },
  { id: 'ACB', name: 'ACB', bin: '970416', logo: 'https://api.vietqr.io/img/ACB.png' },
  { id: 'VPB', name: 'VPBank', bin: '970432', logo: 'https://api.vietqr.io/img/VPB.png' },
  { id: 'TPB', name: 'TPBank', bin: '970458', logo: 'https://api.vietqr.io/img/TPB.png' },
  { id: 'BIDV', name: 'BIDV', bin: '970418', logo: 'https://api.vietqr.io/img/BIDV.png' },
  { id: 'ICB', name: 'VietinBank', bin: '970415', logo: 'https://api.vietqr.io/img/ICB.png' }
];

// Apple Keynote Style Terminal Presets
const TERMINAL_PRESETS = {
  xspeedvn: {
    command: "antigravity run /xspeedvn --preset 'f40-cinematic' --fps 60",
    outputs: [
      "[✓] Khởi động kịch bản 6 Hồi F40 & R34 Formula...",
      "[✓] Safe-zone 9:16 y=1510 (Frosted Glass active-word karaoke)...",
      "[✓] VieNeu-TTS Ultra-HD 48kHz + FFT ducking BGM cơ khí...",
      "[✓] Xuất bản phẩm 9:16 Ultra-HD chuẩn TikTok Studio!"
    ]
  },
  vieneu: {
    command: "vieneu-tts --model 'turbo-48k' --voice 'Hà Nội' --emotion 'natural'",
    outputs: [
      "[✓] Nạp mạng nơ-ron VieNeu-TTS v3 Turbo 48 kHz Ultra-HD...",
      "[✓] Zero-shot Voice Cloning trích xuất embedding 192 chiều...",
      "[✓] Streaming chunk âm thanh đầu tiên sau 115 ms...",
      "[✓] Xuất audio studio-grade kèm SRT bóc từ từng giây."
    ]
  },
  mrtkeyword: {
    command: "mrtkeyword --apply 'punch-headline, glass-graph, rec-frame'",
    outputs: [
      "[✓] Quét transcript phát hiện 12 điểm nhấn nội dung...",
      "[✓] Áp dụng 169 hiệu ứng: text-behind, clock, chat-bubble...",
      "[✓] Tránh vùng mặt diễn giả, căn chỉnh an toàn 100%...",
      "[✓] Hoàn thành render video tự động chỉ trong 45 giây!"
    ]
  },
  agency: {
    command: "agency nexus --squad 'engineering, marketing, security'",
    outputs: [
      "[✓] Kích hoạt 268 chuyên gia AI đa tác tử thuộc 18 phòng ban...",
      "[✓] Điều phối NEXUS 7 pha: Khám phá → Kiến trúc → Dev loops...",
      "[✓] Reality Checker kiểm tra nghiệm thu độc lập...",
      "[✓] Tự động hóa trọn gói dự án doanh nghiệp."
    ]
  }
};

// ==========================================================================
// Web Audio API — Apple Tactile Haptics Simulation
// ==========================================================================
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSound(type) {
  if (!STATE.soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === 'click') {
      // Subtle Apple-like click haptic
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } 
    else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.06);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    }
    else if (type === 'chime') {
      // Subtle Apple Pay chord
      [587.33, 880.00].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        gain.gain.setValueAtTime(0.06, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.25);
      });
    }
    else if (type === 'success') {
      // Apple Pay success chime
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.09, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.4);
      });
    }
  } catch (e) {
    console.warn(e);
  }
}

// Audio Sandbox Simulation (AirPods Pro style preview)
let demoAudioTimer = null;
function playAudioDemo(name, desc) {
  playSound('pop');
  const player = document.getElementById('audio-preview-bar');
  const title = document.getElementById('audio-preview-title');
  const descEl = document.getElementById('audio-preview-desc');
  const wave = document.getElementById('audio-preview-wave');

  if (title) title.innerText = name;
  if (descEl) descEl.innerText = desc;
  if (player) player.classList.remove('hidden');

  const ctx = getAudioContext();
  if (ctx) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.5);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.1);
  }

  if (wave) {
    wave.classList.add('animate-pulse');
    clearTimeout(demoAudioTimer);
    demoAudioTimer = setTimeout(() => {
      wave.classList.remove('animate-pulse');
    }, 2000);
  }
}

// ==========================================================================
// Formatting Utilities
// ==========================================================================
function formatVND(num) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', async () => {
  loadLocalStorage();
  await loadData();
  setupEventListeners();
  renderApp();
  initTerminalSimulation('xspeedvn');
  setupKeyboardShortcuts();
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
  const soundPref = localStorage.getItem('skillvault_sound');
  if (soundPref !== null) {
    STATE.soundEnabled = soundPref === 'true';
  }
  updateSoundIcon();
  updateCartBadge();
}

function saveLocalStorage() {
  localStorage.setItem('skillvault_bank', JSON.stringify(STATE.bankConfig));
  localStorage.setItem('skillvault_cart', JSON.stringify(STATE.cart));
  localStorage.setItem('skillvault_sound', String(STATE.soundEnabled));
  updateCartBadge();
}

function toggleSound() {
  STATE.soundEnabled = !STATE.soundEnabled;
  saveLocalStorage();
  updateSoundIcon();
  if (STATE.soundEnabled) playSound('chime');
  showToast(STATE.soundEnabled ? 'Đã bật âm thanh phản hồi' : 'Đã tắt âm thanh', 'info');
}

function updateSoundIcon() {
  const btn = document.getElementById('sound-toggle-btn');
  if (!btn) return;
  btn.innerHTML = STATE.soundEnabled 
    ? `<i data-lucide="volume-2" class="w-4 h-4 text-white"></i>` 
    : `<i data-lucide="volume-x" class="w-4 h-4 text-[#86868b]"></i>`;
  lucide.createIcons();
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

// ==========================================================================
// Event Listeners & Keyboard Shortcuts
// ==========================================================================
function setupEventListeners() {
  // Navigation Tabs
  document.querySelectorAll('[data-nav-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      const tab = btn.getAttribute('data-nav-tab');
      setTab(tab);
    });
  });

  // Global Search Input
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
      playSound('click');
      const query = pill.getAttribute('data-quick-search');
      if (searchInput) searchInput.value = query;
      STATE.searchQuery = query.toLowerCase();
      setTab('skills');
      filterSkills();
      renderSkills();
    });
  });

  // Cart Drawer Trigger
  document.getElementById('cart-btn')?.addEventListener('click', () => {
    playSound('pop');
    openCartDrawer();
  });

  document.getElementById('cart-drawer-close')?.addEventListener('click', closeCartDrawer);
  document.getElementById('cart-drawer-overlay')?.addEventListener('click', closeCartDrawer);

  // Bank Settings Button
  document.getElementById('bank-settings-btn')?.addEventListener('click', () => {
    playSound('pop');
    openBankModal();
  });

  // Sound Toggle Button
  document.getElementById('sound-toggle-btn')?.addEventListener('click', toggleSound);

  // Close all modal buttons
  document.querySelectorAll('[data-modal-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      closeAllModals();
    });
  });

  // Terminal Demo Switchers
  document.querySelectorAll('[data-terminal-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      const preset = btn.getAttribute('data-terminal-tab');
      document.querySelectorAll('[data-terminal-tab]').forEach(b => {
        b.className = "px-3 py-1.5 text-xs font-medium rounded-full text-[#86868b] hover:text-white transition";
      });
      btn.className = "px-3 py-1.5 text-xs font-semibold rounded-full bg-white/10 text-white backdrop-blur";
      initTerminalSimulation(preset);
    });
  });
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const input = document.getElementById('global-search');
      input?.focus();
      input?.select();
      playSound('pop');
    }
    if (e.key === 'Escape') {
      closeAllModals();
      closeCartDrawer();
    }
  });
}

// ==========================================================================
// Apple Terminal Simulation
// ==========================================================================
let typingTimeout = null;
function initTerminalSimulation(presetKey) {
  const preset = TERMINAL_PRESETS[presetKey] || TERMINAL_PRESETS.xspeedvn;
  const cmdEl = document.getElementById('term-command');
  const bodyEl = document.getElementById('term-body');
  if (!cmdEl || !bodyEl) return;

  if (typingTimeout) clearTimeout(typingTimeout);
  cmdEl.innerText = '';
  bodyEl.innerHTML = '';

  let i = 0;
  function typeChar() {
    if (i < preset.command.length) {
      cmdEl.innerText += preset.command.charAt(i);
      i++;
      typingTimeout = setTimeout(typeChar, 20);
    } else {
      let lineIdx = 0;
      function printLine() {
        if (lineIdx < preset.outputs.length) {
          const div = document.createElement('div');
          div.className = "text-xs font-mono flex items-start gap-2.5 py-1 text-[#d2d2d7] opacity-0 translate-y-1 transition duration-150";
          div.innerHTML = `<span class="text-[#2997ff] font-bold">›</span><span>${escapeHtml(preset.outputs[lineIdx])}</span>`;
          bodyEl.appendChild(div);
          requestAnimationFrame(() => {
            div.classList.remove('opacity-0', 'translate-y-1');
          });
          lineIdx++;
          typingTimeout = setTimeout(printLine, 110);
        }
      }
      typingTimeout = setTimeout(printLine, 180);
    }
  }
  typeChar();
}

// ==========================================================================
// Navigation & Filtering
// ==========================================================================
function setTab(tab) {
  STATE.activeTab = tab;
  
  document.querySelectorAll('[data-nav-tab]').forEach(btn => {
    const isTarget = btn.getAttribute('data-nav-tab') === tab;
    if (isTarget) {
      btn.className = "flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-xs transition-all duration-200 bg-white text-black shadow-md";
    } else {
      btn.className = "flex items-center gap-2 px-4 py-1.5 rounded-full font-medium text-xs transition-all duration-200 text-[#86868b] hover:text-white";
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
    const matchCat = (STATE.selectedCategory === 'all') || (s.category === STATE.selectedCategory);
    const matchCurated = !STATE.curatedOnly || s.isCurated;
    const matchQuery = !STATE.searchQuery || 
      s.name.toLowerCase().includes(STATE.searchQuery) ||
      s.description.toLowerCase().includes(STATE.searchQuery) ||
      (s.tags && s.tags.some(t => t.toLowerCase().includes(STATE.searchQuery)));

    return matchCat && matchCurated && matchQuery;
  });

  if (STATE.sortBy === 'price-asc') {
    STATE.filteredSkills.sort((a, b) => a.price - b.price);
  } else if (STATE.sortBy === 'price-desc') {
    STATE.filteredSkills.sort((a, b) => b.price - a.price);
  } else if (STATE.sortBy === 'rating') {
    STATE.filteredSkills.sort((a, b) => b.rating - a.rating);
  } else {
    STATE.filteredSkills.sort((a, b) => (b.isCurated ? 1 : 0) - (a.isCurated ? 1 : 0) || (b.downloads || 0) - (a.downloads || 0));
  }
}

function setViewMode(mode) {
  STATE.viewMode = mode;
  playSound('click');
  const gridBtn = document.getElementById('view-grid-btn');
  const tableBtn = document.getElementById('view-table-btn');
  if (gridBtn && tableBtn) {
    if (mode === 'grid') {
      gridBtn.className = "p-2 rounded-lg bg-white/10 text-white";
      tableBtn.className = "p-2 rounded-lg text-[#86868b] hover:text-white";
    } else {
      tableBtn.className = "p-2 rounded-lg bg-white/10 text-white";
      gridBtn.className = "p-2 rounded-lg text-[#86868b] hover:text-white";
    }
  }
  renderSkills();
}

// ==========================================================================
// RENDER: PROJECTS (APPLE BENTO SHOWCASE)
// ==========================================================================
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
      <div class="col-span-full py-20 text-center text-[#86868b]">
        <i data-lucide="search" class="w-10 h-10 mx-auto mb-3 text-[#515154]"></i>
        <p class="text-base font-medium">Không tìm thấy gói dự án phù hợp với "${escapeHtml(STATE.searchQuery)}".</p>
        <button onclick="clearSearch()" class="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-full transition">Xóa tìm kiếm</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = projectsToRender.map((p, idx) => {
    // Bento card sizing for visual rhythm
    const isLarge = idx === 0 || idx === 8;
    const cardColSpan = isLarge ? 'lg:col-span-2' : 'lg:col-span-1';

    return `
      <div class="${cardColSpan} group relative flex flex-col justify-between rounded-[28px] bg-[#161617] border border-white/[0.08] hover:border-white/[0.22] p-7 sm:p-8 transition-all duration-300 hover:shadow-2xl">
        
        <div>
          <!-- Top Tag -->
          <div class="flex items-center justify-between gap-2 mb-6">
            <span class="text-[11px] font-semibold tracking-wider uppercase text-[#86868b]">
              ${escapeHtml(p.author || 'Antigravity Verified')}
            </span>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-white backdrop-blur">
              ${escapeHtml(p.badge)}
            </span>
          </div>

          <!-- Title & Summary -->
          <h3 class="text-2xl sm:text-3xl font-bold text-[#f5f5f7] tracking-tight mb-3 leading-snug">
            ${escapeHtml(p.name)}
          </h3>

          <p class="text-sm text-[#86868b] leading-relaxed mb-6 font-normal">
            ${escapeHtml(p.summary)}
          </p>

          <!-- Apple Style Metric Highlight -->
          <div class="bg-[#1d1d1f] rounded-2xl p-4 mb-6 border border-white/[0.04]">
            <span class="text-[11px] font-semibold uppercase tracking-wider text-[#a1a1a6] block mb-1">Hiệu Suất Thực Tế</span>
            <p class="text-xs text-[#f5f5f7] font-medium leading-relaxed">${escapeHtml(p.roi || 'Tự động hóa hoàn toàn quy trình')}</p>
          </div>

          <!-- Highlights -->
          <div class="space-y-2 mb-6">
            ${p.highlights.slice(0, 3).map(h => `
              <div class="flex items-start gap-2.5 text-xs text-[#d2d2d7]">
                <span class="text-[#2997ff] mt-0.5 font-bold">›</span>
                <span class="leading-relaxed">${escapeHtml(h)}</span>
              </div>
            `).join('')}
          </div>

          <!-- Included Skills Tags -->
          <div class="mb-6">
            <div class="flex flex-wrap gap-1.5">
              ${p.skills.map(sk => `
                <span class="inline-block px-2.5 py-1 bg-black/40 text-[#a1a1a6] text-[11px] font-mono rounded-lg border border-white/[0.05]">
                  ${escapeHtml(sk)}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Price & CTA -->
        <div class="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-white tracking-tight font-mono">${formatVND(p.price)}</span>
              <span class="text-xs text-[#86868b] line-through font-mono">${formatVND(p.originalPrice)}</span>
            </div>
            <span class="text-[11px] font-medium text-[#2997ff]">Tiết kiệm ${p.discount}</span>
          </div>

          <div class="flex items-center gap-2.5">
            <button onclick="openDetailModal('project', '${p.id}')" class="px-4 py-2.5 rounded-full text-xs font-semibold text-[#f5f5f7] bg-white/10 hover:bg-white/20 transition">
              Chi tiết
            </button>
            <button onclick="buyNow('project', '${p.id}')" class="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] transition flex items-center gap-1.5 shadow-md">
              <i data-lucide="qr-code" class="w-3.5 h-3.5"></i> Mua QR
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// ==========================================================================
// RENDER: CATEGORIES
// ==========================================================================
function renderCategories() {
  const container = document.getElementById('categories-grid');
  if (!container) return;

  container.innerHTML = STATE.categories.map(c => {
    const count = STATE.skills.filter(s => s.category === c.slug).length;

    return `
      <div onclick="selectCategoryAndFilter('${c.slug}')" class="group cursor-pointer relative p-8 rounded-[28px] bg-[#161617] border border-white/[0.08] hover:border-white/[0.22] transition-all duration-300 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-6">
            <div class="w-12 h-12 rounded-2xl bg-white/10 p-3 flex items-center justify-center text-white">
              <i data-lucide="${c.icon || 'folder'}" class="w-6 h-6"></i>
            </div>
            <span class="text-[11px] font-semibold px-3 py-1 rounded-full bg-white/5 text-[#a1a1a6] border border-white/[0.06]">
              ${c.badge}
            </span>
          </div>

          <h3 class="text-xl font-bold text-white mb-2 leading-snug">
            ${escapeHtml(c.name)}
          </h3>

          <p class="text-xs text-[#86868b] leading-relaxed line-clamp-3 mb-6">
            ${escapeHtml(c.description)}
          </p>
        </div>

        <div class="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-[#2997ff]">
          <span>Khám Phá ${count > 0 ? count : 'Kho'} Kỹ Năng</span>
          <i data-lucide="chevron-right" class="w-4 h-4 transition-transform group-hover:translate-x-1"></i>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();
}

function selectCategoryAndFilter(categorySlug) {
  STATE.selectedCategory = categorySlug;
  playSound('pop');
  setTab('skills');
  const catSelect = document.getElementById('category-filter');
  if (catSelect) catSelect.value = categorySlug;
  filterSkills();
  renderSkills();
}

// ==========================================================================
// RENDER: INDIVIDUAL SKILLS
// ==========================================================================
function renderSkills() {
  const container = document.getElementById('skills-grid');
  const countEl = document.getElementById('skills-count-text');
  if (!container) return;

  if (countEl) {
    countEl.innerText = `${Math.min(STATE.displayedSkillsCount, STATE.filteredSkills.length)} / ${STATE.filteredSkills.length} kỹ năng`;
  }

  const skillsToShow = STATE.filteredSkills.slice(0, STATE.displayedSkillsCount);

  if (skillsToShow.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-20 text-center text-[#86868b]">
        <i data-lucide="search" class="w-10 h-10 mx-auto mb-3 text-[#515154]"></i>
        <p class="text-base font-medium">Không tìm thấy kỹ năng nào phù hợp.</p>
        <button onclick="resetSkillFilters()" class="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-full transition">Đặt lại</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  if (STATE.viewMode === 'table') {
    container.className = "col-span-full divide-y divide-white/[0.06] bg-[#161617] rounded-[24px] border border-white/[0.08] overflow-hidden";
    container.innerHTML = `
      <div class="grid grid-cols-12 gap-4 px-6 py-3.5 text-[11px] font-semibold text-[#86868b] uppercase tracking-wider bg-black/40">
        <div class="col-span-5">Tên Kỹ Năng</div>
        <div class="col-span-3">Chuyên Mục</div>
        <div class="col-span-2 text-right">Giá Bán</div>
        <div class="col-span-2 text-right">Tùy Chọn</div>
      </div>
      ${skillsToShow.map(s => `
        <div class="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-white/[0.03] transition">
          <div class="col-span-5">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-xs text-white hover:text-[#2997ff] cursor-pointer" onclick="openDetailModal('skill', '${s.id}')">${escapeHtml(s.name)}</span>
              ${s.isCurated ? '<span class="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#0071e3]/20 text-[#2997ff]">Verified</span>' : ''}
            </div>
            <p class="text-[11px] text-[#86868b] line-clamp-1 mt-0.5 font-light">${escapeHtml(s.description)}</p>
          </div>
          <div class="col-span-3">
            <span class="px-2.5 py-1 rounded-md text-[10px] font-medium bg-black/40 text-[#a1a1a6] uppercase">${escapeHtml(s.category)}</span>
          </div>
          <div class="col-span-2 text-right font-mono font-bold text-xs text-white">
            ${formatVND(s.price)}
          </div>
          <div class="col-span-2 flex items-center justify-end gap-2">
            <button onclick="openDetailModal('skill', '${s.id}')" class="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#f5f5f7]">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="addToCart('skill', '${s.id}')" class="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white">
              <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="buyNow('skill', '${s.id}')" class="px-3 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold">
              Mua
            </button>
          </div>
        </div>
      `).join('')}
    `;
  } else {
    container.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
    container.innerHTML = skillsToShow.map(s => {
      return `
        <div class="group flex flex-col justify-between rounded-[22px] bg-[#161617] border border-white/[0.08] hover:border-white/[0.22] p-5 transition-all duration-200 hover:-translate-y-1">
          <div>
            <div class="flex items-start justify-between gap-2 mb-3">
              <span class="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${s.isCurated ? 'bg-[#0071e3]/20 text-[#2997ff]' : 'bg-white/5 text-[#86868b]'}">
                ${escapeHtml(s.badge)}
              </span>
              <div class="flex items-center gap-1 text-[#e3a857] text-xs font-bold">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-[#e3a857]"></i>
                <span>${s.rating.toFixed(1)}</span>
              </div>
            </div>

            <h4 class="text-sm font-bold text-white group-hover:text-[#2997ff] transition-colors mb-2 font-mono break-all leading-snug">
              ${escapeHtml(s.name)}
            </h4>

            <p class="text-xs text-[#86868b] line-clamp-3 mb-4 leading-relaxed font-light">
              ${escapeHtml(s.description)}
            </p>

            <div class="flex flex-wrap gap-1 mb-4">
              ${(s.tags || []).slice(0, 3).map(t => `
                <span class="px-2 py-0.5 rounded-md bg-black/40 text-[#a1a1a6] text-[10px]">${escapeHtml(t)}</span>
              `).join('')}
            </div>
          </div>

          <div class="pt-4 border-t border-white/[0.06] flex items-center justify-between mt-1">
            <div>
              <span class="text-base font-bold text-white font-mono">${formatVND(s.price)}</span>
              <span class="text-[11px] text-[#86868b] line-through ml-1.5 font-mono">${formatVND(s.originalPrice)}</span>
            </div>

            <div class="flex items-center gap-1.5">
              <button onclick="openDetailModal('skill', '${s.id}')" title="Chi tiết" class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-[#f5f5f7] transition">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="addToCart('skill', '${s.id}')" title="Thêm giỏ" class="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition">
                <i data-lucide="shopping-bag" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="buyNow('skill', '${s.id}')" class="px-3.5 py-1.5 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold transition">
                Mua
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

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
  playSound('pop');
  STATE.displayedSkillsCount += 36;
  renderSkills();
}

function resetSkillFilters() {
  playSound('click');
  STATE.searchQuery = '';
  STATE.selectedCategory = 'all';
  STATE.curatedOnly = false;
  STATE.sortBy = 'popular';
  const searchInput = document.getElementById('global-search');
  if (searchInput) searchInput.value = '';
  const catSelect = document.getElementById('category-filter');
  if (catSelect) catSelect.value = 'all';
  const sortSelect = document.getElementById('sort-filter');
  if (sortSelect) sortSelect.value = 'popular';
  const curatedToggle = document.getElementById('curated-toggle');
  if (curatedToggle) curatedToggle.checked = false;
  filterSkills();
  renderSkills();
}

function clearSearch() {
  resetSkillFilters();
  renderProjects();
}

// ==========================================================================
// CART & DRAWER (APPLE STORE BAG STYLE)
// ==========================================================================
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
    showToast(`"${item.name}" đã có trong túi hàng!`, 'info');
    openCartDrawer();
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
  playSound('chime');
  showToast(`Đã thêm "${item.name}" vào túi hàng`, 'success');
  openCartDrawer();
}

function removeFromCart(index) {
  playSound('pop');
  STATE.cart.splice(index, 1);
  saveLocalStorage();
  renderCartDrawer();
}

function clearCart() {
  playSound('pop');
  STATE.cart = [];
  STATE.discountCode = '';
  STATE.discountPercent = 0;
  saveLocalStorage();
  renderCartDrawer();
}

function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  drawer?.classList.remove('translate-x-full');
  overlay?.classList.remove('hidden');
  lucide.createIcons();
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('cart-drawer-overlay');
  drawer?.classList.add('translate-x-full');
  overlay?.classList.add('hidden');
}

function applyCouponCode() {
  const input = document.getElementById('coupon-input');
  const code = (input?.value || '').trim().toUpperCase();
  if (code === 'ANTIGRAVITY') {
    STATE.discountPercent = 10;
    STATE.discountCode = code;
    playSound('chime');
    showToast('Áp dụng mã ANTIGRAVITY thành công (-10%)', 'success');
  } else if (code === 'VIP2026') {
    STATE.discountPercent = 15;
    STATE.discountCode = code;
    playSound('chime');
    showToast('Áp dụng mã VIP2026 thành công (-15%)', 'success');
  } else {
    playSound('pop');
    showToast('Mã ưu đãi không hợp lệ', 'error');
  }
  renderCartDrawer();
}

function renderCartDrawer() {
  const listEl = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('cart-subtotal-price');
  const discountRow = document.getElementById('cart-discount-row');
  const discountVal = document.getElementById('cart-discount-value');
  const totalEl = document.getElementById('cart-total-price');
  const emptyEl = document.getElementById('cart-empty-view');
  const contentEl = document.getElementById('cart-content-view');

  if (!listEl) return;

  if (STATE.cart.length === 0) {
    emptyEl?.classList.remove('hidden');
    contentEl?.classList.add('hidden');
    return;
  }

  emptyEl?.classList.add('hidden');
  contentEl?.classList.remove('hidden');

  const subtotal = STATE.cart.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = Math.round(subtotal * (STATE.discountPercent / 100));
  const finalTotal = subtotal - discountAmount;

  listEl.innerHTML = STATE.cart.map((c, idx) => {
    return `
      <div class="flex items-center justify-between p-4 rounded-2xl bg-[#1d1d1f] border border-white/[0.06]">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0">
            <i data-lucide="${c.type === 'project' ? 'folder-kanban' : 'file-code'}" class="w-4 h-4"></i>
          </div>
          <div class="min-w-0 pr-2">
            <span class="text-xs font-semibold text-white block truncate">${escapeHtml(c.name)}</span>
            <span class="text-[10px] text-[#86868b] uppercase tracking-wider">${c.type === 'project' ? 'Gói giải pháp' : 'Kỹ năng lẻ'}</span>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <span class="text-xs font-bold text-white font-mono">${formatVND(c.price)}</span>
          <button onclick="removeFromCart(${idx})" class="p-1.5 rounded-lg text-[#86868b] hover:text-red-400 transition" title="Xóa">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (subtotalEl) subtotalEl.innerText = formatVND(subtotal);
  if (totalEl) totalEl.innerText = formatVND(finalTotal);

  if (STATE.discountPercent > 0 && discountRow && discountVal) {
    discountRow.classList.remove('hidden');
    discountVal.innerText = `-${formatVND(discountAmount)} (${STATE.discountPercent}%)`;
  } else if (discountRow) {
    discountRow.classList.add('hidden');
  }

  lucide.createIcons();
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

// ==========================================================================
// MODALS
// ==========================================================================
function closeAllModals() {
  const modals = ['detail-modal', 'checkout-modal', 'bank-modal', 'success-modal'];
  modals.forEach(m => document.getElementById(m)?.classList.add('hidden'));
}

function openDetailModal(type, id) {
  playSound('pop');
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
      <div class="space-y-6">
        <p class="text-sm text-[#d2d2d7] leading-relaxed font-light">${escapeHtml(item.description)}</p>

        <!-- Metric Callout -->
        <div class="bg-[#1d1d1f] rounded-2xl p-4 border border-white/[0.06]">
          <span class="text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block mb-1">Hiệu Suất Thực Tế</span>
          <p class="text-xs text-[#f5f5f7] leading-relaxed">${escapeHtml(item.roi || 'Tự động hóa hoàn toàn quy trình')}</p>
        </div>

        <!-- Blueprint -->
        <div class="bg-black/40 p-5 rounded-2xl border border-white/[0.06]">
          <h4 class="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-3 flex items-center gap-2">
            <i data-lucide="layers" class="w-4 h-4 text-[#2997ff]"></i> Các Bước Thực Thi:
          </h4>
          <div class="space-y-2">
            ${(item.blueprint || item.highlights).map((step, idx) => `
              <div class="flex items-start gap-3 text-xs text-[#d2d2d7] bg-[#161617] p-3 rounded-xl border border-white/[0.04]">
                <span class="w-5 h-5 rounded-full bg-white/10 text-white font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">${idx + 1}</span>
                <span class="leading-relaxed">${escapeHtml(step)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Skills Included -->
        <div>
          <h4 class="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-3">Toàn Bộ ${item.skills.length} Kỹ Năng Đóng Gói:</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            ${item.skills.map(sk => `
              <div class="flex items-center gap-2.5 p-3 rounded-xl bg-black/40 border border-white/[0.06] text-xs text-[#d2d2d7]">
                <i data-lucide="file-code" class="w-4 h-4 text-[#2997ff] shrink-0"></i>
                <span class="font-mono font-medium">${escapeHtml(sk)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } else {
    detailsHtml = `
      <div class="space-y-6">
        <p class="text-sm text-[#d2d2d7] leading-relaxed font-light">${escapeHtml(item.description)}</p>

        <div class="bg-[#1d1d1f] p-5 rounded-2xl border border-white/[0.06] space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <span class="text-[#86868b] block">Mã Kỹ Năng:</span>
              <span class="text-white font-mono font-bold">${escapeHtml(item.id)}</span>
            </div>
            <div>
              <span class="text-[#86868b] block">Chuyên Mục:</span>
              <span class="text-white uppercase font-semibold">${escapeHtml(item.category)}</span>
            </div>
          </div>
        </div>

        <div class="bg-black/40 p-5 rounded-2xl border border-white/[0.06]">
          <h4 class="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-2">Lệnh kích hoạt trong Antigravity:</h4>
          <div class="bg-[#161617] p-3 rounded-xl font-mono text-xs text-[#2997ff] flex items-center justify-between border border-white/[0.06]">
            <span>/skill ${escapeHtml(item.id)}</span>
            <button onclick="copyToClipboard('/skill ${escapeHtml(item.id)}')" class="p-1 rounded text-[#86868b] hover:text-white" title="Sao chép">
              <i data-lucide="copy" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  if (bodyEl) bodyEl.innerHTML = detailsHtml;

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

// ==========================================================================
// VIETQR CHECKOUT FLOW (APPLE PAY STYLE)
// ==========================================================================
function buyNow(type, id) {
  let item = null;
  if (type === 'project') {
    item = STATE.projects.find(p => p.id === id);
  } else {
    item = STATE.skills.find(s => s.id === id);
  }

  if (!item) return;

  const orderId = 'SK' + Math.floor(10000 + Math.random() * 90000);
  STATE.currentOrder = {
    orderId,
    items: [{
      type,
      id: item.id,
      name: item.name,
      price: item.price
    }],
    subtotal: item.price,
    discountAmount: 0,
    totalAmount: item.price,
    customerName: '',
    customerEmail: '',
    createdAt: new Date().toISOString()
  };

  openCheckoutModal();
}

function checkoutCart() {
  if (STATE.cart.length === 0) return;

  const subtotal = STATE.cart.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = Math.round(subtotal * (STATE.discountPercent / 100));
  const totalAmount = subtotal - discountAmount;
  const orderId = 'SK' + Math.floor(10000 + Math.random() * 90000);

  STATE.currentOrder = {
    orderId,
    items: [...STATE.cart],
    subtotal,
    discountAmount,
    totalAmount,
    customerName: '',
    customerEmail: '',
    createdAt: new Date().toISOString()
  };

  closeCartDrawer();
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

  if (orderIdEl) orderIdEl.innerText = `#${order.orderId}`;
  if (amountEl) amountEl.innerText = formatVND(order.totalAmount);

  if (summaryEl) {
    summaryEl.innerHTML = order.items.map(it => `
      <div class="flex items-center justify-between text-xs py-1.5 border-b border-white/[0.04] last:border-0">
        <span class="text-[#d2d2d7] font-medium truncate pr-2">${escapeHtml(it.name)}</span>
        <span class="text-white font-mono font-bold shrink-0">${formatVND(it.price)}</span>
      </div>
    `).join('');
  }

  renderCheckoutBankSelector();
  updateVietQRDisplay();
  startCountdown(15 * 60);

  modal?.classList.remove('hidden');
  lucide.createIcons();
}

function renderCheckoutBankSelector() {
  const container = document.getElementById('checkout-bank-selector');
  if (!container) return;

  container.innerHTML = SUPPORTED_BANKS.map(b => {
    const isSelected = b.id === STATE.bankConfig.bankId;
    return `
      <button 
        type="button"
        onclick="switchCheckoutBank('${b.id}')"
        class="flex items-center gap-2 p-2.5 rounded-2xl border transition-all text-left ${isSelected ? 'bg-white/10 border-white text-white shadow-sm' : 'bg-black/30 border-white/[0.06] text-[#86868b] hover:text-white'}"
      >
        <img src="${b.logo}" alt="${b.name}" class="w-6 h-6 object-contain rounded-md bg-white p-0.5 shrink-0" onerror="this.style.display='none'">
        <span class="text-xs font-semibold truncate">${b.id}</span>
      </button>
    `;
  }).join('');
}

function switchCheckoutBank(bankId) {
  const bank = SUPPORTED_BANKS.find(b => b.id === bankId);
  if (!bank) return;
  playSound('click');
  STATE.bankConfig.bankId = bank.id;
  STATE.bankConfig.bankName = bank.name;
  saveLocalStorage();
  renderCheckoutBankSelector();
  updateVietQRDisplay();
}

function updateVietQRDisplay() {
  const order = STATE.currentOrder;
  if (!order) return;

  const bankNameEl = document.getElementById('qr-bank-name');
  const accNoEl = document.getElementById('qr-account-no');
  const accNameEl = document.getElementById('qr-account-name');
  const memoEl = document.getElementById('qr-transfer-memo');
  const qrImgEl = document.getElementById('vietqr-image');

  const transferMemo = `${order.orderId}`;

  if (bankNameEl) bankNameEl.innerText = STATE.bankConfig.bankName;
  if (accNoEl) accNoEl.innerText = STATE.bankConfig.accountNo;
  if (accNameEl) accNameEl.innerText = STATE.bankConfig.accountName;
  if (memoEl) memoEl.innerText = transferMemo;

  const qrUrl = `https://img.vietqr.io/image/${STATE.bankConfig.bankId}-${STATE.bankConfig.accountNo}-${STATE.bankConfig.template}.png?amount=${order.totalAmount}&addInfo=${encodeURIComponent(transferMemo)}&accountName=${encodeURIComponent(STATE.bankConfig.accountName)}`;

  if (qrImgEl) {
    qrImgEl.src = qrUrl;
  }
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
      countdownEl.innerText = "00:00 (Hết hạn)";
    }
    remaining--;
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

// ==========================================================================
// CONFIRM PAYMENT & CELEBRATION
// ==========================================================================
function confirmPaymentDone() {
  const order = STATE.currentOrder;
  if (!order) return;

  const nameInput = document.getElementById('checkout-customer-name');
  const emailInput = document.getElementById('checkout-customer-email');

  order.customerName = nameInput?.value.trim() || 'Quý khách';
  order.customerEmail = emailInput?.value.trim() || 'khachhang@gmail.com';

  STATE.cart = [];
  STATE.discountCode = '';
  STATE.discountPercent = 0;
  saveLocalStorage();

  closeAllModals();

  playSound('success');
  triggerConfetti();

  const successModal = document.getElementById('success-modal');
  const successOrderIdEl = document.getElementById('success-order-id');
  const successEmailEl = document.getElementById('success-customer-email');
  const licenseKeyEl = document.getElementById('success-license-key');

  if (successOrderIdEl) successOrderIdEl.innerText = `#${order.orderId}`;
  if (successEmailEl) successEmailEl.innerText = order.customerEmail;
  if (licenseKeyEl) {
    licenseKeyEl.innerText = `SKV-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}-2026`;
  }

  successModal?.classList.remove('hidden');
  lucide.createIcons();
}

function triggerConfetti() {
  if (typeof confetti === 'function') {
    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => {
      confetti({ particleCount: 40, angle: 60, spread: 50, origin: { x: 0 } });
      confetti({ particleCount: 40, angle: 120, spread: 50, origin: { x: 1 } });
    }, 200);
  }
}

// ==========================================================================
// SELLER ADMIN SETTINGS
// ==========================================================================
function openBankModal() {
  closeAllModals();
  const modal = document.getElementById('bank-modal');
  const bankSelect = document.getElementById('cfg-bank-id');
  const accNoInput = document.getElementById('cfg-account-no');
  const accNameInput = document.getElementById('cfg-account-name');

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
  playSound('chime');
  showToast('Đã lưu cấu hình tài khoản ngân hàng', 'success');
}

// ==========================================================================
// TOAST & CLIPBOARD
// ==========================================================================
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    playSound('pop');
    showToast(`Đã sao chép: "${text}"`, 'success');
  }).catch(() => {
    showToast('Không thể sao chép tự động', 'error');
  });
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  const colors = {
    success: 'bg-[#161617]/95 border-emerald-500/40 text-[#f5f5f7]',
    info: 'bg-[#161617]/95 border-white/20 text-[#f5f5f7]',
    error: 'bg-[#161617]/95 border-red-500/40 text-[#f5f5f7]'
  };

  toast.className = `fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all duration-300 transform translate-y-8 opacity-0 ${colors[type] || colors.info}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-4 h-4 ${type === 'success' ? 'text-emerald-400' : 'text-[#2997ff]'} shrink-0"></i>
    <span class="text-xs font-medium leading-snug">${escapeHtml(message)}</span>
  `;

  document.body.appendChild(toast);
  lucide.createIcons();

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-8', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

function downloadSkillPackage() {
  playSound('chime');
  showToast('Đang tạo liên kết tải xuống...', 'info');
  setTimeout(() => {
    alert("KÍCH HOẠT THÀNH CÔNG:\n\n1. Đường dẫn thư mục skills trên máy:\n   J:\\Other computers\\My Computer (2)\\MTDES23\\CLAUDE SKILL\\Skills_Antigravity\\skills\\\n\n2. Đã tự động liên kết vào Antigravity:\n   C:\\Users\\NCPC\\.gemini\\config\\skills\\\n\nBạn có thể mở Antigravity IDE và gõ ngay câu lệnh /skill để thực thi!");
  }, 300);
}
