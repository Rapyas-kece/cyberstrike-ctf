const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const webChallengeRoutes = require('./challenges/webRoutes');
const cryptoChallengeRoutes = require('./challenges/cryptoRoutes');
const forensicsChallengeRoutes = require('./challenges/forensicsRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Prevent server process crashes from unhandled asynchronous errors or bugs
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT EXCEPTION]', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]', reason);
});

// Trust proxy for reverse proxies like Cloudflare Tunnel
app.set('trust proxy', 1);

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Allows Chart.js and CDN Google Fonts smoothly
  crossOriginEmbedderPolicy: false
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets and downloads
app.use(express.static(path.join(__dirname, 'public')));

// Rate Limiter for Flag Submission (Security against brute-force)
const submitLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // max 60 submissions per minute per IP
  validate: { xForwardedForHeader: false },
  message: { success: false, message: 'Terlalu banyak percobaan pengiriman flag! Harap tunggu sebentar.' }
});

// Paths to persistence data files
const CHALLENGES_FILE = path.join(__dirname, 'data', 'challenges.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const SOLVES_FILE = path.join(__dirname, 'data', 'solves.json');

// Helper to safely read JSON files
function readJSON(filePath, defaultVal = []) {
  try {
    if (!fs.existsSync(filePath)) return defaultVal;
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return defaultVal;
  }
}

// Helper to safely write JSON files
function writeJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
    return false;
  }
}

// Middleware: Get current active user from cookie if set
app.use((req, res, next) => {
  const currentUserId = req.cookies['ctf_user_id'];
  if (currentUserId) {
    const users = readJSON(USERS_FILE);
    const user = users.find(u => u.id === currentUserId);
    req.currentUser = user || null;
  } else {
    req.currentUser = null;
  }
  next();
});

// Mount Web Exploitation Challenges
app.use('/challenges/web', webChallengeRoutes);
app.use('/challenges/crypto', cryptoChallengeRoutes);
app.use('/challenges/forensics', forensicsChallengeRoutes);

// Forced file download route (Content-Disposition: attachment)
app.get('/api/download/:filename', (req, res) => {
  const filename = req.params.filename;
  // Sanitize: only allow alphanumeric, dots, underscores, hyphens
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return res.status(400).json({ error: 'Invalid filename' });
  }
  const filePath = path.join(__dirname, 'public', 'downloads', filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  res.download(filePath, filename, (err) => {
    if (err && !res.headersSent) {
      res.status(500).json({ error: 'Download failed' });
    }
  });
});

// ==========================================================
// API ROUTES
// ==========================================================

// 1. Get current active user
app.get('/api/me', (req, res) => {
  res.json({
    user: req.currentUser
  });
});

// 2. Switch, login, logout, or create user
app.post('/api/user/switch', (req, res) => {
  const { userId } = req.body;
  const users = readJSON(USERS_FILE);
  const found = users.find(u => u.id === userId);
  if (!found) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.cookie('ctf_user_id', found.id, { path: '/', maxAge: 365 * 24 * 3600 * 1000 });
  res.json({ success: true, user: found });
});

app.post('/api/user/login', (req, res) => {
  const { username } = req.body;
  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Username wajib diisi' });
  }
  const users = readJSON(USERS_FILE);
  const found = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
  if (!found) {
    return res.status(404).json({ error: 'Username belum terdaftar! Silakan buat akun baru.' });
  }
  res.cookie('ctf_user_id', found.id, { path: '/', maxAge: 365 * 24 * 3600 * 1000 });
  res.json({ success: true, user: found });
});

app.post('/api/user/logout', (req, res) => {
  res.clearCookie('ctf_user_id', { path: '/' });
  res.json({ success: true });
});

