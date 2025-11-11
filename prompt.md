# 💻 Proyek: Buku Tamu Digital HUT Yayasan

## Tujuan Utama
Buat aplikasi web Buku Tamu Digital menggunakan **Node.js, Express, EJS, dan Tailwind CSS (CDN)**. Aplikasi harus memiliki antarmuka publik untuk pengisian data dan *dashboard* admin yang aman untuk pengelolaan data.

## Stack Teknologi
* **Backend:** Node.js, Express.js
* **Database:** MySQL/MariaDB (Abaikan *query* koneksi, asumsikan modul koneksi MySQL sudah tersedia dan diimpor sebagai `db`).
* **Templating:** EJS
* **Styling:** Tailwind CSS CDN (Pastikan responsif, modern, dan elegan).

## Konfigurasi Database (Sudah Tersedia)
Aplikasi harus berinteraksi dengan tiga tabel berikut:

1.  **`master_sekolah`**:
    ```sql
    CREATE TABLE master_sekolah (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama_sekolah VARCHAR(150) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP 
    );
    ```
2.  **`buku_tamu`**:
    ```sql
    CREATE TABLE buku_tamu (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sekolah_id INT NOT NULL,
        nama_lengkap VARCHAR(100) NOT NULL,
        nomor_wa VARCHAR(15),
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sekolah_id) REFERENCES master_sekolah(id)
    );
    ```
3.  **`super_admin`**: Digunakan untuk autentikasi *dashboard*.
    ```sql
    CREATE TABLE super_admin (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        whatsapp VARCHAR(15),
        password VARCHAR(255) NOT NULL, -- Harus di-hash (misal: bcrypt)
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    ```

## 🎨 Desain & Styling
* **Tema Warna Utama:** Biru (Hex: `#6184D6`). Gunakan warna ini sebagai warna aksen utama, tombol, dan elemen penting.
* **Estetika:** Modern, elegan, *user-friendly*, dan **wajib responsif** (terutama untuk tampilan *mobile*).
* **EJS Layout:** Buat *base layout* untuk menghindari duplikasi kode seperti `<head>`, *script* Tailwind CDN, dan navigasi.

---

## 🛠️ Modul & Fungsi Logic yang Dibutuhkan

### A. 🌐 Modul Publik (Tanpa Autentikasi)

**Route:** `localhost:1000/buku-tamu`

1.  **Halaman Form Buku Tamu (`/buku-tamu/`):**
    * Tampilkan formulir yang meminta input: **Asal Sekolah, Nama Lengkap, Nomor WhatsApp**.
    * Kolom **Asal Sekolah** harus berupa *dropdown* (*select*) yang datanya diambil dari `master_sekolah`.
    * Gunakan desain modern dengan warna `#6184D6` untuk tombol *submit*.
    * Tampilkan pesan *loading* dan sukses yang elegan setelah *submit*.
    * Pastikan *styling* responsif.

2.  **API Handler POST (`/buku-tamu/submit`):**
    * Buat *logic* di Express untuk menangani pengiriman data (`POST`).
    * Lakukan validasi sederhana (semua *field* tidak boleh kosong).
    * Masukkan data ke tabel **`buku_tamu`** (kecuali `created_at` yang otomatis).
    * Redirect ke halaman sukses setelah INSERT.

---

### B. 🔐 Modul Admin (Membutuhkan Autentikasi)

#### 1. Autentikasi

* Gunakan **Express Session** atau sejenisnya untuk menyimpan status *login*.
* Buat *middleware* **`isAuthenticated`** untuk melindungi semua *route* admin (kecuali *login*).
* **Halaman Login (`/admin/login`):** Form login sederhana (Username/Email dan Password). Asumsikan `name` di tabel `super_admin` digunakan sebagai *username*. Gunakan `bcrypt.compare` untuk verifikasi *password*.
* **Logic Logout (`/admin/logout`):** Hapus sesi dan *redirect* ke halaman *login*.

#### 2. Dashboard & Pengelolaan Data

**Route:** `localhost:1000/admin/...`

* **Dashboard Utama (`/admin/`):** Halaman ringkasan yang menampilkan statistik sederhana (misalnya: Total Tamu Hari Ini, Total Tamu Keseluruhan).
* **Pengelolaan Master Sekolah (`/admin/master-sekolah`):**
    * Tampilkan tabel data dari **`master_sekolah`**.
    * Sediakan tombol **Tambah**, **Edit**, dan **Hapus**.
    * Implementasikan *logic* **CREATE, READ, UPDATE, DELETE (CRUD)** untuk tabel ini.
* **Pengelolaan Data Tamu (`/admin/data-tamu`):**
    * Tampilkan tabel data dari **`buku_tamu`**.
    * Gunakan *query* **JOIN** untuk menampilkan **Nama Sekolah** (dari `master_sekolah`) alih-alih hanya `sekolah_id`.
    * Sediakan *link* atau fitur untuk **Export data ke CSV** (opsional, tapi sangat dihargai).
    * Sediakan fitur **Hapus** untuk data tamu.

## 🚀 Instruksi Copilot

> **Tugas:** Mulai *setup* proyek Node.js. Buat struktur *folder* dasar (`views`, `routes`, `controllers`, `public`), konfigurasi Express, dan *base layout* EJS. Setelah itu, fokus pada implementasi *route* publik `/buku-tamu` dan antarmuka *admin* yang membutuhkan autentikasi dan fitur CRUD sesuai spesifikasi di atas. Prioritaskan *styling* menggunakan Tailwind CDN dengan tema `#6184D6` di semua komponen.