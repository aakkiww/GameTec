/**
 * BRAINTEC - ARENA DAYA INGAT
 * Multi-Game Platform Pelatihan Memori Manusia
 *
 * Game:
 * 1. Kartu Kembar (Visual & Associative Memory)
 * 2. Matriks Spasial (Spatial Working Memory)
 * 3. Urutan Simon (Sequential & Auditory-Visual Memory)
 * 4. Rentang Angka (Short-term Working Memory / Digit Span)
 * 5. Memori Kata (Verbal Continuous Recognition Memory)
 */

(function(){
  "use strict";

  // ========================================================
  // 1. AUDIO SYNTHESIZER ENGINE (Web Audio API)
  // Murni sintetis nada, 100% andal tanpa file mp3 eksternal
  // ========================================================
  var audioCtx = null;
  var soundEnabled = true;

  try {
    var storedSound = localStorage.getItem("braintec_sound");
    if (storedSound !== null) {
      soundEnabled = storedSound === "true";
    }
  } catch(e) {}

  function getAudioContext() {
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type, duration, gainVal) {
    if (!soundEnabled) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal || 0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch(e) {}
  }

  function playClick() {
    playTone(480, "sine", 0.06, 0.08);
  }

  function playFlip() {
    playTone(320, "triangle", 0.08, 0.1);
  }

  function playMatch() {
    if (!soundEnabled) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach(function(freq, i){
        setTimeout(function(){
          playTone(freq, "sine", 0.18, 0.18);
        }, i * 75);
      });
    } catch(e) {}
  }

  function playWrong() {
    if (!soundEnabled) return;
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.28);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch(e) {}
  }

  function playWin() {
    if (!soundEnabled) return;
    try {
      var notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach(function(freq, i){
        setTimeout(function(){
          playTone(freq, "triangle", 0.25, 0.2);
        }, i * 90);
      });
    } catch(e) {}
  }

  function playSimonNote(idx) {
    // 0: Pink (C4), 1: Blue (E4), 2: Green (G4), 3: Gold (C5)
    var freqs = [261.63, 329.63, 392.00, 523.25];
    playTone(freqs[idx] || 300, "triangle", 0.35, 0.24);
  }

  function playLevelUp() {
    if (!soundEnabled) return;
    setTimeout(function(){ playTone(587.33, "sine", 0.15, 0.15); }, 0);
    setTimeout(function(){ playTone(880.00, "sine", 0.25, 0.2); }, 120);
  }

  // ========================================================
  // 2. CONFETTI ENGINE (Perayaan Rekor Baru)
  // ========================================================
  var confettiCanvas = document.getElementById("confettiCanvas");
  var confettiCtx = confettiCanvas ? confettiCanvas.getContext("2d") : null;
  var confettiParticles = [];
  var confettiAnimId = null;

  function resizeConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeConfetti);
  resizeConfetti();

  function triggerConfetti(duration) {
    if (!confettiCanvas || !confettiCtx) return;
    resizeConfetti();
    var colors = ["#ff5e9c", "#38bdf8", "#34d399", "#fbbf24", "#a855f7", "#ec4899"];
    confettiParticles = [];
    var count = 90;
    for (var i = 0; i < count; i++) {
      confettiParticles.push({
        x: Math.random() * confettiCanvas.width,
        y: Math.random() * -confettiCanvas.height * 0.5,
        w: 6 + Math.random() * 8,
        h: 6 + Math.random() * 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: -3 + Math.random() * 6,
        vy: 3 + Math.random() * 5,
        rot: Math.random() * 360,
        vrot: -6 + Math.random() * 12,
        alpha: 1
      });
    }

    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
    var startTime = Date.now();
    var totalTime = duration || 2500;

    function renderConfetti() {
      var elapsed = Date.now() - startTime;
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      var allDone = true;

      confettiParticles.forEach(function(p) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        if (elapsed > totalTime * 0.7) {
          p.alpha = Math.max(0, 1 - (elapsed - totalTime * 0.7) / (totalTime * 0.3));
        }
        if (p.y < confettiCanvas.height && p.alpha > 0) {
          allDone = false;
          confettiCtx.save();
          confettiCtx.translate(p.x, p.y);
          confettiCtx.rotate((p.rot * Math.PI) / 180);
          confettiCtx.globalAlpha = p.alpha;
          confettiCtx.fillStyle = p.color;
          confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
          confettiCtx.restore();
        }
      });

      if (!allDone && elapsed < totalTime) {
        confettiAnimId = requestAnimationFrame(renderConfetti);
      } else {
        confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }
    }
    renderConfetti();
  }

  // ========================================================
  // 3. STORAGE & STATISTIK MANAGER
  // ========================================================
  function getBestScore(k) {
    try {
      var v = localStorage.getItem(k);
      return v ? parseInt(v, 10) : 0;
    } catch(e) { return 0; }
  }

  function setBestScore(k, v) {
    try { localStorage.setItem(k, String(v)); } catch(e) {}
  }

  function incrementPlays() {
    try {
      var p = parseInt(localStorage.getItem("braintec_total_plays") || "0", 10) + 1;
      localStorage.setItem("braintec_total_plays", String(p));
      refreshHubStats();
    } catch(e) {}
  }

  function refreshHubStats() {
    var plays = 0;
    try { plays = parseInt(localStorage.getItem("braintec_total_plays") || "0", 10); } catch(e) {}

    // Fallback cerdas: jika total plays masih 0, tetapi sudah ada skor yang tercatat di localStorage,
    // pulihkan jumlah permainan agar tidak bernilai 0
    if (plays === 0) {
      var countedFromScores = 0;
      for (var ci = 0; ci < 6; ci++) {
        if (getBestScore("kartu-kembar-best-" + ci) > 0) countedFromScores++;
      }
      if (getBestScore("braintec_matrix_best") > 0) countedFromScores++;
      if (getBestScore("braintec_simon_best") > 0) countedFromScores++;
      if (getBestScore("braintec_digit_best") > 0) countedFromScores++;
      if (getBestScore("braintec_verbal_best") > 0) countedFromScores++;

      if (countedFromScores > 0) {
        plays = countedFromScores;
        try { localStorage.setItem("braintec_total_plays", String(plays)); } catch(e) {}
      }
    }

    var elPlays = document.getElementById("totalGamesPlayed");
    if (elPlays) elPlays.textContent = plays;

    // Hitung total skor rekor dari semua 5 game
    var cardsBest = 0;
    for (var i = 0; i < 6; i++) {
      cardsBest += getBestScore("kartu-kembar-best-" + i);
    }
    var matrixBest = getBestScore("braintec_matrix_best");
    var simonBest = getBestScore("braintec_simon_best");
    var digitBest = getBestScore("braintec_digit_best");
    var verbalBest = getBestScore("braintec_verbal_best");

    var hubCards = document.getElementById("hubBestCards");
    if (hubCards) hubCards.textContent = cardsBest;

    var hubMat = document.getElementById("hubBestMatrix");
    if (hubMat) hubMat.textContent = matrixBest ? "Lv " + matrixBest : "–";

    var hubSim = document.getElementById("hubBestSimon");
    if (hubSim) hubSim.textContent = simonBest ? simonBest + " langkah" : "–";

    var hubDig = document.getElementById("hubBestDigit");
    if (hubDig) hubDig.textContent = digitBest ? digitBest + " digit" : "–";

    var hubVer = document.getElementById("hubBestVerbal");
    if (hubVer) hubVer.textContent = verbalBest ? verbalBest + " kata" : "–";

    // Total poin ekuivalen untuk peringkat kognitif
    var totalPoints = cardsBest + (matrixBest * 150) + (simonBest * 100) + (digitBest * 120) + (verbalBest * 40);
    var elHighscores = document.getElementById("totalHighscores");
    if (elHighscores) elHighscores.textContent = totalPoints;

    var rank = "Pemula";
    if (totalPoints > 5000) rank = "Jenius Kognitif 👑";
    else if (totalPoints > 2800) rank = "Master Memori 🧠";
    else if (totalPoints > 1400) rank = "Penjelajah Memori ⚡";
    else if (totalPoints > 500) rank = "Pelajar Cerdas 🌟";

    var elRank = document.getElementById("brainRankTitle");
    if (elRank) elRank.textContent = rank;
  }

  // ========================================================
  // 4. ROUTER / NAVIGASI VIEW
  // ========================================================
  var currentView = "hub";

  function switchView(viewName) {
    if (currentView === viewName) return;
    playClick();

    // Hentikan aktivitas game yang sedang berjalan jika meninggalkan game tersebut
    if (currentView === "cards") stopCardsTimer();
    if (currentView === "matrix") stopMatrix();
    if (currentView === "simon") stopSimon();
    if (currentView === "digit") stopDigit();
    if (currentView === "verbal") stopVerbal();

    currentView = viewName;

    // Update kelas active di tombol navigasi
    var navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach(function(btn) {
      btn.classList.toggle("active", btn.getAttribute("data-view") === viewName);
    });

    // Update section view
    var views = document.querySelectorAll(".view");
    views.forEach(function(v) {
      v.classList.remove("active");
    });
    var targetView = document.getElementById("view-" + viewName);
    if (targetView) targetView.classList.add("active");

    // Tutup overlay jika ada
    closeModal();
    closeHelpModal();

    // Inisialisasi awal saat view dibuka
    if (viewName === "hub") {
      refreshHubStats();
    } else if (viewName === "cards") {
      initCards();
    } else if (viewName === "matrix") {
      initMatrix();
    } else if (viewName === "simon") {
      initSimon();
    } else if (viewName === "digit") {
      initDigit();
    } else if (viewName === "verbal") {
      initVerbal();
    }
  }

  // Event listener tombol navigasi
  document.querySelectorAll("[data-view]").forEach(function(el) {
    el.addEventListener("click", function() {
      var v = this.getAttribute("data-view");
      if (v) switchView(v);
    });
  });

  document.querySelectorAll("[data-target]").forEach(function(el) {
    el.addEventListener("click", function(e) {
      e.stopPropagation();
      var t = this.getAttribute("data-target");
      if (t) switchView(t);
    });
  });

  var brandBtn = document.getElementById("brandBtn");
  if (brandBtn) brandBtn.onclick = function(){ switchView("hub"); };

  // Sound Toggle
  var soundToggleBtn = document.getElementById("soundToggle");
  var soundIconEl = document.getElementById("soundIcon");
  function updateSoundUI() {
    if (soundIconEl) soundIconEl.textContent = soundEnabled ? "🔊" : "🔇";
  }
  if (soundToggleBtn) {
    soundToggleBtn.onclick = function() {
      soundEnabled = !soundEnabled;
      try { localStorage.setItem("braintec_sound", String(soundEnabled)); } catch(e) {}
      updateSoundUI();
      if (soundEnabled) playClick();
    };
  }
  updateSoundUI();

  // Theme Toggle (Dark / Light)
  var themeToggleBtn = document.getElementById("themeToggle");
  var themeIconEl = document.getElementById("themeIcon");
  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  var currentTheme = localStorage.getItem("braintec_theme") || getSystemTheme();
  document.documentElement.setAttribute("data-theme", currentTheme);
  if (themeIconEl) themeIconEl.textContent = currentTheme === "dark" ? "☀️" : "🌙";

  if (themeToggleBtn) {
    themeToggleBtn.onclick = function() {
      var now = document.documentElement.getAttribute("data-theme") || "light";
      var next = now === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("braintec_theme", next); } catch(e) {}
      if (themeIconEl) themeIconEl.textContent = next === "dark" ? "☀️" : "🌙";
      playClick();
    };
  }

  // ========================================================
  // 5. MODAL SYSTEM (Hasil & Bantuan)
  // ========================================================
  var overlay = document.getElementById("ov");
  var mTitle = document.getElementById("mTitle");
  var mSub = document.getElementById("mSub");
  var mScore = document.getElementById("mScore");
  var mBest = document.getElementById("mBest");
  var mIcon = document.getElementById("mIcon");
  var mNext = document.getElementById("mNext");
  var mAgain = document.getElementById("mAgain");
  var mBackHub = document.getElementById("mBackHub");

  var onNextHandler = null;
  var onAgainHandler = null;

  function showResultModal(options) {
    // options: { isWin, isNewRecord, title, subtitle, scoreText, bestText, hasNext, onNext, onAgain }
    if (mIcon) mIcon.textContent = options.isNewRecord ? "👑" : (options.isWin ? "🎉" : "💪");
    if (mTitle) mTitle.textContent = options.title || (options.isWin ? "Luar Biasa!" : "Game Selesai");
    if (mSub) mSub.textContent = options.subtitle || "";
    if (mScore) mScore.textContent = options.scoreText || "";
    if (mBest) mBest.textContent = options.bestText || "";

    if (mNext) {
      mNext.style.display = options.hasNext ? "" : "none";
      onNextHandler = options.onNext || null;
    }
    onAgainHandler = options.onAgain || null;

    if (options.isNewRecord || options.isWin) {
      triggerConfetti(2800);
      playWin();
    } else {
      playWrong();
    }

    overlay.classList.add("show");
  }

  function closeModal() {
    if (overlay) overlay.classList.remove("show");
  }

  if (mNext) {
    mNext.onclick = function() {
      closeModal();
      if (typeof onNextHandler === "function") onNextHandler();
    };
  }
  if (mAgain) {
    mAgain.onclick = function() {
      closeModal();
      if (typeof onAgainHandler === "function") onAgainHandler();
    };
  }
  if (mBackHub) {
    mBackHub.onclick = function() {
      closeModal();
      switchView("hub");
    };
  }

  // Modal Bantuan
  var helpModal = document.getElementById("helpModal");
  var helpContent = document.getElementById("helpContent");
  var helpCloseBtn = document.getElementById("helpCloseBtn");

  var HELP_TEXTS = {
    cards: {
      title: "Cara Bermain: Kartu Kembar",
      body: "<h4>🎯 Fokus: Memori Visual & Asosiatif</h4>" +
            "<ul>" +
            "<li>Di awal ronde, kartu akan terbuka selama beberapa detik. <b>Hafalkan posisi gambarnya!</b></li>" +
            "<li>Setelah kartu menutup kembali, klik 2 kartu untuk mencocokkan gambar yang sama.</li>" +
            "<li>Jika cocok, kartu tetap terbuka. Jika salah, kartu menutup kembali.</li>" +
            "<li>Selesaikan sebelum waktu 120 detik habis untuk meraih skor tertinggi!</li>" +
            "</ul>" +
            "<h4>💡 Manfaat Kognitif:</h4>" +
            "<p>Melatih hippocampus dalam mengingat letak objek visual dan asosiasi pola.</p>"
    },
    matrix: {
      title: "Cara Bermain: Matriks Spasial",
      body: "<h4>🎯 Fokus: Memori Spasial (Ruang & Lokasi)</h4>" +
            "<ul>" +
            "<li>Tekan <b>'Mulai Ronde'</b>. Beberapa kotak dalam grid akan menyala ungu berkilau selama 1.5 detik.</li>" +
            "<li>Hafalkan koordinat kotak-kotak yang tadi menyala!</li>" +
            "<li>Setelah kotak netral kembali, klik kotak-kotak yang benar.</li>" +
            "<li>Kamu memiliki 3 kesempatan (nyawa). Jika semua kotak target tertebak, level akan meningkat dengan grid yang lebih menantang!</li>" +
            "</ul>" +
            "<h4>💡 Manfaat Kognitif:</h4>" +
            "<p>Mengasah memori kerja visual-spasial yang penting untuk navigasi, membaca peta, dan konsentrasi spasial.</p>"
    },
    simon: {
      title: "Cara Bermain: Urutan Simon",
      body: "<h4>🎯 Fokus: Memori Sekuensial & Auditori</h4>" +
            "<ul>" +
            "<li>Perhatikan 4 tombol warna: Pink, Biru, Hijau, dan Emas.</li>" +
            "<li>Komputer akan membunyikan dan menyalakan tombol secara berurutan.</li>" +
            "<li>Setelah komputer selesai, tirukan urutan tersebut dengan menekan warna yang sama persis.</li>" +
            "<li>Setiap kali kamu berhasil, urutan akan bertambah 1 langkah lebih panjang!</li>" +
            "</ul>" +
            "<h4>💡 Manfaat Kognitif:</h4>" +
            "<p>Melatih working memory dalam mengingat rangkaian instruksi bertahap dan ritme auditori.</p>"
    },
    digit: {
      title: "Cara Bermain: Rentang Angka",
      body: "<h4>🎯 Fokus: Short-Term Working Memory (Phonological Loop)</h4>" +
            "<ul>" +
            "<li>Tes ini adalah standar internasional tes memori psikologi (Digit Span Test).</li>" +
            "<li>Angka akan berkedip satu per satu di layar. Hafalkan urutan angkanya!</li>" +
            "<li>Setelah selesai, ketikkan kembali angka yang kamu ingat melalui keypad layar atau keyboard fisik.</li>" +
            "<li><b>Mode Mundur:</b> Tantangan ekstra! Masukkan angka dari belakang ke depan untuk melatih manipulasi kognitif tingkat lanjut.</li>" +
            "<li>Panjang digit bertambah +1 setiap tebakan benar. Kamu punya 3 nyawa.</li>" +
            "</ul>" +
            "<h4>💡 Manfaat Kognitif:</h4>" +
            "<p>Mengukur dan melipatgandakan kapasitas memori jangka pendek aktif di otak depan (prefrontal cortex).</p>"
    },
    verbal: {
      title: "Cara Bermain: Memori Kata",
      body: "<h4>🎯 Fokus: Memori Pengenalan Verbal</h4>" +
            "<ul>" +
            "<li>Sebuah kata bahasa Indonesia akan muncul di layar.</li>" +
            "<li>Tentukan: apakah kata ini <b>'KATA BARU'</b> (belum pernah muncul di sesi ini) atau <b>'SUDAH PERNAH'</b> (sudah pernah muncul sebelumnya).</li>" +
            "<li>Setiap jawaban benar memberimu +1 poin.</li>" +
            "<li>Kamu punya 3 nyawa. Tantangan ini menguji seberapa kuat ingatanmu membedakan informasi baru vs informasi lampau.</li>" +
            "</ul>" +
            "<h4>💡 Manfaat Kognitif:</h4>" +
            "<p>Melatih memori semantik verbal dan melatih otak agar tidak mudah terkecoh oleh distorsi ingatan (interferensi proaktif).</p>"
    }
  };

  document.querySelectorAll(".btn-help").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var g = this.getAttribute("data-game");
      if (HELP_TEXTS[g]) {
        document.getElementById("helpTitle").textContent = HELP_TEXTS[g].title;
        helpContent.innerHTML = HELP_TEXTS[g].body;
        helpModal.classList.add("show");
        playClick();
      }
    });
  });

  function closeHelpModal() {
    if (helpModal) helpModal.classList.remove("show");
  }
  if (helpCloseBtn) helpCloseBtn.onclick = closeHelpModal;

  // ========================================================
  // 6. GAME 1: KARTU KEMBAR (Visual & Associative Memory)
  // Mempertahankan kompatibilitas logika asli & localStorage
  // ========================================================
  var CARD_LEVELS = [
    {n:2, p:2000},
    {n:3, p:3000},
    {n:4, p:4000},
    {n:5, p:5000},
    {n:6, p:6000},
    {n:7, p:8000}
  ];
  var CARD_EMOJIS = ["🐶","🐱","🦊","🐼","🐸","🐙","🦋","🍓","🍉","🚀","🎈","🍩","🐵","🦁","🐯","🐰","🐨","🐢","🍎","🍌","🍒","🍕","⚽","🎸"];
  var CARD_DURATION = 120;

  var boardEl = document.getElementById("board");
  var timeEl = document.getElementById("time");
  var movesEl = document.getElementById("moves");
  var pairsEl = document.getElementById("pairs");
  var bestEl = document.getElementById("best");
  var fillEl = document.getElementById("fill");
  var stTime = document.getElementById("stTime");
  var hintEl = document.getElementById("hint");

  var cardLevel = 0, cardFirst = null, cardLock = false, cardMoves = 0, cardMatched = 0, cardTotal = 0;
  var cardLeft = CARD_DURATION, cardTimer = null, cardStarted = false, cardOver = false, cardRunId = 0;

  function cardKey(i){ return "kartu-kembar-best-" + i; }
  function fmtTime(s){ var m = Math.floor(s/60), r = s % 60; return m + ":" + (r < 10 ? "0" : "") + r; }
  function shuffleArr(a){
    for (var i = a.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function calcBoardSize(n){
    return Math.min(window.innerWidth * 0.94, 460, window.innerHeight * 0.58) / n;
  }

  function buildCardLevelButtons(){
    var box = document.getElementById("levels");
    if (!box) return;
    box.innerHTML = "";
    CARD_LEVELS.forEach(function(l, i){
      var b = document.createElement("button");
      b.className = "lv";
      b.textContent = "Level " + (i + 1) + " (" + l.n + "×" + l.n + ")";
      b.setAttribute("aria-pressed", i === cardLevel ? "true" : "false");
      b.onclick = function(){
        playClick();
        cardLevel = i;
        startCards();
      };
      box.appendChild(b);
    });
  }

  function stopCardsTimer() {
    clearInterval(cardTimer);
    cardTimer = null;
    cardRunId++;
  }

  function startCards(){
    stopCardsTimer();
    var id = ++cardRunId;
    cardFirst = null; cardLock = true; cardMoves = 0; cardMatched = 0;
    cardLeft = CARD_DURATION; cardStarted = false; cardOver = false;

    var n = CARD_LEVELS[cardLevel].n;
    var cells = n * n;
    var odd = cells % 2 === 1;
    var pairs = Math.floor(cells / 2);
    cardTotal = pairs;

    var pool = shuffleArr(CARD_EMOJIS.slice()).slice(0, pairs);
    var deck = shuffleArr(pool.concat(pool));
    if (odd) deck.splice((cells - 1) / 2, 0, null);

    boardEl.style.setProperty("--n", n);
    boardEl.style.setProperty("--sz", calcBoardSize(n) + "px");
    boardEl.innerHTML = "";

    deck.forEach(function(v){
      if (v === null){
        var d = document.createElement("div");
        d.className = "free";
        d.textContent = "⭐";
        d.setAttribute("aria-label", "Kotak bebas");
        boardEl.appendChild(d);
        return;
      }
      var c = document.createElement("button");
      c.className = "card open";
      c.dataset.v = v;
      c.setAttribute("aria-label", "Kartu " + v);
      c.innerHTML = '<span class="in"><span class="b"></span><span class="f">' + v + '</span></span>';
      c.onclick = function(){ flipCard(c); };
      boardEl.appendChild(c);
    });

    buildCardLevelButtons();
    var b = getBestScore(cardKey(cardLevel));
    bestEl.textContent = b ? b : "–";
    updateCardHud();

    // Fase Mengintip di Awal
    hintEl.textContent = "Hafalkan posisi kartunya dulu...";
    setTimeout(function(){
      if (id !== cardRunId) return;
      var cards = boardEl.querySelectorAll(".card");
      for (var i = 0; i < cards.length; i++){
        cards[i].classList.remove("open");
        cards[i].setAttribute("aria-label", "Kartu tertutup");
      }
      cardLock = false;
      hintEl.textContent = "Cari dua kartu bergambar sama. Waktu mulai saat kartu pertama dibuka.";
    }, CARD_LEVELS[cardLevel].p);
  }

  function updateCardHud(){
    timeEl.textContent = fmtTime(cardLeft);
    movesEl.textContent = cardMoves;
    pairsEl.textContent = cardMatched + "/" + cardTotal;
    fillEl.style.width = (cardLeft / CARD_DURATION * 100) + "%";
    fillEl.style.background = cardLeft <= 20 ? "var(--warn)" : (cardLeft <= 60 ? "var(--gold)" : "var(--ok)");
    stTime.classList.toggle("low", cardLeft <= 20);
  }

  function cardTick(){
    cardLeft--;
    updateCardHud();
    if (cardLeft <= 0){
      finishCards(false);
    }
  }

  function flipCard(c){
  if (cardLock || cardOver || c.classList.contains("open") || c.classList.contains("done")) return;
  playFlip();

  if (!cardStarted){
    cardStarted = true;
    cardTimer = setInterval(cardTick, 1000);
    incrementPlays();
    hintEl.textContent = "Cari dua kartu bergambar sama.";
  }

  c.classList.add("open");
  c.setAttribute("aria-label", "Kartu " + c.dataset.v);

  if (!cardFirst){
    cardFirst = c;
    return;
  }

  cardMoves++;
  var a = cardFirst;
  cardFirst = null;

  if (a.dataset.v === c.dataset.v){
    playMatch();
    a.classList.add("done"); 
    c.classList.add("done");
    cardMatched++;
    updateCardHud();
    if (cardMatched === cardTotal) finishCards(true);
  } else {
    cardLock = true;
    updateCardHud();
    var id = cardRunId;
    a.classList.add("wrong"); 
    c.classList.add("wrong");
    playWrong();
    setTimeout(function(){
      if (id !== cardRunId) return;
      a.classList.remove("open", "wrong");
      c.classList.remove("open", "wrong");
      a.setAttribute("aria-label", "Kartu tertutup");
      c.setAttribute("aria-label", "Kartu tertutup");
      cardLock = false;
    }, 750);
  }
}

  function finishCards(win){
    stopCardsTimer();
    cardOver = true;
    var score = win ? Math.max(0, cardTotal * 100 + cardLeft * 10 - cardMoves * 5) : 0;
    var prev = getBestScore(cardKey(cardLevel));
    var isNew = win && score > prev;
    if (isNew){
      setBestScore(cardKey(cardLevel), score);
      bestEl.textContent = score;
    }

    var hasNext = win && cardLevel < CARD_LEVELS.length - 1;

    showResultModal({
      isWin: win,
      isNewRecord: isNew,
      title: win ? (isNew && prev > 0 ? "Rekor Baru Kartu Kembar!" : "Level Selesai!") : "Waktu Habis!",
      subtitle: win ? ("Berhasil dalam " + cardMoves + " langkah, sisa waktu " + fmtTime(cardLeft) + ".") : ("Baru menemukan " + cardMatched + " dari " + cardTotal + " pasangan."),
      scoreText: win ? score + " Poin" : "Coba Lagi",
      bestText: prev > 0 && !isNew ? ("Skor tertinggi sebelumnya: " + prev) : (isNew && prev > 0 ? ("Mengalahkan rekor lama: " + prev) : (win ? "Ini rekor pertamamu di level ini!" : "")),
      hasNext: hasNext,
      onNext: function(){
        cardLevel++;
        startCards();
      },
      onAgain: function(){
        startCards();
      }
    });
  }

  function initCards() {
    startCards();
  }

  window.addEventListener("resize", function(){
    if (currentView === "cards" && boardEl && CARD_LEVELS[cardLevel]) {
      boardEl.style.setProperty("--sz", calcBoardSize(CARD_LEVELS[cardLevel].n) + "px");
    }
  });

  // ========================================================
  // 7. GAME 2: MATRIKS SPASIAL (Spatial Working Memory)
  // Menghafal pola posisi kotak di dalam grid berkedip
  // ========================================================
  var matrixBoard = document.getElementById("matrixBoard");
  var matLevelEl = document.getElementById("matLevel");
  var matTargetLeftEl = document.getElementById("matTargetLeft");
  var matLivesEl = document.getElementById("matLives");
  var matBestEl = document.getElementById("matBest");
  var matHintEl = document.getElementById("matHint");
  var matStartBtn = document.getElementById("matStartBtn");
  var matFill = document.getElementById("matFill");

  var matLevel = 1;
  var matLives = 3;
  var matTargets = [];
  var matFoundCount = 0;
  var matLock = true;
  var matRunId = 0;
  var matSessionStarted = false;

  var MATRIX_CONFIG = [
    { cols: 3, targets: 3, peekMs: 1400 }, // Lv 1
    { cols: 3, targets: 4, peekMs: 1400 }, // Lv 2
    { cols: 4, targets: 4, peekMs: 1500 }, // Lv 3
    { cols: 4, targets: 5, peekMs: 1500 }, // Lv 4
    { cols: 4, targets: 6, peekMs: 1600 }, // Lv 5
    { cols: 5, targets: 6, peekMs: 1700 }, // Lv 6
    { cols: 5, targets: 7, peekMs: 1700 }, // Lv 7
    { cols: 5, targets: 8, peekMs: 1800 }, // Lv 8
    { cols: 5, targets: 9, peekMs: 1900 }, // Lv 9
    { cols: 6, targets: 10, peekMs: 2100 }  // Lv 10+
  ];

  function getMatrixConfig(lvl) {
    if (lvl <= MATRIX_CONFIG.length) return MATRIX_CONFIG[lvl - 1];
    var last = MATRIX_CONFIG[MATRIX_CONFIG.length - 1];
    return {
      cols: 6,
      targets: Math.min(18, last.targets + (lvl - MATRIX_CONFIG.length)),
      peekMs: 2200
    };
  }

  function updateMatrixHud() {
    matLevelEl.textContent = matLevel;
    var needed = matTargets.length - matFoundCount;
    matTargetLeftEl.textContent = Math.max(0, needed);
    var hearts = "";
    for (var i = 0; i < 3; i++) hearts += (i < matLives ? "❤️" : "🖤");
    matLivesEl.textContent = hearts;
    var b = getBestScore("braintec_matrix_best");
    matBestEl.textContent = b ? "Lv " + b : "–";
  }

  function stopMatrix() {
    matRunId++;
    matLock = true;
  }

  function initMatrix() {
    matLevel = 1;
    matLives = 3;
    matSessionStarted = false;
    updateMatrixHud();
    matHintEl.textContent = "Tekan 'Mulai Ronde' untuk memulai tes memori spasial.";
    matStartBtn.style.display = "";
    matrixBoard.innerHTML = "";
    var cfg = getMatrixConfig(matLevel);
    matrixBoard.style.setProperty("--cols", cfg.cols);
    for (var i = 0; i < cfg.cols * cfg.cols; i++) {
      var t = document.createElement("div");
      t.className = "mat-tile";
      matrixBoard.appendChild(t);
    }
  }

  function startMatrixRound() {
    var id = ++matRunId;
    matLock = true;
    matFoundCount = 0;
    matStartBtn.style.display = "none";
    if (!matSessionStarted) {
      matSessionStarted = true;
      incrementPlays();
    }
    updateMatrixHud();

    var cfg = getMatrixConfig(matLevel);
    var totalTiles = cfg.cols * cfg.cols;
    matrixBoard.style.setProperty("--cols", cfg.cols);
    matrixBoard.innerHTML = "";

    // Pilih ubin target secara acak
    var indices = [];
    for (var i = 0; i < totalTiles; i++) indices.push(i);
    shuffleArr(indices);
    matTargets = indices.slice(0, cfg.targets);

    var tiles = [];
    for (var j = 0; j < totalTiles; j++) {
      var tile = document.createElement("button");
      tile.className = "mat-tile";
      tile.dataset.idx = j;
      tiles.push(tile);
      matrixBoard.appendChild(tile);
    }

    // Fase Mengintip (Target menyala ungu berkilau)
    matHintEl.textContent = "Hafalkan posisi " + cfg.targets + " kotak yang menyala!";
    if (matFill) {
      matFill.style.transition = "none";
      matFill.style.width = "100%";
      setTimeout(function(){
        matFill.style.transition = "width " + (cfg.peekMs / 1000) + "s linear";
        matFill.style.width = "0%";
      }, 20);
    }

    matTargets.forEach(function(idx) {
      tiles[idx].classList.add("active-peek");
      tiles[idx].textContent = "✨";
    });

    setTimeout(function() {
      if (id !== matRunId) return;
      tiles.forEach(function(t) {
        t.classList.remove("active-peek");
        t.textContent = "";
        t.onclick = function() { onMatrixTileClick(t, parseInt(t.dataset.idx, 10)); };
      });
      matLock = false;
      matHintEl.textContent = "Klik kotak yang tadi menyala!";
    }, cfg.peekMs);
  }

  function onMatrixTileClick(tile, idx) {
    if (matLock || tile.classList.contains("found") || tile.classList.contains("wrong")) return;

    var isTarget = matTargets.indexOf(idx) !== -1;
    if (isTarget) {
      playMatch();
      tile.classList.add("found");
      tile.textContent = "⭐";
      matFoundCount++;
      updateMatrixHud();

      if (matFoundCount === matTargets.length) {
        // Berhasil menyelesaikan ronde!
        matLock = true;
        playLevelUp();
        matHintEl.textContent = "Bagus sekali! Semua kotak ditemukan.";

        var prevBest = getBestScore("braintec_matrix_best");
        if (matLevel > prevBest) {
          setBestScore("braintec_matrix_best", matLevel);
        }

        setTimeout(function() {
          matLevel++;
          startMatrixRound();
        }, 800);
      }
    } else {
      // Salah klik!
      playWrong();
      tile.classList.add("wrong");
      tile.textContent = "✖";
      matLives--;
      updateMatrixHud();

      if (matLives <= 0) {
        // Game Over! Tunjukkan kotak target yang belum tertebak
        matLock = true;
        matTargets.forEach(function(tIdx) {
          var t = matrixBoard.children[tIdx];
          if (t && !t.classList.contains("found")) {
            t.classList.add("active-peek");
            t.textContent = "✨";
          }
        });

        var best = getBestScore("braintec_matrix_best");
        var isNew = matLevel > best;
        if (isNew) setBestScore("braintec_matrix_best", matLevel);

        setTimeout(function() {
          showResultModal({
            isWin: false,
            isNewRecord: isNew,
            title: isNew ? "Rekor Matriks Baru!" : "Kesempatan Habis",
            subtitle: "Kamu berhasil mencapai Level " + matLevel + "!",
            scoreText: "Level " + matLevel,
            bestText: isNew ? "Rekor level terbaik baru tercapai!" : ("Rekor terbaik sebelumnya: Level " + best),
            hasNext: false,
            onAgain: function() {
              initMatrix();
              startMatrixRound();
            }
          });
        }, 1100);
      }
    }
  }

  if (matStartBtn) matStartBtn.onclick = startMatrixRound;

  // ========================================================
  // 8. GAME 3: URUTAN SIMON (Sequential & Auditory-Visual)
  // Menghafal urutan nada & warna yang terus bertambah
  // ========================================================
  var simonScoreEl = document.getElementById("simonScore");
  var simonStatusEl = document.getElementById("simonStatus");
  var simonBestEl = document.getElementById("simonBest");
  var simonCenterScoreEl = document.getElementById("simonCenterScore");
  var simonHintEl = document.getElementById("simonHint");
  var simonStartBtn = document.getElementById("simonStartBtn");

  var simonSequence = [];
  var simonStep = 0;
  var simonPlaying = false;
  var simonLock = true;
  var simonRunId = 0;

  function updateSimonHud() {
    var score = Math.max(0, simonSequence.length - 1);
    simonScoreEl.textContent = score;
    simonCenterScoreEl.textContent = score;
    var b = getBestScore("braintec_simon_best");
    simonBestEl.textContent = b ? b + " langkah" : "–";
  }

  function stopSimon() {
    simonRunId++;
    simonLock = true;
    simonPlaying = false;
  }

  function initSimon() {
    stopSimon();
    simonSequence = [];
    simonStep = 0;
    updateSimonHud();
    simonStatusEl.textContent = "Siap";
    simonHintEl.textContent = "Tekan 'Mulai Permainan' untuk melihat urutan warna dan nada!";
    simonStartBtn.style.display = "";
  }

  function flashSimonPad(idx, duration, callback) {
    var pad = document.getElementById("pad-" + idx);
    if (!pad) return;
    pad.classList.add("lit");
    playSimonNote(idx);
    setTimeout(function() {
      pad.classList.remove("lit");
      if (typeof callback === "function") callback();
    }, duration || 360);
  }

  function startSimonGame() {
    var id = ++simonRunId;
    incrementPlays();
    simonSequence = [];
    simonStep = 0;
    simonStartBtn.style.display = "none";
    addSimonStep();
  }

  function addSimonStep() {
    simonSequence.push(Math.floor(Math.random() * 4));
    simonStep = 0;
    updateSimonHud();
    playSimonSequence();
  }

  function playSimonSequence() {
    var id = simonRunId;
    simonLock = true;
    simonStatusEl.textContent = "Menyimak...";
    simonHintEl.textContent = "Perhatikan urutan kedipan dan bunyinya...";

    var i = 0;
    // Semakin panjang urutan, jeda sedikit lebih cepat
    var speed = Math.max(240, 480 - simonSequence.length * 15);
    var pause = Math.max(100, 160 - simonSequence.length * 5);

    function nextNote() {
      if (id !== simonRunId) return;
      if (i < simonSequence.length) {
        flashSimonPad(simonSequence[i], speed, function() {
          i++;
          setTimeout(nextNote, pause);
        });
      } else {
        simonLock = false;
        simonStatusEl.textContent = "Giliranmu!";
        simonHintEl.textContent = "Giliranmu! Tekan tombol sesuai urutan tadi.";
      }
    }
    setTimeout(nextNote, 400);
  }

  function onSimonPadPress(idx) {
    if (simonLock) return;
    flashSimonPad(idx, 220);

    if (idx === simonSequence[simonStep]) {
      simonStep++;
      if (simonStep === simonSequence.length) {
        // Berhasil menuntaskan urutan ronde ini!
        simonLock = true;
        simonStatusEl.textContent = "Hebat!";
        playMatch();

        var currentScore = simonSequence.length;
        var prevBest = getBestScore("braintec_simon_best");
        if (currentScore > prevBest) {
          setBestScore("braintec_simon_best", currentScore);
          updateSimonHud();
        }

        setTimeout(function() {
          addSimonStep();
        }, 850);
      }
    } else {
      // Salah urutan! Game Over!
      simonLock = true;
      simonStatusEl.textContent = "Salah!";
      playWrong();

      var finalScore = Math.max(0, simonSequence.length - 1);
      var prevBest = getBestScore("braintec_simon_best");
      var isNew = finalScore > prevBest;
      if (isNew) setBestScore("braintec_simon_best", finalScore);

      setTimeout(function() {
        showResultModal({
          isWin: false,
          isNewRecord: isNew,
          title: isNew ? "Rekor Simon Baru!" : "Urutan Terputus!",
          subtitle: "Kamu berhasil mengingat " + finalScore + " urutan warna berturut-turut!",
          scoreText: finalScore + " Urutan",
          bestText: isNew ? "Rekor ingatan urutan terpanjang baru!" : ("Rekor sebelumnya: " + prevBest + " urutan"),
          hasNext: false,
          onAgain: function() {
            initSimon();
            startSimonGame();
          }
        });
      }, 700);
    }
  }

  for (var pi = 0; pi < 4; pi++) {
    (function(idx){
      var pad = document.getElementById("pad-" + idx);
      if (pad) {
        pad.addEventListener("click", function() {
          onSimonPadPress(idx);
        });
      }
    })(pi);
  }

  if (simonStartBtn) simonStartBtn.onclick = startSimonGame;

  // ========================================================
  // 9. GAME 4: RENTANG ANGKA (Digit Span Test)
  // Tes standar psikologi: Short-Term Working Memory
  // ========================================================
  var modeForwardBtn = document.getElementById("modeForward");
  var modeReverseBtn = document.getElementById("modeReverse");
  var digitLengthEl = document.getElementById("digitLength");
  var digitLivesEl = document.getElementById("digitLives");
  var digitBestEl = document.getElementById("digitBest");
  var digitDisplay = document.getElementById("digitDisplay");
  var digitInputPanel = document.getElementById("digitInputPanel");
  var digitBigText = document.getElementById("digitBigText");
  var digitDots = document.getElementById("digitDots");
  var digitUserInput = document.getElementById("digitUserInput");
  var digitHintEl = document.getElementById("digitHint");
  var digitStartBtn = document.getElementById("digitStartBtn");
  var digitSubmitBtn = document.getElementById("digitSubmitBtn");

  var isReverseMode = false;
  var digitCurrentLength = 3;
  var digitLives = 3;
  var digitCurrentSeq = [];
  var digitEnteredStr = "";
  var digitRunId = 0;
  var digitLock = true;
  var digitSessionStarted = false;

  function updateDigitHud() {
    digitLengthEl.textContent = digitCurrentLength;
    var hearts = "";
    for (var i = 0; i < 3; i++) hearts += (i < digitLives ? "❤️" : "🖤");
    digitLivesEl.textContent = hearts;
    var b = getBestScore("braintec_digit_best");
    digitBestEl.textContent = b ? b + " digit" : "–";
  }

  function stopDigit() {
    digitRunId++;
    digitLock = true;
  }

  function initDigit() {
    stopDigit();
    digitCurrentLength = 3;
    digitLives = 3;
    digitEnteredStr = "";
    digitSessionStarted = false;
    updateDigitHud();
    digitDisplay.style.display = "";
    digitInputPanel.style.display = "none";
    digitBigText.textContent = "?";
    digitDots.innerHTML = "";
    digitHintEl.textContent = isReverseMode
      ? "Mode Mundur: Hafalkan lalu masukkan angka dari BELAKANG ke DEPAN."
      : "Mode Maju: Hafalkan angka yang muncul lalu masukkan sesuai urutan.";
    digitStartBtn.style.display = "";
  }

  if (modeForwardBtn && modeReverseBtn) {
    modeForwardBtn.onclick = function() {
      playClick();
      isReverseMode = false;
      modeForwardBtn.classList.add("active");
      modeReverseBtn.classList.remove("active");
      initDigit();
    };
    modeReverseBtn.onclick = function() {
      playClick();
      isReverseMode = true;
      modeReverseBtn.classList.add("active");
      modeForwardBtn.classList.remove("active");
      initDigit();
    };
  }

  function startDigitRound() {
    var id = ++digitRunId;
    digitLock = true;
    digitEnteredStr = "";
    digitStartBtn.style.display = "none";
    if (!digitSessionStarted) {
      digitSessionStarted = true;
      incrementPlays();
    }
    digitDisplay.style.display = "";
    digitInputPanel.style.display = "none";
    digitBigText.textContent = "Siap...";
    digitHintEl.textContent = "Perhatikan layar, angka akan muncul bergantian!";
    updateDigitHud();

    // Buat urutan angka acak sepanjang digitCurrentLength
    digitCurrentSeq = [];
    for (var i = 0; i < digitCurrentLength; i++) {
      digitCurrentSeq.push(Math.floor(Math.random() * 10)); // 0-9
    }

    // Bangun titik progress
    digitDots.innerHTML = "";
    for (var j = 0; j < digitCurrentLength; j++) {
      var dot = document.createElement("div");
      dot.className = "digit-dot";
      digitDots.appendChild(dot);
    }

    var step = 0;
    setTimeout(function showNextDigit() {
      if (id !== digitRunId) return;
      if (step < digitCurrentLength) {
        var num = digitCurrentSeq[step];
        digitBigText.textContent = num;
        digitBigText.classList.remove("pop-num");
        void digitBigText.offsetWidth; // trigger reflow
        digitBigText.classList.add("pop-num");
        playTone(440 + num * 30, "sine", 0.12, 0.15);

        if (digitDots.children[step]) {
          digitDots.children[step].classList.add("active");
        }

        step++;
        // Tampilkan angka selama 850ms, jeda 200ms
        setTimeout(function() {
          if (id !== digitRunId) return;
          digitBigText.textContent = "";
          setTimeout(showNextDigit, 200);
        }, 850);
      } else {
        // Selesai menampilkan angka, buka fase input!
        digitDisplay.style.display = "none";
        digitInputPanel.style.display = "";
        digitEnteredStr = "";
        refreshDigitUserInput();
        digitLock = false;
        digitHintEl.textContent = isReverseMode
          ? "Masukkan angka secara TERBALIK (dari digit terakhir ke pertama)!"
          : "Masukkan deretan angka tadi secara berurutan!";
      }
    }, 900);
  }

  function refreshDigitUserInput() {
    if (!digitEnteredStr) {
      digitUserInput.textContent = "_ ".repeat(digitCurrentLength).trim();
    } else {
      var s = digitEnteredStr.split("").join(" ");
      var rem = digitCurrentLength - digitEnteredStr.length;
      if (rem > 0) s += " " + "_ ".repeat(rem).trim();
      digitUserInput.textContent = s;
    }
  }

  function appendDigitKey(k) {
    if (digitLock) return;
    if (k === "BS") {
      playClick();
      digitEnteredStr = digitEnteredStr.slice(0, -1);
      refreshDigitUserInput();
    } else if (k === "C") {
      playClick();
      digitEnteredStr = "";
      refreshDigitUserInput();
    } else {
      if (digitEnteredStr.length < digitCurrentLength) {
        playTone(380 + parseInt(k, 10) * 25, "sine", 0.08, 0.12);
        digitEnteredStr += k;
        refreshDigitUserInput();
      }
    }
  }

  function submitDigitAnswer() {
    if (digitLock || digitEnteredStr.length === 0) return;
    digitLock = true;

    var expectedSeq = isReverseMode
      ? digitCurrentSeq.slice().reverse()
      : digitCurrentSeq.slice();
    var expectedStr = expectedSeq.join("");

    if (digitEnteredStr === expectedStr) {
      // Benar!
      playMatch();
      digitHintEl.textContent = "Tepat sekali! Luar biasa.";

      var prevBest = getBestScore("braintec_digit_best");
      if (digitCurrentLength > prevBest) {
        setBestScore("braintec_digit_best", digitCurrentLength);
        updateDigitHud();
      }

      setTimeout(function() {
        digitCurrentLength++;
        startDigitRound();
      }, 900);
    } else {
      // Salah!
      playWrong();
      digitLives--;
      updateDigitHud();
      digitHintEl.textContent = "Kurang tepat! Yang benar: " + expectedStr + " (jawabanmu: " + digitEnteredStr + ")";

      if (digitLives <= 0) {
        var achieved = Math.max(0, digitCurrentLength - 1);
        var prevBest = getBestScore("braintec_digit_best");
        var isNew = achieved > prevBest;
        if (isNew) setBestScore("braintec_digit_best", achieved);

        setTimeout(function() {
          showResultModal({
            isWin: false,
            isNewRecord: isNew,
            title: isNew ? "Rekor Digit Baru!" : "Tes Selesai!",
            subtitle: "Daya ingat rentang digitmu mencapai " + achieved + " digit!",
            scoreText: achieved + " Digit",
            bestText: isNew ? "Rekor rentang digit terbaik baru!" : ("Rekor sebelumnya: " + prevBest + " digit"),
            hasNext: false,
            onAgain: function() {
              initDigit();
              startDigitRound();
            }
          });
        }, 1200);
      } else {
        setTimeout(function() {
          startDigitRound();
        }, 1800);
      }
    }
  }

  // Event Numpad
  document.querySelectorAll(".num-key").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var k = this.getAttribute("data-k");
      appendDigitKey(k);
    });
  });

  if (digitSubmitBtn) digitSubmitBtn.onclick = submitDigitAnswer;
  if (digitStartBtn) digitStartBtn.onclick = startDigitRound;

  // Keyboard Support untuk Game Digit
  window.addEventListener("keydown", function(e) {
    if (currentView !== "digit" || digitLock) return;
    if (e.key >= "0" && e.key <= "9") {
      appendDigitKey(e.key);
    } else if (e.key === "Backspace") {
      appendDigitKey("BS");
    } else if (e.key === "Enter") {
      submitDigitAnswer();
    }
  });

  // ========================================================
  // 10. GAME 5: MEMORI KATA (Verbal Recognition Memory)
  // Continuous Recognition Task: Baru vs Sudah Pernah
  // ========================================================
  var INDONESIAN_WORDS = [
    "Kucing", "Meja", "Bintang", "Gunung", "Mobil", "Pelangi", "Kopi", "Jendela", "Kereta",
    "Melati", "Sepatu", "Sungai", "Bulan", "Pohon", "Rumah", "Gitar", "Lentera", "Kelinci",
    "Pesawat", "Danau", "Pantai", "Matahari", "Cermin", "Kamera", "Buku", "Lampu", "Cincin",
    "Jam", "Roti", "Payung", "Sepeda", "Kunci", "Bantal", "Sendok", "Piring", "Kupu-kupu",
    "Gelas", "Topi", "Tas", "Jaket", "Kertas", "Pensil", "Komputer", "Telepon", "Boneka",
    "Bunga", "Singa", "Gajah", "Harimau", "Lumba-lumba", "Elang", "Burung", "Merpati",
    "Angin", "Awan", "Hujan", "Salju", "Batu", "Pasir", "Lembah", "Hutan", "Air Terjun",
    "Pulau", "Samudra", "Kapal", "Perahu", "Bus", "Truk", "Becak", "Stasiun", "Bandara",
    "Pasar", "Toko", "Sekolah", "Taman", "Jembatan", "Menara", "Istana", "Candi", "Museum",
    "Lukisan", "Musik", "Biola", "Piano", "Terompet", "Drum", "Nyanyian", "Kue", "Cokelat",
    "Es Krim", "Keju", "Susu", "Madu", "Jeruk", "Apel", "Pisang", "Mangga", "Semangka",
    "Anggur", "Stroberi", "Nanas", "Kelapa", "Padi", "Jagung", "Mawar", "Anggrek", "Teratai",
    "Bambu", "Rumput", "Daun", "Akar", "Kristal", "Emas", "Perak", "Berlian", "Mutiara",
    "Kastil", "Mahkota", "Pedang", "Perisai", "Panah", "Kompas", "Peta", "Jangkar", "Roda",
    "Kancing", "Jarum", "Benang", "Gunting", "Kacamata", "Dompet", "Sabun", "Handuk",
    "Cangkir", "Garpu", "Pisau", "Wajan", "Panci", "Kompor", "Kulkas", "Kipas", "Radio"
  ];

  var verbalScoreEl = document.getElementById("verbalScore");
  var verbalLivesEl = document.getElementById("verbalLives");
  var verbalBestEl = document.getElementById("verbalBest");
  var verbalCounterEl = document.getElementById("verbalCounter");
  var verbalWordEl = document.getElementById("verbalWord");
  var verbalFeedbackEl = document.getElementById("verbalFeedback");
  var verbalActions = document.getElementById("verbalActions");
  var verbalBtnNew = document.getElementById("verbalBtnNew");
  var verbalBtnSeen = document.getElementById("verbalBtnSeen");
  var verbalHintEl = document.getElementById("verbalHint");
  var verbalStartBtn = document.getElementById("verbalStartBtn");

  var verbalScore = 0;
  var verbalLives = 3;
  var verbalTurn = 0;
  var verbalSeenWords = [];
  var verbalCurrentWord = "";
  var verbalIsWordSeen = false;
  var verbalLock = true;
  var verbalWordPool = [];

  function updateVerbalHud() {
    verbalScoreEl.textContent = verbalScore;
    var hearts = "";
    for (var i = 0; i < 3; i++) hearts += (i < verbalLives ? "❤️" : "🖤");
    verbalLivesEl.textContent = hearts;
    var b = getBestScore("braintec_verbal_best");
    verbalBestEl.textContent = b ? b + " kata" : "–";
  }

  function stopVerbal() {
    verbalLock = true;
  }

  function initVerbal() {
    stopVerbal();
    verbalScore = 0;
    verbalLives = 3;
    verbalTurn = 0;
    verbalSeenWords = [];
    verbalWordPool = shuffleArr(INDONESIAN_WORDS.slice());
    updateVerbalHud();
    verbalCounterEl.textContent = "Tantangan Memori Kata";
    verbalWordEl.textContent = "Siap?";
    verbalFeedbackEl.textContent = "";
    verbalActions.style.display = "none";
    verbalStartBtn.style.display = "";
    verbalHintEl.textContent = "Tentukan apakah kata yang muncul itu kata baru atau sudah pernah muncul!";
  }

  function startVerbalGame() {
    incrementPlays();
    verbalScore = 0;
    verbalLives = 3;
    verbalTurn = 0;
    verbalSeenWords = [];
    verbalWordPool = shuffleArr(INDONESIAN_WORDS.slice());
    verbalStartBtn.style.display = "none";
    verbalActions.style.display = "";
    updateVerbalHud();
    nextVerbalTurn();
  }

  function nextVerbalTurn() {
    verbalTurn++;
    verbalCounterEl.textContent = "Kata #" + verbalTurn;
    verbalFeedbackEl.textContent = "";
    verbalLock = false;

    // Menentukan apakah kata ini 'baru' atau 'pernah'
    // Di awal (turn 1-2), kata harus baru
    var pickSeen = false;
    if (verbalSeenWords.length >= 2 && Math.random() < 0.48) {
      pickSeen = true;
    }

    if (pickSeen) {
      // Ambil salah satu dari kata yang sudah pernah muncul
      verbalCurrentWord = verbalSeenWords[Math.floor(Math.random() * verbalSeenWords.length)];
      verbalIsWordSeen = true;
    } else {
      // Ambil kata baru dari pool kata
      if (verbalWordPool.length === 0) {
        verbalWordPool = shuffleArr(INDONESIAN_WORDS.slice());
      }
      verbalCurrentWord = verbalWordPool.pop();
      verbalIsWordSeen = false;
      verbalSeenWords.push(verbalCurrentWord);
    }

    verbalWordEl.textContent = verbalCurrentWord;
  }

  function handleVerbalChoice(choiceIsNew) {
    if (verbalLock) return;
    verbalLock = true;

    // Jawaban benar jika: (choiceIsNew && !verbalIsWordSeen) ATAU (!choiceIsNew && verbalIsWordSeen)
    var isCorrect = (choiceIsNew && !verbalIsWordSeen) || (!choiceIsNew && verbalIsWordSeen);

    if (isCorrect) {
      playMatch();
      verbalScore++;
      updateVerbalHud();
      verbalFeedbackEl.className = "verbal-feedback correct";
      verbalFeedbackEl.textContent = choiceIsNew
        ? "✔ Tepat! Kata ini baru pertama kali muncul."
        : "✔ Tepat! Kata ini sudah pernah muncul sebelumnya.";

      var prevBest = getBestScore("braintec_verbal_best");
      if (verbalScore > prevBest) {
        setBestScore("braintec_verbal_best", verbalScore);
        updateVerbalHud();
      }

      setTimeout(nextVerbalTurn, 650);
    } else {
      playWrong();
      verbalLives--;
      updateVerbalHud();
      verbalFeedbackEl.className = "verbal-feedback wrong";
      verbalFeedbackEl.textContent = verbalIsWordSeen
        ? "✖ Salah! Kata '" + verbalCurrentWord + "' SUDAH PERNAH muncul!"
        : "✖ Salah! Kata '" + verbalCurrentWord + "' adalah KATA BARU!";

      if (verbalLives <= 0) {
        var prevBest = getBestScore("braintec_verbal_best");
        var isNew = verbalScore > prevBest;
        if (isNew) setBestScore("braintec_verbal_best", verbalScore);

        setTimeout(function() {
          showResultModal({
            isWin: false,
            isNewRecord: isNew,
            title: isNew ? "Rekor Memori Kata Baru!" : "Permainan Berakhir",
            subtitle: "Daya ingat verbalmu berhasil mengenali " + verbalScore + " kata!",
            scoreText: verbalScore + " Kata",
            bestText: isNew ? "Rekor tertinggi baru berhasil dipecahkan!" : ("Rekor sebelumnya: " + prevBest + " kata"),
            hasNext: false,
            onAgain: function() {
              initVerbal();
              startVerbalGame();
            }
          });
        }, 1100);
      } else {
        setTimeout(nextVerbalTurn, 1000);
      }
    }
  }

  if (verbalBtnNew) {
    verbalBtnNew.onclick = function() {
      handleVerbalChoice(true);
    };
  }
  if (verbalBtnSeen) {
    verbalBtnSeen.onclick = function() {
      handleVerbalChoice(false);
    };
  }
  if (verbalStartBtn) verbalStartBtn.onclick = startVerbalGame;

  // ========================================================
  // 11. LATAR BELAKANG BINTANG JATUH
  // ========================================================
  function initAmbientStars() {
    var box = document.getElementById("stars");
    if (!box) return;
    box.innerHTML = "";
    var colors = ["#ff7eb6", "#6ec1ff", "#b388ff"];
    for (var i = 0; i < 28; i++) {
      var s = document.createElement("span");
      s.className = "star";
      s.textContent = "★";
      s.style.setProperty("--x", (Math.random() * 100) + "vw");
      s.style.setProperty("--s", (10 + Math.random() * 16) + "px");
      s.style.setProperty("--c", colors[i % 3]);
      s.style.setProperty("--d", (6 + Math.random() * 8) + "s");
      s.style.setProperty("--delay", (-Math.random() * 14) + "s");
      s.style.setProperty("--drift", (-8 + Math.random() * 16) + "vw");
      box.appendChild(s);
    }
  }

  // ========================================================
  // 12. INITIALIZATION ON LOAD
  // ========================================================
  initAmbientStars();
  refreshHubStats();

})();
