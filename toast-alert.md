# 🧩 Task: Tambahkan Alert Sukses Setelah Login Berhasil di `login.ejs`

## 🎯 Tujuan
Ketika pengguna berhasil login melalui halaman `#file:login.ejs`, tampilkan **alert sukses sederhana** (notifikasi progress) di **pojok kanan atas** halaman. Alert ini hanya muncul sekali setelah login berhasil, lalu menghilang otomatis setelah beberapa detik.

## 📋 Ketentuan
- Jangan menghapus, mengubah, atau merusak fungsi login dan logic kode yang sudah ada sebelumnya.
- Fokus hanya untuk menambahkan fitur alert sukses setelah login berhasil.
- Alert ditampilkan di posisi **kanan atas halaman** (top-right).
- Gunakan tampilan sederhana, misalnya **warna hijau muda** dengan ikon centang.
- Alert muncul otomatis setelah login berhasil, dan hilang otomatis (misalnya setelah 3 detik).
- Semua fungsi redirect, session, dan autentikasi harus tetap berjalan normal.

## ⚙️ Langkah Implementasi
1. Setelah login berhasil di backend (misalnya di `routes/auth.js` atau `controllers/authController.js`), kirimkan status sukses ke halaman `login.ejs`.  
   Contoh:
   ```js
   req.flash('success', 'Login berhasil! Selamat datang kembali.');
   res.redirect('/dashboard');


NOTED :
Jangan sampai menghilangkan, menghapus, dan merusak fungsi fungsi code sebelumnya atau fungsi logic code yang sudah ada, cukup focus untuk memperbaiki dan menyesuaikan hal tersebut saja sampai benar benar bisa berfungsi dengan baik.