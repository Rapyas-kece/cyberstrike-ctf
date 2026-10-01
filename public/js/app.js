// ===================================================================
// CYBERSTRIKE CTF - CLIENT APPLICATION LOGIC (BAHASA INDONESIA)
// ===================================================================

let state = {
  currentUser: null,
  challenges: [],
  scoreboard: [],
  solves: [],
  analytics: null,
  activeCategory: 'ALL',
  selectedChallenge: null
};

// Chart.js instances
let chartScores = null;
let chartCategory = null;

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initModals();
  initFilters();
  initForms();
  fetchAllData();

  // Sinkronisasi otomatis setiap 15 detik
  setInterval(() => {
    fetchScoreboardData();
    fetchSolvesData();
  }, 15000);
});

// ===================================================================
// NAVIGASI TAB
// ===================================================================
function initTabs() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetTab = tab.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.remove('active');
      });

      const activeSection = document.getElementById(`section-${targetTab}`);
      if (activeSection) {
        activeSection.classList.add('active');
      }

      if (targetTab === 'scoreboard') {
        renderScoreboard();
      } else if (targetTab === 'analytics') {
        renderAnalytics();
      } else if (targetTab === 'solves') {
        renderSolves();
      }
    });
  });

  const btnRefresh = document.getElementById('btn-refresh-scoreboard');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      fetchScoreboardData();
      showToast('Memperbarui data papan peringkat...');
    });
  }
}

// ===================================================================
// FILTER KATEGORI
// ===================================================================
function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.dataset.category;
      renderChallenges();
    });
  });
}

// ===================================================================
// MENGAMBIL DATA DARI SERVER
// ===================================================================
async function fetchAllData() {
  await fetchUserData();
  await Promise.all([
    fetchChallengesData(),
    fetchScoreboardData(),
    fetchSolvesData(),
    fetchAnalyticsData()
  ]);
}

async function fetchUserData() {
  try {
    const res = await fetch('/api/me');
    const data = await res.json();
    state.currentUser = data.user || null;
    updateUserNav();
    if (!state.currentUser) {
      openAuthModal();
    }
  } catch (err) {
    console.error('Gagal memuat profil pengguna:', err);
    state.currentUser = null;
    updateUserNav();
    openAuthModal();
  }
}

function updateUserNav() {
  const userModalBtn = document.getElementById('btn-user-modal');
  const loginTriggerBtn = document.getElementById('btn-login-trigger');
  const navAvatar = document.getElementById('nav-user-avatar');
  const navName = document.getElementById('nav-user-name');
  const statMyPoints = document.getElementById('stat-my-points');

  if (state.currentUser) {
    if (userModalBtn) userModalBtn.style.display = 'flex';
    if (loginTriggerBtn) loginTriggerBtn.style.display = 'none';
    if (navName) navName.textContent = state.currentUser.username;
    if (navAvatar) navAvatar.textContent = state.currentUser.username.substring(0, 2).toUpperCase();
  } else {
    if (userModalBtn) userModalBtn.style.display = 'none';
    if (loginTriggerBtn) loginTriggerBtn.style.display = 'inline-flex';
    if (statMyPoints) statMyPoints.textContent = '0';
  }
}

async function fetchChallengesData() {
  try {
    const res = await fetch('/api/challenges');
    state.challenges = await res.json();
    renderChallenges();
    updateHeroStats();
  } catch (err) {
    console.error('Gagal memuat data tantangan:', err);
  }
}

async function fetchScoreboardData() {
  try {
    const res = await fetch('/api/scoreboard');
    state.scoreboard = await res.json();
    renderScoreboard();
    updateUserScoreFromBoard();
  } catch (err) {
    console.error('Gagal memuat scoreboard:', err);
  }
}

async function fetchSolvesData() {
  try {
    const res = await fetch('/api/solves');
    state.solves = await res.json();
    renderSolves();
  } catch (err) {
    console.error('Gagal memuat log solves:', err);
  }
}

