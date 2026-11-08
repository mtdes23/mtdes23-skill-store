// ==========================================================================
// SKILLVAULT AI - Professional Application Engine
// Incorporating principles from Emil Kowalski, Apple Design, & Audio Synthesis
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

// Official VietQR Supported Banks with Real Logos
const SUPPORTED_BANKS = [
  { id: 'MB', name: 'MB Bank (Quân Đội)', bin: '970422', logo: 'https://api.vietqr.io/img/MB.png' },
  { id: 'VCB', name: 'Vietcombank', bin: '970436', logo: 'https://api.vietqr.io/img/VCB.png' },
  { id: 'TCB', name: 'Techcombank', bin: '970407', logo: 'https://api.vietqr.io/img/TCB.png' },
  { id: 'ACB', name: 'ACB (Á Châu)', bin: '970416', logo: 'https://api.vietqr.io/img/ACB.png' },
  { id: 'VPB', name: 'VPBank', bin: '970432', logo: 'https://api.vietqr.io/img/VPB.png' },
  { id: 'TPB', name: 'TPBank', bin: '970458', logo: 'https://api.vietqr.io/img/TPB.png' },
  { id: 'BIDV', name: 'BIDV', bin: '970418', logo: 'https://api.vietqr.io/img/BIDV.png' },
  { id: 'ICB', name: 'VietinBank', bin: '970415', logo: 'https://api.vietqr.io/img/ICB.png' }
];

// Interactive Terminal Presets
const TERMINAL_PRESETS = {
  xspeedvn: {
    command: "/skill xspeedvn-supercar-video --model F40 --audio vieneu-48k",
    outputs: [
      "[1/5] Khởi tạo kịch bản 6 Hồi F40 & R34 Formula...",
      "[2/5] Thiết lập Safe-zone 9:16 (Frosted Glass Active-Word y=1510)...",
      "[3/5] Khớp giọng đọc VieNeu-TTS v3 Turbo với BGM FFT ducking...",
      "[4/5] Render Technical Blueprint Grid & Hiệu ứng khói xé gió...",
      "[5/5] Hoàn tất mastering -14 LUFS / -1.5 dBTP! Video sẵn sàng đăng TikTok."
    ]
  },
  vieneu: {
    command: "/skill vieneu-tts --text 'Xin chào, tôi là AI lồng tiếng tiếng Việt' --voice 'Hà Nội'",
    outputs: [
      "[1/4] Khởi động VieNeu-TTS v3 Turbo (Codec 48 kHz Ultra-HD)...",
      "[2/4] Phân tích âm vị tiếng Việt và gán trọng âm cảm xúc...",
      "[3/4] Streaming chunk audio đầu tiên sau 118 ms...",
      "[4/4] Xuất tệp WAV 48kHz không nén + SRT timing word-by-word."
    ]
  },
  mrtkeyword: {
    command: "/mrtkeyword --input interview.mp4 --style 'kinetic-punch' --sfx true",
    outputs: [
      "[1/4] Quét giọng nói & bóc transcript bằng Faster-Whisper...",
      "[2/4] Tự động chọn 169 keyword (text-behind, chart-counter, chat-pop)...",
      "[3/4] Chèn SFX dồn vào 20 giây Hook và tránh che mặt diễn giả...",
      "[4/4] Xuất video hoàn chỉnh qua CapCut / Remotion Engine!"
    ]
  },
  agency: {
    command: "/agent-squad --plan 'Xây dựng SaaS AI Video trong 7 ngày' --squad 'engineering'",
    outputs: [
      "[1/4] Triệu tập 66 Frontend Wizards, Backend Architects & QA Lead...",
      "[2/4] Khởi tạo khung điều phối NEXUS 7-Phase Lifecycle...",
      "[3/4] Reality Checker quét lỗi ảo tưởng nghiệm thu độc lập...",
      "[4/4] Bàn giao toàn bộ kiến trúc mã nguồn chuẩn Clean Architecture."
    ]
  }
};

