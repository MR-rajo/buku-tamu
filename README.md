# 📚 Buku Tamu Digital - HUT Yayasan

Aplikasi web Buku Tamu Digital yang dibangun dengan **Node.js, Express, EJS, dan Tailwind CSS**. Aplikasi ini memiliki antarmuka publik untuk pengisian data tamu dan dashboard admin yang aman untuk pengelolaan data.

## ✨ Fitur

### 🌐 Modul Publik

- ✅ Form pengisian buku tamu yang responsif dan modern
- ✅ Dropdown asal sekolah dari database
- ✅ Validasi form real-time
- ✅ Notifikasi sukses/error yang elegan
- ✅ Halaman konfirmasi setelah submit

### 🔐 Modul Admin

- ✅ Sistem login dengan autentikasi bcrypt
- ✅ Dashboard dengan statistik tamu
- ✅ CRUD Master Sekolah
- ✅ Pengelolaan data tamu dengan JOIN query
- ✅ Export data ke CSV
- ✅ Desain responsif dengan sidebar

## 🛠️ Stack Teknologi

- **Backend:** Node.js, Express.js
- **Database:** MySQL/MariaDB
- **Templating:** EJS
- **Styling:** Tailwind CSS (CDN)
- **Authentication:** bcrypt + express-session

## 📋 Prasyarat

Pastikan Anda sudah menginstall:

- Node.js (v14 atau lebih baru)
- MySQL atau MariaDB
- NPM atau Yarn

## 🚀 Cara Instalasi

### 1. Clone atau Download Proyek

```bash
cd buku-tamu
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Database

Buat file `.env` di root folder (copy dari `.env.example`):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=buku_tamu
DB_PORT=3306

SESSION_SECRET=your_secret_key_here
PORT=1000
```

### 4. Buat Database dan Tabel

Jalankan SQL script di MySQL:

```bash
mysql -u root -p < database/schema.sql
```

Atau manual:

1. Buka phpMyAdmin atau MySQL client
2. Import file `database/schema.sql`

### 5. Jalankan Aplikasi

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

Aplikasi akan berjalan di: `http://localhost:1000`

## 🌐 URL Akses

- **Buku Tamu Publik:** http://localhost:1000/buku-tamu
- **Admin Login:** http://localhost:1000/admin/login
- **Admin Dashboard:** http://localhost:1000/admin/dashboard

## 👤 Akun Admin Default

```
Username: admin
Password: admin123
```

⚠️ **PENTING:** Segera ganti password default setelah login pertama kali!

## 🔐 Membuat Admin Baru

Untuk membuat password hash baru:

```bash
node database/create-admin.js
```

Kemudian gunakan hash yang dihasilkan untuk insert ke tabel `super_admin`.

## 📁 Struktur Folder

```
buku-tamu/
├── app.js                  # File utama aplikasi
├── package.json            # Dependencies
├── .env                    # Konfigurasi environment
├── config/
│   └── database.js         # Konfigurasi database
├── middleware/
│   └── auth.js             # Middleware autentikasi
├── routes/
│   ├── bukuTamuRoutes.js   # Routes publik
│   └── adminRoutes.js      # Routes admin
├── controllers/
│   ├── bukuTamuController.js  # Logic buku tamu
│   └── adminController.js     # Logic admin
├── views/
│   ├── layout.ejs          # Base layout
│   ├── partials/           # Komponen reusable
│   ├── buku-tamu/          # Views publik
│   │   ├── form.ejs
│   │   └── success.ejs
│   └── admin/              # Views admin
│       ├── login.ejs
│       ├── dashboard.ejs
│       ├── master-sekolah.ejs
│       └── data-tamu.ejs
├── database/
│   ├── schema.sql          # SQL schema
│   └── create-admin.js     # Script hash password
└── README.md
```

## 🎨 Tema Warna

Warna utama: **#6184D6** (Biru)

- Primary: `#6184D6`
- Primary Dark: `#4B6BB5`
- Primary Light: `#8AA5E8`

## 📊 Fitur Admin

### Dashboard

- Statistik tamu hari ini
- Total tamu keseluruhan
- Total sekolah terdaftar
- List 5 tamu terbaru

### Master Sekolah

- Tambah sekolah baru
- Edit nama sekolah
- Hapus sekolah (jika tidak ada tamu terdaftar)
- Validasi otomatis

### Data Tamu

- View semua data tamu dengan JOIN ke master_sekolah
- Hapus data tamu
- Export ke CSV
- Filter dan search (coming soon)

## 🔒 Keamanan

- ✅ Password di-hash dengan bcrypt (10 salt rounds)
- ✅ Session-based authentication
- ✅ Middleware untuk proteksi route admin
- ✅ SQL injection protection (prepared statements)
- ✅ XSS protection
- ✅ CSRF protection (recommended: tambahkan csurf package)

## 📱 Responsif

Aplikasi 100% responsif untuk:

- 📱 Mobile (320px - 480px)
- 📱 Tablet (481px - 768px)
- 💻 Desktop (769px+)

## 🐛 Troubleshooting

### Error: Cannot connect to database

- Pastikan MySQL/MariaDB sudah running
- Cek konfigurasi di file `.env`
- Pastikan database `buku_tamu` sudah dibuat

### Error: Port 1000 already in use

- Ganti PORT di `.env` ke port lain (misal: 3000)
- Atau stop aplikasi yang menggunakan port 1000

### Error: bcrypt not installed

```bash
npm install bcrypt --save
```

## 📝 TODO / Pengembangan Selanjutnya

- [ ] Filter dan search data tamu
- [ ] Pagination untuk data tamu
- [ ] Ganti password admin dari dashboard
- [ ] Multi-admin dengan role management
- [ ] Chart statistik dengan Chart.js
- [ ] Dark mode toggle
- [ ] Email notification
- [ ] SMS notification via WhatsApp API

## 👨‍💻 Developer

Dibuat dengan ❤️ untuk HUT Yayasan

## 📄 License

ISC

## 🙏 Acknowledgments

- Express.js
- EJS
- Tailwind CSS
- Font Awesome
- bcrypt