async function fetchAnalyticsData() {
  try {
    const res = await fetch('/api/analytics');
    state.analytics = await res.json();
    renderAnalytics();
  } catch (err) {
    console.error('Gagal memuat analitik:', err);
  }
}

function updateUserScoreFromBoard() {
  if (!state.currentUser || !state.scoreboard) return;
  const myEntry = state.scoreboard.find(s => s.id === state.currentUser.id);
  const myScore = myEntry ? myEntry.totalPoints : 0;
  const scoreChip = document.getElementById('nav-user-score');
  const statMyPoints = document.getElementById('stat-my-points');
  if (scoreChip) scoreChip.textContent = `${myScore} poin`;
  if (statMyPoints) statMyPoints.textContent = myScore;
}

function updateHeroStats() {
  const solvedCount = state.challenges.filter(c => c.solvedByCurrentUser).length;
  const totalChalls = state.challenges.length;
  const statTotal = document.getElementById('stat-total-challs');
  const statSolved = document.getElementById('stat-solved-challs');
  if (statTotal) statTotal.textContent = totalChalls;
  if (statSolved) statSolved.textContent = `${solvedCount}/${totalChalls}`;
}

// ===================================================================
// RENDERING KARTU TANTANGAN
// ===================================================================
function renderChallenges() {
  const container = document.getElementById('challenges-container');
  if (!container) return;

  const filtered = state.challenges.filter(ch => {
    if (state.activeCategory === 'ALL') return true;
    return ch.category === state.activeCategory;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--text-dim); padding: 3rem;">Tidak ada tantangan dalam kategori ini.</div>`;
    return;
  }

  container.innerHTML = filtered.map(ch => {
    let catClass = 'cat-web';
    if (ch.category === 'Cryptography') catClass = 'cat-crypto';
    if (ch.category === 'Digital Forensics') catClass = 'cat-forensics';

    return `
      <div class="challenge-card ${ch.solvedByCurrentUser ? 'solved' : ''}" onclick="openChallengeModal('${ch.id}')">
        <div>
          <div class="card-top">
            <span class="card-category-tag ${catClass}">${ch.category}</span>
            <span class="card-points">${ch.points} POIN</span>
          </div>
          <h3 class="card-title">${escapeHtml(ch.title)}</h3>
          <div class="card-clue">
            <span class="clue-icon">💡</span> Clue: <strong>${escapeHtml(ch.clue || 'Analisis Teknis')}</strong>
          </div>
        </div>
        <div class="card-bottom">
          <span class="card-solves-count">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            ${ch.solveCount} Pemecah
          </span>
          <span class="card-status-badge ${ch.solvedByCurrentUser ? 'status-solved' : 'status-unsolved'}">
            ${ch.solvedByCurrentUser ? '✓ Selesai' : 'Belum Solved'}
          </span>
        </div>
      </div>
    `;
  }).join('');
}

