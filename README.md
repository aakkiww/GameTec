# 🧠 BrainTec - Arena Pelatihan Daya Ingat Manusia

Selamat datang di **BrainTec**! Proyek ini merupakan pengembangan tingkat lanjut dari web game *Kartu Kembar* (Memory Card Matching) menjadi sebuah **portal game edukasi kognitif interaktif** yang mengasah berbagai dimensi daya ingat manusia.

Proyek ini dibuat untuk tugas akademik/game edukasi (**Tugas Game Vika - GameTec**) dengan antarmuka yang modern, ramah pengguna, beranimasi halus, dan didukung efek suara audio sintetis murni (*Web Audio API*).

---

## 🌟 5 Game Pelatihan Daya Ingat

Setiap game dirancang khusus berdasarkan teori psikologi kognitif dan ilmu neurosains untuk mengasah fungsi memori yang berbeda:

### 1. 🃏 Kartu Kembar (*Visual & Associative Memory*)
* **Konsep Kognitif:** Mengingat letak objek visual dan membentuk asosiasi pasangan gambar.
* **Cara Main:**
  * Di awal ronde, semua kartu terbuka selama beberapa detik (*fase mengintip*). Hafalkan letaknya!
  * Setelah kartu menutup kembali, balik 2 kartu yang menurutmu bergambar sama.
  * Selesaikan sebelum waktu 120 detik habis.
* **Level:** Tersedia 6 level mulai dari grid 2×2 hingga 7×7.

---

### 2. ⚡ Matriks Spasial (*Spatial Working Memory*)
* **Konsep Kognitif:** Melatih kapasitas otak dalam memetakan posisi dan koordinat spasial (*Spatial Recall Test / Chimp Test*).
* **Cara Main:**
  * Tekan **"Mulai Ronde"**. Sejumlah kotak dalam grid akan berkedip ungu berkilau selama 1.5 detik.
  * Hafalkan koordinat kotak-kotak tersebut!
  * Setelah kotak kembali netral, klik kotak yang tadi menyala.
  * Pemain memiliki 3 kesempatan (nyawa ❤️❤️❤️). Jika semua kotak berhasil ditebak, level akan bertambah dengan grid yang semakin menantang (3×3, 4×4, 5×5, dst.).

---

### 3. 💡 Urutan Simon (*Sequential & Auditory-Visual Memory*)
* **Konsep Kognitif:** Mengingat instruksi berurutan, ritme waktu, dan asosiasi nada-warna (*Sequential Working Memory*).
* **Cara Main:**
  * Terdapat 4 tombol warna pastel: Merah Muda (*Pink - C4*), Biru (*Blue - E4*), Hijau Mint (*Green - G4*), dan Emas (*Gold - C5*).
  * Komputer akan menyalakan dan membunyikan tombol dalam urutan tertentu.
  * Tirukan urutan warna dan nada tersebut dengan tepat.
  * Setiap ronde sukses, urutan langkah bertambah 1 nada lebih panjang!

---

### 4. 🔢 Rentang Angka (*Short-Term Working Memory / Digit Span*)
* **Konsep Kognitif:** Standar internasional uji kapasitas memori jangka pendek (*Wechsler Digit Span Test*).
* **Cara Main:**
  * Angka berkedip satu demi satu di layar.
  * Setelah selesai, ketikkan urutan angka yang diingat melalui *numpad virtual* di layar atau *keyboard fisik* komputer.
  * **Pilihan Mode:**
    * **Mode Maju:** Masukkan angka dari awal ke akhir (standar).
    * **Mode Mundur (*Reverse*):** Masukkan angka dari belakang ke depan (melatih manipulasi kognitif tingkat lanjut).
  * Panjang digit bertambah setiap tebakan benar (mulai dari 3 digit hingga 10+ digit).

---

### 5. 📝 Memori Kata (*Verbal Continuous Recognition Memory*)
* **Konsep Kognitif:** Mengukur ketahanan memori verbal terhadap distorsi ingatan (*proactive interference*) dan mengenali informasi baru vs lama.
* **Cara Main:**
  * Sebuah kata bahasa Indonesia muncul di layar (dari bank 140+ kata).
  * Tentukan:
    * `[ 🆕 KATA BARU ]` jika kata tersebut baru pertama kali muncul pada sesi ini.
    * `[ 🔁 SUDAH PERNAH ]` jika kata tersebut sudah pernah muncul sebelumnya.
  * Pemain memiliki 3 nyawa. Setiap tebakan benar menambah skor ingatan verbal.

---

## 🎨 Fitur-Fitur Unggulan

1. **Dashboard & Peringkat Memori:**
   * Menampilkan ringkasan skor terbaik untuk kelima game.
   * Menghitung total skor kognitif dengan gelar peringkat memori: *Pemula*, *Pelajar Cerdas*, *Penjelajah Memori*, *Master Memori*, hingga *Jenius Kognitif 👑*.
2. **Efek Suara Sintetis (*Web Audio API*):**
   * Menghasilkan efek suara interaktif (klik, kartu terbalik, chime sukses, buzzer salah, dan nada Simon) langsung melalui kode program tanpa membutuhkan file audio eksternal. 100% bebas lag dan tidak ada kendala *file not found*!
   * Tombol *Mute/Unmute* (🔊 / 🔇) di pojok kanan atas.
3. **Efek Partikel Confetti:**
   * Animasi semburan confetti saat memecahkan rekor baru atau menyelesaikan level.
4. **Tema Gelap & Terang (*Dark/Light Mode*):**
   * Tombol pengalih tema (🌙 / ☀️) yang otomatis menyimpan preferensi pengguna.
5. **Animasi Latar Belakang Cantik:**
   * Gradasi pastel dinamis (*wave gradient*) dan taburan bintang jatuh (*falling stars*).
6. **Responsif Penuh (*Mobile & Desktop Friendly*):**
   * Nyaman dimainkan di laptop, tablet, maupun smartphone dengan target sentuhan yang ramah jari.

---

## 📁 Struktur File

```text
GameTec/
├── index.html       # Struktur HTML5 (Dashboard Beranda + 5 Tampilan Game + Modal)
├── style.css        # Desain visual, tema pastel/dark, tata letak grid responsif, animasi
├── script.js        # Logika 5 game, synthesizer audio, confetti, state manager
├── backup/          # Salinan aman file original game sebelumnya
└── README.md        # Dokumentasi lengkap proyek
```

---

## 🚀 Cara Menjalankan

Game ini dibuat dengan teknologi **murni Web Standar (HTML5, CSS3, Vanilla JavaScript)** tanpa memerlukan instalasi Node.js, server lokal, atau dependensi eksternal.

1. Buka folder `GameTec`.
2. Klik dua kali pada file `index.html`.
3. Game akan langsung terbuka dan berjalan sempurna di Google Chrome, Microsoft Edge, Mozilla Firefox, Safari, atau browser modern lainnya!
