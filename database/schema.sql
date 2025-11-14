-- Buat database
CREATE DATABASE IF NOT EXISTS buku_tamu;
USE buku_tamu;

-- Tabel master_sekolah
CREATE TABLE IF NOT EXISTS master_sekolah (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_sekolah VARCHAR(150) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NULL ON UPDATE CURRENT_TIMESTAMP 
);

-- Tabel buku_tamu
CREATE TABLE IF NOT EXISTS buku_tamu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sekolah_id INT NOT NULL,
    other_instansi VARCHAR(100) NULL DEFAULT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    nomor_wa VARCHAR(15),
    foto LONGTEXT,
    kode VARCHAR(15) NULL DEFAULT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sekolah_id) REFERENCES master_sekolah(id)
);

-- Tabel super_admin
CREATE TABLE IF NOT EXISTS super_admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    whatsapp VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabel wheel_spin (untuk menyimpan pemenang undian)
CREATE TABLE IF NOT EXISTS wheel_spin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tamu_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tamu_id) REFERENCES buku_tamu(id) ON DELETE CASCADE
);

-- Insert data sample sekolah
INSERT INTO master_sekolah (nama_sekolah) VALUES
('SMK Negeri 1 Jakarta'),
('SMK Negeri 2 Jakarta'),
('SMK Muhammadiyah 1'),
('SMK Telkom Jakarta'),
('SMA Negeri 1 Jakarta');

-- Insert admin default (password: admin123)
-- Password sudah di-hash menggunakan bcrypt
-- Gunakan script create-admin.js untuk membuat admin baru
INSERT INTO super_admin (name, whatsapp, password) VALUES
('admin', '081234567890', '$2b$10$N9qo8uLOickgx2ZMRZoMye1Z8PBBDPcBLG3lXlLHcXt6pA9jWV6Oi');