// ===================================================================
// RENDERING PAPAN PERINGKAT (SCOREBOARD)
// ===================================================================
function renderScoreboard() {
  const tbody = document.getElementById('scoreboard-tbody');
  const podiumWrapper = document.getElementById('podium-wrapper');
  if (!tbody || !state.scoreboard) return;

  const board = state.scoreboard;

  // Render Podium Juara (Top 3)
  if (podiumWrapper) {
    if (board.length === 0) {
      podiumWrapper.innerHTML = `
        <div class="podium-empty-notice">
          <div class="empty-trophy">🏆</div>
          <h3>Papan Peringkat Bersih & Siap Dimulai</h3>
          <p>Belum ada skor yang dicatat. Selesaikan tantangan sekarang untuk merebut posisi Juara 1!</p>
        </div>
      `;
    } else {
      const top1 = board[0] || null;
      const top2 = board[1] || null;
      const top3 = board[2] || null;

      let podiumHtml = '';

      // Juara 2 (Perak)
      if (top2) {
        podiumHtml += `
          <div class="podium-slot rank-2">
            <div class="podium-rank-badge rank-badge-2">2</div>
            <div class="podium-name">${escapeHtml(top2.username)}</div>
            <div class="podium-affiliation">${escapeHtml(top2.affiliation || 'Peserta')}</div>
            <div class="podium-score">${top2.totalPoints} <span style="font-size: 0.8rem;">POIN</span></div>
            <div class="podium-solves">${top2.solveCount} Tantangan Selesai</div>
          </div>
        `;
      }

      // Juara 1 (Emas - Poin Tertinggi)
      if (top1) {
        podiumHtml += `
          <div class="podium-slot rank-1">
            <span class="podium-crown">👑</span>
            <div class="podium-rank-badge rank-badge-1">1</div>
            <div class="podium-name" style="font-size: 1.35rem; color: #f59e0b;">${escapeHtml(top1.username)}</div>
            <div class="podium-affiliation">${escapeHtml(top1.affiliation || 'Peringkat 1')}</div>
            <div class="podium-score" style="color: #f59e0b; font-size: 1.85rem;">${top1.totalPoints} <span style="font-size: 0.9rem;">POIN</span></div>
            <div class="podium-solves" style="color: #cbd5e1; font-weight: 700;">⭐ POIN TERTINGGI SAAT INI ⭐</div>
          </div>
        `;
      }

      // Juara 3 (Perunggu)
      if (top3) {
        podiumHtml += `
          <div class="podium-slot rank-3">
            <div class="podium-rank-badge rank-badge-3">3</div>
            <div class="podium-name">${escapeHtml(top3.username)}</div>
            <div class="podium-affiliation">${escapeHtml(top3.affiliation || 'Peserta')}</div>
            <div class="podium-score">${top3.totalPoints} <span style="font-size: 0.8rem;">POIN</span></div>
            <div class="podium-solves">${top3.solveCount} Tantangan Selesai</div>
          </div>
        `;
      }

      podiumWrapper.innerHTML = podiumHtml;
    }
  }

  // Render Tabel Peringkat
  if (board.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; color: var(--text-dim); padding: 3rem 1rem;">
          <div style="font-size: 1.05rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.35rem;">Belum Ada Peserta yang Terdaftar / Meraih Poin</div>
          <div style="font-size: 0.85rem; color: var(--text-dim);">Papan skor akan otomatis terisi saat flag pertama berhasil diselesaikan.</div>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = board.map(item => {
    let rankBadge = item.rank;
    let rankClass = '';
    if (item.rank === 1) { rankBadge = '🥇 1'; rankClass = 'rank-top1'; }
    else if (item.rank === 2) { rankBadge = '🥈 2'; rankClass = 'rank-top2'; }
    else if (item.rank === 3) { rankBadge = '🥉 3'; rankClass = 'rank-top3'; }

    const isMe = state.currentUser && state.currentUser.id === item.id;

    return `
      <tr style="${isMe ? 'background: rgba(6, 182, 212, 0.08);' : ''}">
        <td class="rank-cell ${rankClass}">${rankBadge}</td>
        <td>
          <div class="user-cell">
            <span class="table-avatar">${escapeHtml(item.username.substring(0, 2).toUpperCase())}</span>
            <span>${escapeHtml(item.username)} ${isMe ? '<small style="color: var(--cyan);">(Anda)</small>' : ''}</span>
          </div>
        </td>
        <td class="affiliation-cell">${escapeHtml(item.affiliation || '-')}</td>
        <td style="font-family: var(--font-mono); color: #38bdf8;">${item.breakdown['Web Exploitation']}</td>
        <td style="font-family: var(--font-mono); color: #c084fc;">${item.breakdown['Cryptography']}</td>
        <td style="font-family: var(--font-mono); color: #34d399;">${item.breakdown['Digital Forensics']}</td>
        <td style="font-family: var(--font-mono); color: var(--rose);">
          ${item.firstBloods > 0 ? `🩸 ${item.firstBloods}` : '0'}
        </td>
        <td style="font-family: var(--font-mono);">${item.solveCount}</td>
        <td class="score-cell">${item.totalPoints}</td>
      </tr>
    `;
  }).join('');
}

// ===================================================================
// PUSAT ANALISIS & STATISTIK POIN TERTINGGI
// ===================================================================
function renderAnalytics() {
  if (!state.analytics || !state.scoreboard) return;

  const a = state.analytics;
  const board = state.scoreboard;

  // 1. Spotlight Poin Tertinggi
  const top1 = board[0] || null;
  const runnerUp = board[1] || null;
  const spotlightContainer = document.getElementById('analytics-spotlight');

  if (spotlightContainer) {
    if (top1) {
      const pointMargin = runnerUp ? (top1.totalPoints - runnerUp.totalPoints) : top1.totalPoints;

      spotlightContainer.innerHTML = `
        <div class="spotlight-inner">
          <div class="spotlight-left">
            <div class="spotlight-trophy">🏆</div>
            <div>
              <div class="spotlight-label">Analisis Poin Tertinggi (Top Scorer)</div>
              <div class="spotlight-title">${escapeHtml(top1.username)}</div>
              <div class="spotlight-desc">
                Memimpin klasemen perolehan skor dengan total <strong>${top1.solveCount} soal berhasil dipecahkan</strong> 
                dan keunggulan margin <strong>+${pointMargin} poin</strong> atas peringkat ke-2!
              </div>
            </div>
          </div>
          <div class="spotlight-score-box">
            <span class="spotlight-score-num">${top1.totalPoints}</span>
            <span class="spotlight-score-label">Total Poin Tertinggi</span>
          </div>
        </div>
      `;
    } else {
      spotlightContainer.innerHTML = `
        <div class="spotlight-inner" style="border-left-color: var(--cyan);">
          <div class="spotlight-left">
            <div class="spotlight-trophy">⚡</div>
            <div>
              <div class="spotlight-label">Pusat Analisis Kompetisi</div>
              <div class="spotlight-title">Papan Skor Bersih (0 Peserta)</div>
              <div class="spotlight-desc">
                Papan peringkat telah direset untuk kompetisi baru. Jadilah peretas pertama yang mengirimkan flag valid untuk memuncaki statistik!
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }

  // 2. Render Grafik
  renderScoreBarChart(board);
  renderCategoryDoughnutChart(a.categoryStats);

  // 3. Render Kartu Ringkasan
  const insightsContainer = document.getElementById('analytics-insights');
  if (insightsContainer) {
    insightsContainer.innerHTML = `
      <div class="insight-card">
        <h4>Tingkat Solved Keseluruhan</h4>
        <div class="insight-value">${a.totalSolves} Solves</div>
        <div class="insight-sub">Dari ${a.totalChallenges} tantangan aktif</div>
      </div>
      <div class="insight-card">
        <h4>Kategori Terbanyak Dipecahkan</h4>
        <div class="insight-value" style="color: var(--cyan);">${getMostSolvedCategory(a.categoryStats)}</div>
        <div class="insight-sub">Aktivitas pemecahan paling tinggi</div>
      </div>
      <div class="insight-card">
        <h4>Peserta Aktif Bertanding</h4>
        <div class="insight-value" style="color: var(--emerald);">${board.length} Peserta</div>
        <div class="insight-sub">Tercatat di basis data platform</div>
      </div>
    `;
  }
}

function getMostSolvedCategory(catStats) {
  let best = 'Web Exploitation';
  let max = -1;
  for (const cat in catStats) {
    if (catStats[cat] > max) {
      max = catStats[cat];
      best = cat;
    }
  }
  return best;
}

function renderScoreBarChart(board) {
  const ctx = document.getElementById('chart-scores-bar');
  if (!ctx) return;

  const topUsers = board.slice(0, 6);
  const labels = topUsers.map(u => u.username);
  const points = topUsers.map(u => u.totalPoints);

  if (chartScores) {
    chartScores.destroy();
  }

  chartScores = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Total Poin',
        data: points,
        backgroundColor: [
          'rgba(245, 158, 11, 0.85)', // Emas Juara 1
          'rgba(6, 182, 212, 0.75)',
          'rgba(139, 92, 246, 0.75)',
          'rgba(16, 185, 129, 0.75)',
          'rgba(56, 189, 248, 0.65)',
          'rgba(148, 163, 184, 0.55)'
        ],
        borderColor: [
          '#f59e0b',
          '#06b6d4',
          '#8b5cf6',
          '#10b981',
          '#38bdf8',
          '#94a3b8'
        ],
        borderWidth: 1.5,
        borderRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8', font: { family: 'Outfit', size: 12 } },
          grid: { display: false }
        },
        y: {
          ticks: { color: '#64748b', font: { family: 'JetBrains Mono' } },
          grid: { color: 'rgba(255, 255, 255, 0.05)' },
          beginAtZero: true
        }
      }
    }
  });
}

function renderCategoryDoughnutChart(catStats) {
  const ctx = document.getElementById('chart-category-doughnut');
  if (!ctx) return;

  if (chartCategory) {
    chartCategory.destroy();
  }

  chartCategory = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Web Exploitation', 'Cryptography', 'Digital Forensics'],
      datasets: [{
        data: [
          catStats['Web Exploitation'] || 0,
          catStats['Cryptography'] || 0,
          catStats['Digital Forensics'] || 0
        ],
        backgroundColor: [
          '#38bdf8', // Web
          '#a855f7', // Crypto
          '#10b981'  // Forensics
        ],
        borderColor: '#0c1220',
        borderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#94a3b8',
            font: { family: 'Outfit', size: 12 },
            padding: 14
          }
        }
      }
    }
  });
}

// ===================================================================
// SOLVE TRACKER (AUDIT LOG REAL-TIME)
// ===================================================================
function renderSolves() {
  const container = document.getElementById('solves-timeline-list');
  if (!container || !state.solves) return;

  if (state.solves.length === 0) {
    container.innerHTML = `
      <div class="solves-empty-card">
        <div class="empty-icon">🚩</div>
        <h3>Belum Ada Solve Tercatat</h3>
        <p>Jadilah peretas pertama yang memecahkan tantangan dan rebut gelar <strong>First Blood</strong>!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.solves.map(s => {
    const formattedTime = new Date(s.timestamp).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return `
      <div class="solve-item">
        <div class="solve-left">
          <div class="solve-meta-row">
            <span class="solve-user-badge">
              <span class="user-avatar-tiny">${escapeHtml(s.username.substring(0, 2).toUpperCase())}</span>
              ${escapeHtml(s.username)}
            </span>
            ${s.isFirstBlood ? '<span class="solve-first-blood-badge">🩸 First Blood</span>' : ''}
          </div>
          <div class="solve-target">
            berhasil menyelesaikan <strong class="solve-chall-name">${escapeHtml(s.challengeTitle)}</strong>
            <span class="solve-cat-tag">(${escapeHtml(s.category)})</span>
          </div>
        </div>
        <div class="solve-right">
          <span class="solve-points">+${s.points} POIN</span>
          <span class="solve-time">${formattedTime} WIB</span>
        </div>
      </div>
    `;
  }).join('');
}

// ===================================================================
// MODAL TANTANGAN, USER PROFILE & AUTH
// ===================================================================
function openAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.add('open');
  }
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) {
    modal.classList.remove('open');
    const errBox = document.getElementById('auth-error-box');
    if (errBox) {
      errBox.style.display = 'none';
      errBox.textContent = '';
    }
  }
}

