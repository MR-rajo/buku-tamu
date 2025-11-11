## Tujuan
Mengimplementasikan dan mengintegrasikan fitur pengiriman pesan otomatis menggunakan whatsapp-web.js ke dalam controller POST /buku-tamu/submit di aplikasi Express.

Prasyarat & Konteks
Aplikasi: Node.js/Express.js sudah berjalan.

Database: Tersedia data nomor_wa, nama_lengkap, dan kode dari tabel buku_tamu.

Library: Asumsikan whatsapp-web.js dan qrcode-terminal (untuk menampilkan QR di console) sudah terinstal.

Koneksi: Objek koneksi database (db) sudah tersedia.

Desain Pesan: Pesan harus menyertakan Nama Tamu dan Kode Undian mereka.

🛠️ Langkah Implementasi (Client & Logic)
1. Inisialisasi Klien WhatsApp (Startup Server)
File: Modifikasi entry point aplikasi Anda (app.js atau server.js).

Logic:

Impor Client dari whatsapp-web.js.

Buat objek client baru dengan opsi untuk session persistence (misalnya menggunakan LocalAuth).

Implementasikan listener client.on('qr', (qr) => {...}). Gunakan qrcode-terminal.generate(qr, { small: true }) untuk menampilkan QR Code di terminal.

Implementasikan listener client.on('ready', () => {...}). Log "WhatsApp Client is Ready!"

Panggil client.initialize().

Penting: Export objek client ini agar bisa diimpor dan digunakan oleh controller buku tamu.

2. Fungsi Helper Pengiriman Pesan
File: Buat utility file baru: utils/whatsapp.js.

Fungsi: Buat fungsi sendWhatsAppMessage(number, name, code) yang menerima nomor, nama, dan kode.

Logic:

Import objek client yang sudah diinisialisasi.

Format nomor telepon Indonesia: Ubah 08xxxx menjadi 628xxxx@c.us.

Buat string pesan yang personal dan informatif:

Terima kasih, [Nama Tamu]!

Data kehadiran Anda di HUT Yayasan telah tercatat.

Kode Undian Spesial Anda: [KODE]

Simpan Kode ini untuk Lucky Wheel Spin.
Gunakan client.sendMessage(chatId, message) untuk mengirim pesan.

Tambahkan try/catch dan logging untuk menangani kegagalan pengiriman.

3. Integrasi ke Controller Buku Tamu
File: Modifikasi controller yang menangani POST /buku-tamu/submit.

Logic: Setelah data tamu berhasil di-insert dan Anda memiliki nomor_wa, nama_lengkap, dan kode tamu:

Panggil fungsi sendWhatsAppMessage(nomor_wa, nama_lengkap, kode) sebelum proses redirect ke halaman sukses.

Pastikan error dari pengiriman pesan WhatsApp tidak menghentikan proses redirect utama (gunakan async dan await dengan error handling non-blokir).

🚀 Instruksi Copilot
Tugas: Implementasikan penuh integrasi whatsapp-web.js. Mulai dari setup klien di entry point aplikasi dengan menampilkan QR Code via qrcode-terminal. Kemudian buat fungsi helper sendWhatsAppMessage untuk mengirim pesan notifikasi (termasuk Kode Undian). Terakhir, panggil fungsi helper tersebut di controller POST /buku-tamu/submit segera setelah data tamu berhasil disimpan. Pastikan error handling dibuat secara non-blokir.


## NOTED :
Jangan sampai menghilangkan, menghapus, dan merusak fungsi fungsi code sebelumnya atau fungsi logic code yang sudah ada, cukup focus untuk memperbaiki dan menyesuaikan hal tersebut saja sampai benar benar bisa berfungsi dengan baik.