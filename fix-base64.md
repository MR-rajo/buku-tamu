## Tugas Utama
Buat sebuah skrip/fungsi logic di Node.js untuk mengambil data Base64 dari kolom foto di tabel buku_tamu, mendekodenya menjadi file gambar, menyimpan file tersebut ke direktori public/uploads/, dan kemudian mengupdate kolom foto di database menjadi path file yang baru.

## Prasyarat & Konteks
Platform: Node.js/Express.js.

Database: MySQL/MariaDB (Akses melalui objek db yang sudah ada).

Target Direktori: public/uploads/. Direktori ini harus dibuat jika belum ada.

Data Awal: Kolom foto di tabel buku_tamu saat ini berisi string Base64 (misalnya: data:image/jpeg;base64,...).

# Modul & Fungsi Logic yang Dibutuhkan
1. File Handling & Helper Function
Buat fungsi helper baru (misalnya di utility file) yang bertanggung jawab untuk konversi:

Dependensi: Impor modul bawaan Node.js: fs (untuk menulis file), path (untuk menangani path), dan crypto (untuk generate nama file unik).

Fungsi: decodeAndSaveBase64(base64String)

Input: String Base64 dari kolom foto.

Logic:

Validasi: Cek apakah string Base64 ada dan tidak NULL.

Ekstraksi: Pisahkan metadata (mime type dan prefix data:...) dari data Base64 mentah. Tentukan ekstensi file (misalnya: jpeg, png) dari mime type.

Generate Nama File: Buat nama file unik (misalnya: menggunakan timestamp dan random string). Contoh: 1700472000000_abcde.jpeg.

Simpan File: Gunakan fs.writeFileSync (atau asinkron fs.writeFile) untuk menulis buffer yang didekode ke path public/uploads/[nama_file_unik].

Output: Kembalikan path relatif file yang berhasil disimpan (misalnya: /uploads/[nama_file_unik].jpeg).

2. Migrasi Database (Logic Utama)
Buat route atau skrip sementara (/admin/migrate-photos) yang akan dijalankan satu kali oleh Super Admin:

Baca Data: Lakukan query SELECT id, foto FROM buku_tamu WHERE foto IS NOT NULL AND foto NOT LIKE '/uploads/%'. Ini memastikan hanya data Base64 yang belum dimigrasi yang diambil.

Loop & Konversi: Iterasi melalui setiap baris data yang diambil:

Panggil fungsi helper decodeAndSaveBase64(row.foto) untuk mendapatkan path file baru.

Penting: Tangani kasus error jika dekode gagal (misalnya: log error dan lewati baris tersebut).

Update Database: Untuk setiap baris yang berhasil dikonversi:

Lakukan query UPDATE buku_tamu SET foto = '[path_baru]' WHERE id = [row.id].

Log ID yang berhasil di-update.

3. Pembersihan & Finalisasi
Setelah skrip migrasi selesai, log total baris yang berhasil dimigrasi.

Peringatan: Setelah migrasi, semua fungsi yang sebelumnya membaca data Base64 dari buku_tamu.foto harus diubah agar membaca path file (misalnya: <img src="<%= row.foto %>" /> di view EJS harus berfungsi karena public/ adalah root statis).

## NOTED :
Jangan sampai menghilangkan, menghapus, dan merusak fungsi fungsi code sebelumnya atau fungsi logic code yang sudah ada, cukup focus untuk memperbaiki dan menyesuaikan hal tersebut saja sampai benar benar bisa berfungsi dengan baik.