window.setAuthTab = function(tab) {
  const btnReg = document.getElementById('btn-tab-reg');
  const btnLogin = document.getElementById('btn-tab-login');
  const formReg = document.getElementById('form-auth-reg');
  const formLogin = document.getElementById('form-auth-login');
  const errBox = document.getElementById('auth-error-box');
  if (errBox) {
    errBox.style.display = 'none';
    errBox.textContent = '';
  }

  if (tab === 'login') {
    if (btnReg) btnReg.classList.remove('active');
    if (btnLogin) btnLogin.classList.add('active');
    if (formReg) formReg.style.display = 'none';
    if (formLogin) formLogin.style.display = 'block';
  } else {
    if (btnReg) btnReg.classList.add('active');
    if (btnLogin) btnLogin.classList.remove('active');
    if (formReg) formReg.style.display = 'block';
    if (formLogin) formLogin.style.display = 'none';
  }
};

window.logoutUser = async function() {
  try {
    const res = await fetch('/api/user/logout', { method: 'POST' });
    state.currentUser = null;
    const userModal = document.getElementById('user-modal');
    if (userModal) userModal.classList.remove('open');
    updateUserNav();
    showToast('Anda telah keluar dari akun.');
    fetchAllData();
    openAuthModal();
  } catch (err) {
    console.error('Gagal keluar:', err);
  }
};