app.post('/api/user/create', (req, res) => {
  const { username, name, affiliation } = req.body;
  if (!username || username.trim().length < 3) {
    return res.status(400).json({ error: 'Username minimal 3 karakter' });
  }
  const users = readJSON(USERS_FILE);
  const exists = users.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
  if (exists) {
    return res.status(409).json({ error: 'Username sudah digunakan, pilih username lain atau login' });
  }

  const cleanUser = username.trim().replace(/[^a-zA-Z0-9_-]/g, '');
  const newUser = {
    id: 'u-' + Date.now().toString(36),
    username: cleanUser || username.trim(),
    name: (name || cleanUser || username).trim(),
    affiliation: (affiliation || 'Peserta Mandiri').trim(),
    country: 'ID'
  };

  users.push(newUser);
  writeJSON(USERS_FILE, users);

  res.cookie('ctf_user_id', newUser.id, { path: '/', maxAge: 365 * 24 * 3600 * 1000 });
  res.json({ success: true, user: newUser });
});

app.get('/api/users', (req, res) => {
  const users = readJSON(USERS_FILE);
  res.json(users);
});

// 3. Get all challenges (safe, sanitized without raw flags)
app.get('/api/challenges', (req, res) => {
  const challenges = readJSON(CHALLENGES_FILE);
  const solves = readJSON(SOLVES_FILE);
  const currentUserId = req.currentUser ? req.currentUser.id : null;

  const sanitized = challenges.map(ch => {
    const chSolves = solves.filter(s => s.challengeId === ch.id);
    const isSolvedByMe = solves.some(s => s.challengeId === ch.id && s.userId === currentUserId);
    const firstBlood = solves.find(s => s.challengeId === ch.id && s.isFirstBlood);

    return {
      id: ch.id,
      title: ch.title,
      category: ch.category,
      clue: ch.clue,
      points: ch.points,
      difficulty: ch.difficulty,
      description: ch.description,
      hints: ch.hints,
      targetUrl: ch.targetUrl || null,
      downloadFile: ch.downloadFile || null,
      secondaryDownload: ch.secondaryDownload || null,
      solveCount: chSolves.length,
      solvedByCurrentUser: isSolvedByMe,
      firstBloodUser: firstBlood ? firstBlood.username : null
    };
  });

  res.json(sanitized);
});

// 4. Submit Flag
app.post('/api/submit', submitLimiter, (req, res) => {
  const { challengeId, flag } = req.body;
  const user = req.currentUser;

  if (!user) {
    return res.status(401).json({ success: false, message: 'Anda belum masuk! Silakan daftarkan akun terlebih dahulu.' });
  }

  if (!challengeId || !flag) {
    return res.status(400).json({ success: false, message: 'ID tantangan dan flag wajib diisi' });
  }

  const challenges = readJSON(CHALLENGES_FILE);
  const ch = challenges.find(c => c.id === challengeId);
  if (!ch) {
    return res.status(404).json({ success: false, message: 'Tantangan tidak ditemukan' });
  }

  const solves = readJSON(SOLVES_FILE);

  // Check if already solved by current user
  const alreadySolved = solves.some(s => s.challengeId === challengeId && s.userId === user.id);
  if (alreadySolved) {
    return res.json({ success: false, message: 'Anda sudah pernah menyelesaikan tantangan ini sebelumnya!' });
  }

  // Verify flag (case-sensitive exact match)
  const submittedFlag = flag.trim();
  if (submittedFlag !== ch.flag.trim()) {
    return res.json({ success: false, message: 'Flag salah! Periksa kembali payload atau hasil analisis Anda.' });
  }

  // Correct flag! Determine if first blood
  const existingChallengeSolves = solves.filter(s => s.challengeId === challengeId);
  const isFirstBlood = existingChallengeSolves.length === 0;

  const newSolve = {
    id: 's-' + Date.now().toString(36),
    userId: user.id,
    username: user.username,
    challengeId: ch.id,
    challengeTitle: ch.title,
    category: ch.category,
    points: ch.points,
    timestamp: Date.now(),
    isFirstBlood: isFirstBlood
  };

  solves.unshift(newSolve); // Add to beginning of solves array
  writeJSON(SOLVES_FILE, solves);

  res.json({
    success: true,
    message: isFirstBlood 
      ? '🩸 FIRST BLOOD! Analisis yang sangat cepat dan luar biasa!' 
      : '🎯 Flag Benar! Poin telah berhasil ditambahkan ke profil Anda!',
    isFirstBlood: isFirstBlood,
    points: ch.points,
    challengeTitle: ch.title
  });
});