// ==========================================
// Web Audio API Synthesizer (Zero Latency)
// ==========================================
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
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } 
    else if (type === 'pop') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    }
    else if (type === 'chime') {
      // Pleasant dual chord for add-to-cart
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.04);
        gain.gain.setValueAtTime(0.06, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.3);
      });
    }
    else if (type === 'success') {
      // Fanfare chord on payment complete
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        gain.gain.setValueAtTime(0.1, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.5);
      });
    }
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
}

// Audio Demo Simulation (for VieNeu-TTS and SFX Audition)
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

  // Synthesize realistic audio tone
  const ctx = getAudioContext();
  if (ctx) {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.linearRampToValueAtTime(554.37, now + 0.3);
    osc.frequency.linearRampToValueAtTime(659.25, now + 0.6);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1.2);
  }

  // Waveform animation
  if (wave) {
    wave.classList.add('animate-pulse');
    clearTimeout(demoAudioTimer);
    demoAudioTimer = setTimeout(() => {
      wave.classList.remove('animate-pulse');
    }, 2000);
  }
}

// ==========================================
// Formatting Utilities
// ==========================================
function formatVND(num) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// ==========================================
// Initialization
// ==========================================
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
  showToast(STATE.soundEnabled ? 'Đã bật hiệu ứng âm thanh' : 'Đã tắt âm thanh', 'info');
}

function updateSoundIcon() {
  const btn = document.getElementById('sound-toggle-btn');
  if (!btn) return;
  if (STATE.soundEnabled) {
    btn.innerHTML = `<i data-lucide="volume-2" class="w-4 h-4 text-amber-400"></i>`;
  } else {
    btn.innerHTML = `<i data-lucide="volume-x" class="w-4 h-4 text-slate-500"></i>`;
  }
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

// ==========================================
// Event Listeners & Keyboard Shortcuts
// ==========================================
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

  // Close Cart Drawer
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
        b.className = "px-3 py-1 text-xs font-semibold rounded-lg text-slate-400 hover:text-white transition";
      });
      btn.className = "px-3 py-1 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30";
      initTerminalSimulation(preset);
    });
  });
}

function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Cmd+K or Ctrl+K for search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const input = document.getElementById('global-search');
      input?.focus();
      input?.select();
      playSound('pop');
    }
    // Escape to close modals
    if (e.key === 'Escape') {
      closeAllModals();
      closeCartDrawer();
    }
  });
}

// ==========================================
// Interactive Terminal Typing Simulator
// ==========================================
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
      typingTimeout = setTimeout(typeChar, 25);
    } else {
      // Print outputs line by line
      let lineIdx = 0;
      function printLine() {
        if (lineIdx < preset.outputs.length) {
          const div = document.createElement('div');
          div.className = "text-xs font-mono flex items-start gap-2 py-0.5 text-slate-300 opacity-0 translate-y-1 transition duration-200";
          div.innerHTML = `<span class="text-emerald-400 font-bold">›</span><span>${escapeHtml(preset.outputs[lineIdx])}</span>`;
          bodyEl.appendChild(div);
          requestAnimationFrame(() => {
            div.classList.remove('opacity-0', 'translate-y-1');
          });
          lineIdx++;
          typingTimeout = setTimeout(printLine, 120);
        }
      }
      typingTimeout = setTimeout(printLine, 200);
    }
  }
  typeChar();
}