function initModals() {
  const challModal = document.getElementById('challenge-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  if (btnCloseModal && challModal) {
    btnCloseModal.addEventListener('click', () => {
      challModal.classList.remove('open');
    });
  }

  const userModal = document.getElementById('user-modal');
  const btnUserModal = document.getElementById('btn-user-modal');
  const btnCloseUserModal = document.getElementById('btn-close-user-modal');

  if (btnUserModal && userModal) {
    btnUserModal.addEventListener('click', () => {
      openUserModal();
    });
  }
  if (btnCloseUserModal && userModal) {
    btnCloseUserModal.addEventListener('click', () => {
      userModal.classList.remove('open');
    });
  }

  const authModal = document.getElementById('auth-modal');
  const btnLoginTrigger = document.getElementById('btn-login-trigger');
  const btnCloseAuth = document.getElementById('btn-close-auth-modal');

  if (btnLoginTrigger) {
    btnLoginTrigger.addEventListener('click', () => {
      openAuthModal();
    });
  }
  if (btnCloseAuth && authModal) {
    btnCloseAuth.addEventListener('click', () => {
      closeAuthModal();
    });
  }

  // Tutup modal ketika backdrop diklik
  window.addEventListener('click', (e) => {
    if (e.target === challModal) challModal.classList.remove('open');
    if (e.target === userModal) userModal.classList.remove('open');
    if (e.target === authModal) closeAuthModal();
  });

  // Toggle Hint (Petunjuk)
  const btnToggleHint = document.getElementById('btn-toggle-hint');
  const modalHintBody = document.getElementById('modal-hint-body');
  if (btnToggleHint && modalHintBody) {
    btnToggleHint.addEventListener('click', () => {
      const isHidden = modalHintBody.style.display === 'none';
      modalHintBody.style.display = isHidden ? 'block' : 'none';
      btnToggleHint.innerHTML = isHidden 
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg> Sembunyikan Petunjuk`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> Tampilkan Petunjuk (Hint)`;
    });
  }
}

