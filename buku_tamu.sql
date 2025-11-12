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
(1, 'Super Admin', '081935679330', '$2b$10$kjyR2OjIruufBe1TBOv7redzdIwbiNAM5NP1oV5rIJM9I9dsfxJf2', '2025-11-05 21:01:31');

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