// ==========================================
// Navigation & Filtering
// ==========================================
function setTab(tab) {
  STATE.activeTab = tab;
  
  // Update desktop tabs
  document.querySelectorAll('[data-nav-tab]').forEach(btn => {
    const isTarget = btn.getAttribute('data-nav-tab') === tab;
    if (isTarget) {
      btn.className = "flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25";
    } else {
      btn.className = "flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 text-slate-400 hover:text-white hover:bg-slate-800/60";
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

  // Apply Sorting
  if (STATE.sortBy === 'price-asc') {
    STATE.filteredSkills.sort((a, b) => a.price - b.price);
  } else if (STATE.sortBy === 'price-desc') {
    STATE.filteredSkills.sort((a, b) => b.price - a.price);
  } else if (STATE.sortBy === 'rating') {
    STATE.filteredSkills.sort((a, b) => b.rating - a.rating);
  } else {
    // Popularity default
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
      gridBtn.className = "p-2 rounded-lg bg-slate-800 text-amber-400 border border-slate-700";
      tableBtn.className = "p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800";
    } else {
      tableBtn.className = "p-2 rounded-lg bg-slate-800 text-amber-400 border border-slate-700";
      gridBtn.className = "p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-slate-800";
    }
  }
  renderSkills();
}

// ==========================================
// RENDER: PROJECTS (DỰ ÁN TURNKEY WORKFLOWS)
// ==========================================
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
        <p class="text-base font-semibold">Không tìm thấy gói dự án phù hợp với "${escapeHtml(STATE.searchQuery)}".</p>
        <button onclick="clearSearch()" class="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl transition">Xóa tìm kiếm</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  container.innerHTML = projectsToRender.map(p => {
    return `
      <div class="group relative flex flex-col justify-between rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 p-6 sm:p-7 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1.5">
        
        <!-- Glowing Top Badge -->
        <div class="absolute -top-3.5 right-6">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md">
            <i data-lucide="sparkle" class="w-3.5 h-3.5"></i> ${escapeHtml(p.badge)}
          </span>
        </div>

        <div>
          <!-- Header info -->
          <div class="flex items-center gap-3.5 mb-4">
            <div class="w-13 h-13 rounded-2xl bg-gradient-to-br ${p.color} p-3 flex items-center justify-center text-white shadow-xl">
              <i data-lucide="${p.icon || 'folder-kanban'}" class="w-6 h-6"></i>
            </div>
            <div>
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">${escapeHtml(p.author || 'Antigravity Verified')}</span>
              <div class="flex items-center gap-1 text-amber-400 text-xs font-bold mt-0.5">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i> ${p.rating.toFixed(1)}
                <span class="text-slate-500 font-medium">(${p.reviewsCount} review)</span>
              </div>
            </div>
          </div>

          <!-- Title & Summary -->
          <h3 class="text-xl font-bold text-white group-hover:text-amber-400 transition-colors duration-200 mb-2 leading-snug">
            ${escapeHtml(p.name)}
          </h3>

          <p class="text-xs sm:text-sm text-slate-300 line-clamp-3 mb-4 leading-relaxed font-light">
            ${escapeHtml(p.summary)}
          </p>

          <!-- ROI Box -->
          <div class="bg-amber-500/10 border border-amber-500/20 p-3 rounded-2xl mb-4 text-xs text-amber-300 flex items-start gap-2">
            <i data-lucide="trending-up" class="w-4 h-4 text-amber-400 shrink-0 mt-0.5"></i>
            <div>
              <span class="font-bold text-amber-400">Cam Kết ROI:</span>
              <p class="text-[11px] text-slate-300 mt-0.5 leading-snug">${escapeHtml(p.roi || 'Tự động hóa hoàn toàn quy trình')}</p>
            </div>
          </div>

          <!-- Blueprint / Highlights -->
          <div class="space-y-1.5 mb-5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80">
            <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Đặc Quyền Kỹ Thuật:</span>
              <span class="text-amber-400 font-mono">${p.skills.length} Skills</span>
            </p>
            ${p.highlights.slice(0, 3).map(h => `
              <div class="flex items-start gap-2 text-xs text-slate-300">
                <span class="text-emerald-400 mt-0.5 font-bold">✓</span>
                <span class="leading-snug">${escapeHtml(h)}</span>
              </div>
            `).join('')}
          </div>

          <!-- Included Skills Tags -->
          <div class="mb-4">
            <span class="text-[11px] text-slate-400 block mb-2 font-semibold">Bộ kỹ năng cốt lõi đính kèm:</span>
            <div class="flex flex-wrap gap-1.5">
              ${p.skills.map(sk => `
                <span class="inline-block px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[11px] font-mono rounded-lg border border-slate-700/60">
                  ${escapeHtml(sk)}
                </span>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Footer / Pricing & Actions -->
        <div class="pt-5 border-t border-slate-800/80 mt-2">
          <div class="flex items-baseline justify-between mb-4">
            <div>
              <span class="text-2xl font-black text-white tracking-tight font-mono">${formatVND(p.price)}</span>
              <span class="text-xs text-slate-500 line-through ml-2 font-mono">${formatVND(p.originalPrice)}</span>
            </div>
            <span class="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-1 rounded-lg">
              -${p.discount}
            </span>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <button onclick="openDetailModal('project', '${p.id}')" class="px-4 py-3 rounded-xl text-xs font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition flex items-center justify-center gap-1.5 border border-slate-700">
              <i data-lucide="info" class="w-4 h-4"></i> Chi Tiết
            </button>
            <button onclick="buyNow('project', '${p.id}')" class="px-4 py-3 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20">
              <i data-lucide="qr-code" class="w-4 h-4"></i> Mua QR
            </button>
          </div>
        </div>

      </div>
    `;
  }).join('');

  lucide.createIcons();
}

// ==========================================
// RENDER: CATEGORIES (THEO TỪNG MỤC)
// ==========================================
function renderCategories() {
  const container = document.getElementById('categories-grid');
  if (!container) return;

  container.innerHTML = STATE.categories.map(c => {
    const count = STATE.skills.filter(s => s.category === c.slug).length;

    return `
      <div onclick="selectCategoryAndFilter('${c.slug}')" class="group cursor-pointer relative p-7 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-5">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} p-3.5 flex items-center justify-center text-white shadow-xl">
              <i data-lucide="${c.icon || 'folder'}" class="w-7 h-7"></i>
            </div>
            <span class="text-xs font-bold px-3 py-1 rounded-full bg-slate-800 text-amber-400 border border-slate-700 font-mono">
              ${c.badge}
            </span>
          </div>

          <h3 class="text-xl font-bold text-white group-hover:text-amber-400 transition-colors duration-200 mb-2">
            ${escapeHtml(c.name)}
          </h3>

          <p class="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-6">
            ${escapeHtml(c.description)}
          </p>
        </div>

        <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-amber-400">
          <span>Khám Phá ${count > 0 ? count : 'Kho'} Kỹ Năng</span>
          <i data-lucide="arrow-right" class="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1.5"></i>
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

// ==========================================
// RENDER: INDIVIDUAL SKILLS (MASTER CATALOG)
// ==========================================
function renderSkills() {
  const container = document.getElementById('skills-grid');
  const countEl = document.getElementById('skills-count-text');
  if (!container) return;

  if (countEl) {
    countEl.innerText = `Hiển thị ${Math.min(STATE.displayedSkillsCount, STATE.filteredSkills.length)} / ${STATE.filteredSkills.length} kỹ năng`;
  }

  const skillsToShow = STATE.filteredSkills.slice(0, STATE.displayedSkillsCount);

  if (skillsToShow.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center text-slate-400">
        <i data-lucide="folder-search" class="w-12 h-12 mx-auto mb-3 text-slate-600"></i>
        <p class="text-base font-semibold">Không tìm thấy kỹ năng nào phù hợp với bộ lọc.</p>
        <button onclick="resetSkillFilters()" class="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold rounded-xl transition">Đặt lại bộ lọc</button>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  if (STATE.viewMode === 'table') {
    // COMPACT LIST VIEW
    container.className = "col-span-full divide-y divide-slate-800 bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden";
    container.innerHTML = `
      <div class="grid grid-cols-12 gap-3 px-5 py-3 text-[11px] font-bold text-slate-400 uppercase bg-slate-950/80">
        <div class="col-span-5">Tên Kỹ Năng (ID)</div>
        <div class="col-span-3">Chuyên Mục & Tags</div>
        <div class="col-span-2 text-right">Giá Bán</div>
        <div class="col-span-2 text-right">Thao Tác</div>
      </div>
      ${skillsToShow.map(s => `
        <div class="grid grid-cols-12 gap-3 px-5 py-3.5 items-center hover:bg-slate-800/40 transition">
          <div class="col-span-5">
            <div class="flex items-center gap-2">
              <span class="font-mono font-bold text-xs text-white hover:text-amber-400 cursor-pointer" onclick="openDetailModal('skill', '${s.id}')">${escapeHtml(s.name)}</span>
              ${s.isCurated ? '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300">Hot</span>' : ''}
            </div>
            <p class="text-[11px] text-slate-400 line-clamp-1 mt-0.5">${escapeHtml(s.description)}</p>
          </div>
          <div class="col-span-3 flex items-center gap-1.5">
            <span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 uppercase">${escapeHtml(s.category)}</span>
          </div>
          <div class="col-span-2 text-right font-mono font-bold text-xs text-amber-400">
            ${formatVND(s.price)}
          </div>
          <div class="col-span-2 flex items-center justify-end gap-1.5">
            <button onclick="openDetailModal('skill', '${s.id}')" title="Xem chi tiết" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="addToCart('skill', '${s.id}')" title="Thêm giỏ" class="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400">
              <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="buyNow('skill', '${s.id}')" class="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold">
              Mua
            </button>
          </div>
        </div>
      `).join('')}
    `;
  } else {
    // GRID CARDS VIEW
    container.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";
    container.innerHTML = skillsToShow.map(s => {
      return `
        <div class="group flex flex-col justify-between rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 p-5 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1">
          <div>
            <div class="flex items-start justify-between gap-2 mb-2.5">
              <span class="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${s.isCurated ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-slate-800 text-slate-400'}">
                ${escapeHtml(s.badge)}
              </span>
              <div class="flex items-center gap-1 text-amber-400 text-xs font-bold">
                <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
                <span>${s.rating.toFixed(1)}</span>
              </div>
            </div>

            <h4 class="text-sm sm:text-base font-bold text-white group-hover:text-amber-400 transition-colors duration-200 mb-1.5 font-mono break-all leading-snug">
              ${escapeHtml(s.name)}
            </h4>

            <p class="text-xs text-slate-400 line-clamp-3 mb-3.5 leading-relaxed font-light">
              ${escapeHtml(s.description)}
            </p>

            <div class="flex flex-wrap gap-1.5 mb-4">
              ${(s.tags || []).slice(0, 3).map(t => `
                <span class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium">${escapeHtml(t)}</span>
              `).join('')}
            </div>
          </div>

          <div class="pt-3.5 border-t border-slate-800/80 flex items-center justify-between mt-1">
            <div>
              <span class="text-base font-black text-white font-mono">${formatVND(s.price)}</span>
              <span class="text-[11px] text-slate-500 line-through ml-1.5 font-mono">${formatVND(s.originalPrice)}</span>
            </div>

            <div class="flex items-center gap-1.5">
              <button onclick="openDetailModal('skill', '${s.id}')" title="Xem chi tiết" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="addToCart('skill', '${s.id}')" title="Thêm giỏ" class="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition border border-slate-700">
                <i data-lucide="shopping-cart" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="buyNow('skill', '${s.id}')" class="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-1 shadow-md shadow-amber-500/20">
                <i data-lucide="qr-code" class="w-3.5 h-3.5"></i> Mua
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // Load More Button Visibility
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

// ==========================================
// CART & DRAWER MANAGEMENT
// ==========================================
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
    showToast(`Đã có "${item.name}" trong giỏ hàng!`, 'info');
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
  showToast(`Đã thêm "${item.name}" vào giỏ hàng!`, 'success');
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
    showToast('Áp dụng mã ANTIGRAVITY thành công! Giảm 10%', 'success');
  } else if (code === 'VIP2026') {
    STATE.discountPercent = 15;
    STATE.discountCode = code;
    playSound('chime');
    showToast('Áp dụng mã VIP2026 thành công! Giảm 15%', 'success');
  } else {
    playSound('pop');
    showToast('Mã giảm giá không hợp lệ!', 'error');
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
      <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <i data-lucide="${c.type === 'project' ? 'folder-kanban' : 'file-code'}" class="w-4 h-4"></i>
          </div>
          <div class="min-w-0 pr-2">
            <span class="text-xs font-bold text-white block truncate">${escapeHtml(c.name)}</span>
            <span class="text-[10px] text-slate-400 uppercase tracking-wider">${c.type === 'project' ? 'Gói dự án' : 'Kỹ năng lẻ'}</span>
          </div>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <span class="text-xs font-black text-amber-400 font-mono">${formatVND(c.price)}</span>
          <button onclick="removeFromCart(${idx})" class="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition" title="Xóa món">
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

// ==========================================
// MODALS MANAGEMENT
// ==========================================
function closeAllModals() {
  const modals = ['detail-modal', 'checkout-modal', 'bank-modal', 'success-modal'];
  modals.forEach(m => document.getElementById(m)?.classList.add('hidden'));
}

// ==========================================
// DETAIL MODAL (RICH TABS VIEW)
// ==========================================
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
        <p class="text-sm text-slate-300 leading-relaxed font-light">${escapeHtml(item.description)}</p>

        <!-- ROI Card -->
        <div class="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 p-4 rounded-2xl">
          <div class="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <i data-lucide="trending-up" class="w-4 h-4"></i> Giá Trị Thực Tế & ROI:
          </div>
          <p class="text-xs text-slate-200 leading-relaxed">${escapeHtml(item.roi || 'Tự động hóa hoàn toàn quy trình')}</p>
        </div>

        <!-- Blueprint Steps -->
        <div class="bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <h4 class="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3.5 flex items-center gap-2">
            <i data-lucide="layers" class="w-4 h-4"></i> Kịch Bản / Dây Chuyền Thực Thi:
          </h4>
          <div class="space-y-2">
            ${(item.blueprint || item.highlights).map((step, idx) => `
              <div class="flex items-start gap-3 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60">
                <span class="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 font-mono font-bold flex items-center justify-center shrink-0 text-[10px]">${idx + 1}</span>
                <span class="leading-relaxed">${escapeHtml(step)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Included Skills -->
        <div>
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Toàn bộ ${item.skills.length} Kỹ Năng Đóng Gói:</h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            ${item.skills.map(sk => `
              <div class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300">
                <i data-lucide="file-code" class="w-4 h-4 text-amber-400 shrink-0"></i>
                <span class="font-mono font-semibold">${escapeHtml(sk)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Tools Required -->
        <div class="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-300">
          <span class="text-slate-500 font-semibold block mb-1.5">Môi trường thực thi:</span>
          <div class="flex flex-wrap gap-2">
            ${(item.toolsNeeded || ['Python 3.10+', 'FFmpeg', 'Antigravity']).map(t => `
              <span class="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 font-mono text-[11px]">${escapeHtml(t)}</span>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } else {
    detailsHtml = `
      <div class="space-y-6">
        <p class="text-sm text-slate-300 leading-relaxed font-light">${escapeHtml(item.description)}</p>

        <!-- Skill Specs -->
        <div class="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <h4 class="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <i data-lucide="terminal" class="w-4 h-4"></i> Thông Số Kỹ Thuật Skill:
          </h4>
          <div class="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span class="text-slate-500 block">ID Kỹ Năng:</span>
              <span class="text-white font-mono font-bold">${escapeHtml(item.id)}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Chuyên Mục:</span>
              <span class="text-slate-200 uppercase font-semibold">${escapeHtml(item.category)}</span>
            </div>
            <div>
              <span class="text-slate-500 block">Tiêu Chuẩn:</span>
              <span class="text-emerald-400 font-semibold">Verified Safe / Clean Code</span>
            </div>
            <div>
              <span class="text-slate-500 block">Nền Tảng Tương Thích:</span>
              <span class="text-slate-200">Antigravity / Claude Code / Codex</span>
            </div>
          </div>
        </div>

        <!-- Trigger Command -->
        <div class="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">Lệnh kích hoạt trong Antigravity:</h4>
          <div class="bg-slate-900 p-3 rounded-xl font-mono text-xs text-amber-300 flex items-center justify-between border border-slate-800">
            <span>/skill ${escapeHtml(item.id)}</span>
            <button onclick="copyToClipboard('/skill ${escapeHtml(item.id)}')" class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition" title="Sao chép">
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

// ==========================================
// BUY NOW & VIETQR CHECKOUT FLOW
// ==========================================
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

  // Render items
  if (summaryEl) {
    summaryEl.innerHTML = order.items.map(it => `
      <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-800/60 last:border-0">
        <span class="text-slate-300 font-medium truncate pr-2">${escapeHtml(it.name)}</span>
        <span class="text-amber-400 font-mono font-bold shrink-0">${formatVND(it.price)}</span>
      </div>
    `).join('');
  }

  // Populate dynamic bank switcher in checkout
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
        class="flex items-center gap-2 p-2 rounded-xl border transition-all text-left ${isSelected ? 'bg-amber-500/10 border-amber-500/60 text-white shadow-sm' : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'}"
      >
        <img src="${b.logo}" alt="${b.name}" class="w-6 h-6 object-contain rounded bg-white p-0.5 shrink-0" onerror="this.style.display='none'">
        <span class="text-[11px] font-bold truncate">${b.id}</span>
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

  // Real-time VietQR Dynamic Image
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

// ==========================================
// CONFIRM PAYMENT DONE & CELEBRATION
// ==========================================
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

  // Play celebration sounds & confetti
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
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 250);
  }
}

// ==========================================
// SELLER ADMIN SETTINGS
// ==========================================
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
  showToast('Đã lưu cấu hình tài khoản ngân hàng thành công!', 'success');
}

// ==========================================
// TOAST NOTIFICATION & CLIPBOARD
// ==========================================
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    playSound('pop');
    showToast(`Đã sao chép: "${text}"`, 'success');
  }).catch(() => {
    showToast('Không thể sao chép tự động!', 'error');
  });
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  const colors = {
    success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300 shadow-emerald-950/50',
    info: 'bg-slate-900/95 border-amber-500/50 text-amber-300 shadow-amber-950/50',
    error: 'bg-red-950/90 border-red-500/50 text-red-300 shadow-red-950/50'
  };

  toast.className = `fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-2xl backdrop-blur-xl transition-all duration-300 transform translate-y-10 opacity-0 ${colors[type] || colors.info}`;
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-4 h-4 shrink-0"></i>
    <span class="text-xs font-bold leading-snug">${escapeHtml(message)}</span>
  `;

  document.body.appendChild(toast);
  lucide.createIcons();

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-4');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function downloadSkillPackage() {
  playSound('chime');
  showToast('Đang tạo gói cài đặt và link liên kết Antigravity...', 'info');
  setTimeout(() => {
    alert("KÍCH HOẠT THÀNH CÔNG:\n\n1. Đường dẫn thư mục skills trên máy:\n   J:\\Other computers\\My Computer (2)\\MTDES23\\CLAUDE SKILL\\Skills_Antigravity\\skills\\\n\n2. Đã tự động liên kết vào Antigravity:\n   C:\\Users\\NCPC\\.gemini\\config\\skills\\\n\nBạn có thể mở Antigravity IDE và gõ ngay câu lệnh /skill để thực thi!");
  }, 400);
}