function openChallengeModal(challengeId) {
  const ch = state.challenges.find(c => c.id === challengeId);
  if (!ch) return;

  state.selectedChallenge = ch;

  document.getElementById('modal-title').textContent = ch.title;
  document.getElementById('modal-cat').textContent = ch.category;
  
  const clueEl = document.getElementById('modal-clue');
  if (clueEl) {
    clueEl.textContent = `Clue: ${ch.clue || 'Eksploitasi Teknis'}`;
  }

  document.getElementById('modal-pts').textContent = `${ch.points} Poin`;
  
  const statusEl = document.getElementById('modal-status');
  statusEl.textContent = ch.solvedByCurrentUser ? '✓ Selesai (Solved)' : 'Belum Solved';
  statusEl.style.color = ch.solvedByCurrentUser ? 'var(--emerald)' : 'var(--text-dim)';

  document.getElementById('modal-desc').textContent = ch.description;

  // Tombol aksi (Buka Web Lab atau Unduh Berkas)
  const actionsContainer = document.getElementById('modal-actions-container');
  let actionHtml = '';

  if (ch.targetUrl) {
    actionHtml += `
      <a href="${ch.targetUrl}" target="_blank" class="btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        Buka Laboratorium Web (Live)
      </a>
    `;
  }

  if (ch.downloadFile) {
    actionHtml += `
      <a href="/api/download/${ch.downloadFile}" download class="btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Unduh Berkas Soal (${ch.downloadFile})
      </a>
    `;
  }

  if (ch.secondaryDownload) {
    actionHtml += `
      <a href="/api/download/${ch.secondaryDownload}" download class="btn-secondary">
        Unduh Script Pembantu (${ch.secondaryDownload})
      </a>
    `;
  }

  actionsContainer.innerHTML = actionHtml;

  // Petunjuk
  const hintTextEl = document.getElementById('modal-hint-text');
  const hintBodyEl = document.getElementById('modal-hint-body');
  if (hintBodyEl) hintBodyEl.style.display = 'none';
  if (hintTextEl) hintTextEl.textContent = (ch.hints && ch.hints[0]) ? ch.hints[0] : 'Tidak ada petunjuk tambahan untuk soal ini.';

  // Reset pesan feedback
  const feedbackEl = document.getElementById('submission-feedback');
  feedbackEl.style.display = 'none';
  feedbackEl.className = 'submission-feedback';
  document.getElementById('input-flag').value = '';

  document.getElementById('challenge-modal').classList.add('open');
}

