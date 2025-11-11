-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 11, 2025 at 08:57 AM
-- Server version: 8.0.30
-- PHP Version: 8.3.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `buku_tamu`
--

-- --------------------------------------------------------

--
-- Table structure for table `buku_tamu`
--

CREATE TABLE `buku_tamu` (
  `id` int NOT NULL,
  `sekolah_id` int NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `nomor_wa` varchar(15) DEFAULT NULL,
  `foto` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `kode` varchar(15) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `buku_tamu`
--

INSERT INTO `buku_tamu` (`id`, `sekolah_id`, `nama_lengkap`, `nomor_wa`, `foto`, `kode`, `created_at`) VALUES
(1, 1, 'Bismillah Ya Allah', '081935679330', NULL, 'BYA0101', '2025-11-05 21:26:43'),
(2, 1, 'Test', '081935679330', NULL, 'T0102', '2025-11-05 21:47:21'),
(3, 1, 'Dimas Putra A', '081935679330', NULL, 'DPA0103', '2025-11-05 21:49:29'),
(4, 1, 'Dimas Putra Agustav', '081935679330', NULL, 'DPA0104', '2025-11-05 21:53:08'),
(5, 5, 'Roi PJI', '081935679330', '/uploads/1762483749411_b9e11f2e9508b6e5.jpg', 'RP0105', '2025-11-05 22:03:23'),
(6, 3, 'Dwi', '081935679330', '/uploads/1762483749440_70685dfad8ae0bcb.jpg', 'D0106', '2025-11-06 08:54:08'),
(7, 2, 'Dwi Test', '081935679330', '/uploads/1762483749453_36bb2f8c01884a54.jpg', 'DT0107', '2025-11-06 08:54:56'),
(8, 3, 'Rajo', '081935679330', '/uploads/1762483749464_48580d384eb2f443.jpg', 'R0101', '2025-11-06 09:08:21'),
(9, 4, 'Roi Pji', '081935679330', '/uploads/1762483749476_49c02e15b13fd6f1.jpg', 'RP0101', '2025-11-06 09:09:03'),
(10, 5, 'Temjo', '0895396083939', '/uploads/1762483749489_603ea1774c89a85d.jpg', 'T0110', '2025-11-06 09:11:56'),
(11, 1, 'Roii Aja', '081935679330', '/uploads/1762483749502_548a24cfcafd1bb8.jpg', 'RA0111', '2025-11-06 11:05:27'),
(12, 1, 'Dimas Putra Agustav', '081935679330', '/uploads/1762483749518_f232a1c68504ceed.jpg', 'DPA0112', '2025-11-06 11:11:51'),
(13, 5, 'Dimas Putra A', '085830695466', '/uploads/1762483749535_769df12a3dec5491.jpg', 'DPA0113', '2025-11-06 13:05:38'),
(14, 1, 'Test Aja', '081935679330', '/uploads/1762483749551_51313f8d9cb32c1c.jpg', 'TA0114', '2025-11-06 13:16:09'),
(15, 4, 'Roi Pji', '081935679330', '/uploads/1762483749563_a1b0e9a438e93788.jpg', 'RP0115', '2025-11-06 16:46:24'),
(16, 1, 'Dimas Putra Agustav', '081935679330', '/uploads/1762483749580_25b560a79abe5592.jpg', 'DPA0116', '2025-11-06 16:46:58'),
(17, 1, 'Test', '081935679330', '/uploads/1762483749594_2bcdabb2a8b75871.jpg', 'T0117', '2025-11-06 22:27:43'),
(18, 3, 'Bismillah Ya Allah', '081935679330', '/uploads/1762487587040_ada350d2acdd579e.jpg', 'BYA0118', '2025-11-07 10:53:07'),
(19, 2, 'Ahmad Huzaifah', '081935679330', '/uploads/1762532422832_80f66dc2a68c9dfb.jpg', 'AH0119', '2025-11-07 23:20:22'),
(20, 2, 'Zainal Abidin', '081935679330', '/uploads/1762575285840_ee416165e4f7d3d9.jpg', 'ZA0120', '2025-11-08 11:14:45'),
(21, 1, 'Ria Rei', '081935679330', '/uploads/1762594486063_3a5ca71351478889.jpg', 'RR0121', '2025-11-08 16:34:46'),
(22, 1, 'Bismiilah Test', '6281911759105', '/uploads/1762618056212_e6c1417d3172a6f8.jpg', 'BT0122', '2025-11-08 23:07:36'),
(23, 1, 'Ria Reisyah', '6289666586662', '/uploads/1762740828215_cb15120660dd0ec4.jpg', 'RR0123', '2025-11-10 09:13:48');

-- --------------------------------------------------------

--
-- Table structure for table `master_sekolah`
--

CREATE TABLE `master_sekolah` (
  `id` int NOT NULL,
  `nama_sekolah` varchar(150) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_sekolah`
--

INSERT INTO `master_sekolah` (`id`, `nama_sekolah`, `created_at`, `updated_at`) VALUES
(1, 'SMKS Jakarta Pusat 1', '2025-11-05 21:13:13', NULL),
(2, 'SMKS Jakarta Timur 1', '2025-11-05 21:53:36', NULL),
(3, 'SMKS Jakarta Timur 2', '2025-11-05 21:53:43', NULL),
(4, 'SMKS Cibitung', '2025-11-05 21:53:55', NULL),
(5, 'SMA IT Tenjolaya', '2025-11-05 21:54:28', NULL),
(6, 'Test', '2025-11-06 13:15:02', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `super_admin`
--

CREATE TABLE `super_admin` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `whatsapp` varchar(15) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `super_admin`
--

INSERT INTO `super_admin` (`id`, `name`, `whatsapp`, `password`, `created_at`) VALUES
(1, 'Super Admin', '081935679330', '$2b$10$kjyR2OjIruufBe1TBOv7redzdIwbiNAM5NP1oV5rIJM9I9dsfxJf2', '2025-11-05 21:01:31'),
(2, 'Super Admin', '0812345678', '1234', '2025-11-05 21:03:45');

-- --------------------------------------------------------

--
-- Table structure for table `wheel_spin`
--

CREATE TABLE `wheel_spin` (
  `id` int NOT NULL,
  `tamu_id` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `wheel_spin`
--

INSERT INTO `wheel_spin` (`id`, `tamu_id`, `created_at`) VALUES
(1, 10, '2025-11-06 10:11:33'),
(2, 12, '2025-11-06 11:41:10'),
(3, 11, '2025-11-06 13:20:04'),
(4, 14, '2025-11-06 13:30:26'),
(5, 8, '2025-11-06 22:35:33'),
(6, 1, '2025-11-10 09:19:07'),
(7, 3, '2025-11-10 09:19:18'),
(8, 15, '2025-11-10 09:19:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `buku_tamu`
--
ALTER TABLE `buku_tamu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sekolah_id` (`sekolah_id`);

--
-- Indexes for table `master_sekolah`
--
ALTER TABLE `master_sekolah`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `super_admin`
--
ALTER TABLE `super_admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wheel_spin`
--
ALTER TABLE `wheel_spin`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tamu_id` (`tamu_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `buku_tamu`
--
ALTER TABLE `buku_tamu`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `master_sekolah`
--
ALTER TABLE `master_sekolah`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `super_admin`
--
ALTER TABLE `super_admin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `wheel_spin`
--
ALTER TABLE `wheel_spin`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `buku_tamu`
--
ALTER TABLE `buku_tamu`
  ADD CONSTRAINT `buku_tamu_ibfk_1` FOREIGN KEY (`sekolah_id`) REFERENCES `master_sekolah` (`id`);

--
-- Constraints for table `wheel_spin`
--
ALTER TABLE `wheel_spin`
  ADD CONSTRAINT `wheel_spin_ibfk_1` FOREIGN KEY (`tamu_id`) REFERENCES `buku_tamu` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