// 5. Leaderboard & Scoreboard calculation
app.get('/api/scoreboard', (req, res) => {
  const users = readJSON(USERS_FILE);
  const solves = readJSON(SOLVES_FILE);

  const leaderboard = users.map(user => {
    const userSolves = solves.filter(s => s.userId === user.id);
    const totalPoints = userSolves.reduce((sum, s) => sum + s.points, 0);
    const lastSolveTime = userSolves.length > 0 
      ? Math.max(...userSolves.map(s => s.timestamp)) 
      : 0;

    const breakdown = {
      'Web Exploitation': 0,
      'Cryptography': 0,
      'Digital Forensics': 0
    };
    userSolves.forEach(s => {
      if (breakdown[s.category] !== undefined) {
        breakdown[s.category] += s.points;
      }
    });

    return {
      id: user.id,
      username: user.username,
      name: user.name,
      affiliation: user.affiliation,
      totalPoints,
      solveCount: userSolves.length,
      lastSolveTime,
      breakdown,
      firstBloods: userSolves.filter(s => s.isFirstBlood).length
    };
  });

  // Sort descending by points, tie-breaker: earlier last solve timestamp
  leaderboard.sort((a, b) => {
    if (b.totalPoints !== a.totalPoints) {
      return b.totalPoints - a.totalPoints;
    }
    if (a.lastSolveTime === 0 && b.lastSolveTime === 0) return 0;
    if (a.lastSolveTime === 0) return 1;
    if (b.lastSolveTime === 0) return -1;
    return a.lastSolveTime - b.lastSolveTime;
  });

  // Add rank numbers
  const ranked = leaderboard.map((item, idx) => ({
    rank: idx + 1,
    ...item
  }));

  res.json(ranked);
});

// 6. Solves Log (History / Live feed)
app.get('/api/solves', (req, res) => {
  const solves = readJSON(SOLVES_FILE);
  // Sort latest first
  const sorted = [...solves].sort((a, b) => b.timestamp - a.timestamp);
  res.json(sorted);
});

// 7. Analytics Engine: Highest Score, Trends, and Distributions
app.get('/api/analytics', (req, res) => {
  const users = readJSON(USERS_FILE);
  const solves = readJSON(SOLVES_FILE);
  const challenges = readJSON(CHALLENGES_FILE);

  // Compute points per user
  const scores = {};
  users.forEach(u => { scores[u.id] = { username: u.username, name: u.name, points: 0, solves: 0 }; });
  solves.forEach(s => {
    if (scores[s.userId]) {
      scores[s.userId].points += s.points;
      scores[s.userId].solves += 1;
    }
  });

  // Top User / Highest Point Analysis
  let topUser = null;
  let maxPoints = -1;
  for (const uid in scores) {
    if (scores[uid].points > maxPoints) {
      maxPoints = scores[uid].points;
      topUser = scores[uid];
    }
  }

  // Solves per category
  const categoryStats = {
    'Web Exploitation': 0,
    'Cryptography': 0,
    'Digital Forensics': 0
  };
  solves.forEach(s => {
    if (categoryStats[s.category] !== undefined) {
      categoryStats[s.category] += 1;
    }
  });

  // Category point breakdown
  const categoryPoints = {
    'Web Exploitation': 0,
    'Cryptography': 0,
    'Digital Forensics': 0
  };
  challenges.forEach(ch => {
    if (categoryPoints[ch.category] !== undefined) {
      categoryPoints[ch.category] += ch.points;
    }
  });

  res.json({
    totalChallenges: challenges.length,
    totalSolves: solves.length,
    activeUsers: users.length,
    topUser: topUser || { username: 'None', name: 'Belum Ada', affiliation: '-', points: 0, solves: 0 },
    categoryStats,
    categoryPoints
  });
});

// Fallback to index.html for SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler to prevent process crashes or stack leak
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  if (!res.headersSent) {
    res.status(err.status || 500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🛡️  CTF PLATFORM IS RUNNING ONLINE`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🎯 Categories: Web Exploitation (ravid), Crypto (jason), Forensics (jason)`);
  console.log(`====================================================`);
});