// Modal Pemilihan Akun
async function openUserModal() {
  try {
    const activeSummary = document.getElementById('modal-active-user-card');
    if (activeSummary && state.currentUser) {
      activeSummary.innerHTML = `
        <div class="active-user-box">
          <div class="active-user-avatar">${escapeHtml(state.currentUser.username.substring(0, 2).toUpperCase())}</div>
          <div class="active-user-details">
            <div class="active-user-title">${escapeHtml(state.currentUser.username)}</div>
            <div class="active-user-sub">${escapeHtml(state.currentUser.name || state.currentUser.affiliation || 'Peserta Mandiri')}</div>
          </div>
        </div>
      `;
    }

    const res = await fetch('/api/users');
    const users = await res.json();
    const list = document.getElementById('user-selection-list');
    if (list) {
      if (users.length === 0) {
        list.innerHTML = `<div style="text-align: center; color: var(--text-dim); padding: 1rem;">Belum ada peserta lain terdaftar.</div>`;
      } else {
        list.innerHTML = users.map(u => {
          const isCur = state.currentUser && state.currentUser.id === u.id;
          return `
            <button class="user-item-btn ${isCur ? 'active' : ''}" onclick="switchUser('${u.id}')">
              <div>
                <strong>${escapeHtml(u.username)}</strong>
                <div style="font-size: 0.75rem; color: #94a3b8;">${escapeHtml(u.affiliation || 'Peserta Mandiri')}</div>
              </div>
              <div>${isCur ? '✓ Sedang Aktif' : 'Pilih Akun'}</div>
            </button>
          `;
        }).join('');
      }
    }

    document.getElementById('user-modal').classList.add('open');
  } catch (err) {
    console.error('Gagal memuat daftar peserta:', err);
  }
}

