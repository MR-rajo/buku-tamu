# Tugas Anda :

# 1. Pelajari code app saya secara menyeluruh
# 2. Pastikan seluruh fitur fitur nya dapat berfungsi dengan baik dan pastikan tidak ada error
# 🎯 Fitur: Lucky Wheel Spin (Undian Berhadiah)

## Tujuan
Mengembangkan halaman dan *logic* "Wheel Spin" yang interaktif dan visual, digunakan untuk memilih pemenang undian secara acak dari data yang ada di tabel `buku_tamu`.

## Stack Tambahan
* **Frontend Logic:** Vanilla JavaScript atau library ringan untuk mengelola putaran roda (*wheel animation*).
* **Styling:** Tailwind CSS CDN.
* **Visual:** Wajib modern, elegan, interaktif, dan responsif.

## Database Schema (Tabel Utama)
Fokus pada dua kolom kunci dari tabel `buku_tamu`:
* **`kode`**: Kode unik tamu (digunakan sebagai entri di roda).
* **`foto`**: URL/Path foto tamu (digunakan untuk menampilkan pemenang).

## 🛠️ Modul & Fungsi Logic yang Dibutuhkan

### A. 🌐 Frontend (Halaman Wheel Spin)

**Route:** `/spin-wheel` (Akses publik, tidak perlu *login*).

1.  **Desain Roda:** Buat tampilan roda putar (Wheel of Fortune) yang **besar, elegan, dan *eye-catching***, menggunakan warna tema biru (`#6184D6`) dan warna kontras lainnya. Pastikan responsif di *mobile*.
2.  **Roda Interaktif:**
    * Roda harus dibagi menjadi beberapa segmen. Setiap segmen mewakili satu atau beberapa entri **`kode`** dari tamu yang hadir.
    * Tampilkan **kode** atau potongan nama tamu pada setiap segmen (jika jumlah tamu tidak terlalu banyak).
3.  **Tombol Putar:** Sediakan tombol utama yang jelas untuk memulai putaran.
4.  **Area Pemenang:** Sediakan area khusus di samping atau di bawah roda untuk menampilkan detail pemenang setelah roda berhenti.

### B. 💻 Backend (Express API)

1.  **Endpoint GET Data Roda (`/api/spin/data`):**
    * Buat *route* Express (`GET`) untuk mengambil data dari tabel `buku_tamu`.
    * **Penting:** Hanya ambil kolom `kode` dan `foto` (dan `nama_lengkap` sebagai data pendukung).
    * Kirim data ini dalam format JSON ke *frontend* untuk mengisi segmen roda.

2.  **Endpoint POST Putar Acak (`/api/spin/start`):**
    * Buat *route* Express (`POST`) yang menangani permintaan putaran.
    * **Logic:** Secara acak, pilih satu baris data (`kode`) dari tabel `buku_tamu`.
    * Kirimkan data **pemenang** (termasuk `kode`, `nama_lengkap`, dan `foto`) kembali dalam format JSON ke *frontend*.

### C. 💡 JavaScript Logic

1.  **Initial Load:** Ambil data dari `/api/spin/data` dan gunakan untuk secara dinamis *render* segmen-segmen pada roda.
2.  **Spin Handling:**
    * Ketika tombol **Putar** diklik:
        * Kirim permintaan ke `/api/spin/start` untuk mendapatkan pemenang yang dipilih *backend*.
        * Jalankan **animasi putaran** roda di *frontend*.
        * Hitung posisi akhir putaran sehingga roda berhenti tepat pada segmen yang sesuai dengan `kode` pemenang yang dikirim dari *backend*.
3.  **Tampilan Pemenang (Pesan Sukses):**
    * Setelah roda berhenti, tampilkan *popup* atau layar yang besar, modern, dan meriah untuk mengumumkan pemenang.
    * **Wajib tampilkan:**
        * **"SELAMAT!"**
        * **Nama Lengkap** Pemenang.
        * **Kode** Pemenang.
        * **FOTO** Pemenang (Ambil URL dari kolom `foto` dan tampilkan sebagai gambar).

## 🚀 Instruksi Copilot

> **Tugas:** Implementasikan fitur Wheel Spin interaktif di *route* `/spin-wheel`. Fokus pada visual roda yang responsif, *logic* JavaScript untuk mengontrol animasi dan sinkronisasi dengan *endpoint* *backend* (`/api/spin/data` dan `/api/spin/start`), serta tampilan pengumuman pemenang yang menonjolkan **foto tamu** (`buku_tamu.foto`) sesuai dengan kode yang terpilih. Gunakan Tailwind CSS untuk *styling* yang modern dan elegan dengan aksen biru (`#6184D6`).

# Buat Fitur ini di halaman admin


ini Struktur table lengkap 'buku_tamu' :
1	id Primary	int			No	None		AUTO_INCREMENT	Change Change	Drop Drop	
	2	sekolah_id Index	int			No	None			Change Change	Drop Drop	
	3	nama_lengkap	varchar(100)	utf8mb4_0900_ai_ci		No	None			Change Change	Drop Drop	
	4	nomor_wa	varchar(15)	utf8mb4_0900_ai_ci		Yes	NULL			Change Change	Drop Drop	
	5	foto	longtext	utf8mb4_0900_ai_ci		Yes	NULL			Change Change	Drop Drop	
	6	kode	varchar(15)	utf8mb4_0900_ai_ci		Yes	NULL			Change Change	Drop Drop	
	7	created_at	datetime			No	CURRENT_TIMESTAMP		DEFAULT_GENERATED	Change Change	Drop Drop	

NOTED :
Jangan sampai menghilangkan, menghapus, dan merusak fungsi fungsi code sebelumnya atau fungsi logic code yang sudah ada, cukup focus untuk memperbaiki dan menyesuaikan hal tersebut saja sampai benar benar bisa berfungsi dengan baik.