async function switchUser(userId) {
  try {
    const res = await fetch('/api/user/switch', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    if (data.success) {
      state.currentUser = data.user;
      document.getElementById('user-modal').classList.remove('open');
      showToast(`Beralih ke akun peserta: ${data.user.username}`);
      fetchAllData();
    }
  } catch (err) {
    console.error('Gagal berpindah akun:', err);
  }
}

// ===================================================================
// PENGIRIMAN FORM (SUBMIT FLAG & AUTH)
// ===================================================================
function initForms() {
  // Form Submit Flag
  const formSubmit = document.getElementById('form-submit-flag');
  if (formSubmit) {
    formSubmit.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!state.selectedChallenge) return;

      if (!state.currentUser) {
        showToast('Silakan masuk atau daftar akun terlebih dahulu!');
        openAuthModal();
        return;
      }

      const flagInput = document.getElementById('input-flag');
      const flagVal = flagInput.value.trim();
      const feedbackEl = document.getElementById('submission-feedback');
      const btnSubmit = document.getElementById('btn-submit-flag');

      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Memverifikasi...';

      try {
        const res = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeId: state.selectedChallenge.id,
            flag: flagVal
          })
        });

        const data = await res.json();

        feedbackEl.style.display = 'block';
        if (data.success) {
          feedbackEl.className = 'submission-feedback success';
          feedbackEl.innerHTML = `<strong>SUKSES:</strong> ${data.message}`;
          showToast(data.isFirstBlood ? '🩸 FIRST BLOOD diraih!' : '🎯 Flag Benar!');
          
          // Refresh data seketika
          fetchAllData();

          // Perbarui status modal
          document.getElementById('modal-status').textContent = '✓ Selesai (Solved)';
          document.getElementById('modal-status').style.color = 'var(--emerald)';
        } else {
          feedbackEl.className = 'submission-feedback error';
          feedbackEl.innerHTML = `<strong>GAGAL:</strong> ${data.message}`;
        }
      } catch (err) {
        feedbackEl.style.display = 'block';
        feedbackEl.className = 'submission-feedback error';
        feedbackEl.textContent = 'Terjadi kendala jaringan saat menghubungi server.';
      } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Kirim Flag';
      }
    });
  }

  // Form Auth: Daftar Baru
  const formAuthReg = document.getElementById('form-auth-reg');
  if (formAuthReg) {
    formAuthReg.addEventListener('submit', async (e) => {
      e.preventDefault();
      const usernameInput = document.getElementById('auth-reg-user');
      const nameInput = document.getElementById('auth-reg-name');
      const affilInput = document.getElementById('auth-reg-affil');
      const errBox = document.getElementById('auth-error-box');

      try {
        const res = await fetch('/api/user/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: usernameInput.value.trim(),
            name: nameInput.value.trim(),
            affiliation: affilInput.value.trim()
          })
        });

        const data = await res.json();
        if (data.success) {
          state.currentUser = data.user;
          closeAuthModal();
          updateUserNav();
          showToast(`Selamat datang di CyberStrike, ${data.user.username}!`);
          usernameInput.value = '';
          nameInput.value = '';
          affilInput.value = '';
          fetchAllData();
        } else {
          if (errBox) {
            errBox.style.display = 'block';
            errBox.textContent = data.error || 'Gagal mendaftarkan akun.';
          }
        }
      } catch (err) {
        if (errBox) {
          errBox.style.display = 'block';
          errBox.textContent = 'Terjadi kesalahan jaringan.';
        }
      }
    });
  }

  // Form Auth: Login Username Terdaftar
  const formAuthLogin = document.getElementById('form-auth-login');
  if (formAuthLogin) {
    formAuthLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const loginUser = document.getElementById('auth-login-user');
      const errBox = document.getElementById('auth-error-box');

      try {
        const res = await fetch('/api/user/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: loginUser.value.trim()
          })
        });

        const data = await res.json();
        if (data.success) {
          state.currentUser = data.user;
          closeAuthModal();
          updateUserNav();
          showToast(`Berhasil masuk kembali sebagai ${data.user.username}!`);
          loginUser.value = '';
          fetchAllData();
        } else {
          if (errBox) {
            errBox.style.display = 'block';
            errBox.textContent = data.error || 'Username tidak ditemukan.';
          }
        }
      } catch (err) {
        if (errBox) {
          errBox.style.display = 'block';
          errBox.textContent = 'Terjadi kesalahan jaringan.';
        }
      }
    });
  }
}

// ===================================================================
// UTILITAS
// ===================================================================
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
