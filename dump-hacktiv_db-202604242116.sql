-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: hacktiv_db
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `role` enum('user','assistant') NOT NULL,
  `content` text NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `messages_user_id` (`userId`),
  KEY `messages_user_id_created_at` (`userId`,`createdAt`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,1,'user','Hallo bot sekarang tanggal berapa','{}','2026-04-22 12:55:04','2026-04-22 12:55:04'),(2,1,'assistant','Hallo Andi! Hari ini hari Rabu, 22 April 2026.\n\nSelamat datang kembali! Sepertinya kamu belum punya tugas apa pun hari ini. Bagaimana kalau kita mulai dengan menetapkan beberapa tujuan kecil untuk hari ini? Itu bisa bantu kamu tetap fokus dan produktif! 😊','{\"model\":\"gemini-2.5-flash\",\"tokens\":347}','2026-04-22 12:55:04','2026-04-22 12:55:04'),(3,1,'user','hallo bot saya berikan saya beberapa motivasi hari ini nama saya andikarna','{}','2026-04-22 13:09:44','2026-04-22 13:09:44'),(4,1,'assistant','Halo, Andi! Senang sekali bisa ngobrol denganmu. Saya ProductiveAI, siap membantumu hari ini, Rabu, 22 April 2026.\n\nIngat, setiap hari adalah kesempatan baru untuk membuat kemajuan, sekecil apa pun itu. Kamu punya potensi luar biasa!\n\nKarena kamu belum punya tugas yang terdaftar, bagaimana kalau kita mulai dengan menetapkan 2-3 tujuan kecil yang ingin kamu capai hari ini? Itu bisa jadi awal yang bagus untuk membangun momentummu!','{\"model\":\"gemini-2.5-flash\",\"tokens\":407}','2026-04-22 13:09:44','2026-04-22 13:09:44'),(5,1,'user','saya sudah punya tugas terdaftar lalu apa fungsi aplikasi ini','{}','2026-04-22 13:12:14','2026-04-22 13:12:14'),(6,1,'assistant','Ah, maaf sekali, Andi! Terima kasih sudah mengingatkan. Saya tadi sedikit keliru dan tidak melihat tugasmu yang sudah ada.\n\nTugasmu saat ini adalah:\n*   **\"Resolve Quiz Seasone Hactiv8\"** (due: 22/04/2026, status: pending)\n\nFungsi utama saya sebagai ProductiveAI adalah membantumu mengelola tugas-tugas seperti ini, Andi. Saya bisa:\n*   Mengingatkanmu tentang *deadline*.\n*   Membantumu memecah tugas besar menjadi langkah-langkah kecil.\n*   Memberi dorongan dan tips produktivitas.\n*   Membantu merencanakan harimu agar kamu bisa tetap fokus dan termotivasi!\n\nKarena *deadline* tugas \"Resolve Quiz Seasone Hactiv8\" ini adalah hari ini, apakah kamu ingin kita mulai merencanakan langkah-langkah untuk menyelesaikannya?','{\"model\":\"gemini-2.5-flash\",\"tokens\":667}','2026-04-22 13:12:14','2026-04-22 13:12:14'),(7,1,'user','hello','{}','2026-04-22 13:49:21','2026-04-22 13:49:21'),(8,1,'assistant','Halo, Andi! Ada yang bisa saya bantu hari ini?','{\"model\":\"gemini-2.5-flash-lite\",\"tokens\":544}','2026-04-22 13:49:21','2026-04-22 13:49:21'),(9,1,'user','[Task: Resolve Quiz Seasone Hactiv8]','{}','2026-04-22 13:49:53','2026-04-22 13:49:53'),(10,1,'assistant','Siap, Andi! Saya lihat kamu punya tugas **\"Resolve Quiz Seasone Hactiv8\"** yang *deadline*-nya hari ini, 22 April 2026.\n\nKarena *deadline*-nya sudah dekat, mari kita fokus pada ini ya. Apakah ada yang bisa saya bantu terkait tugas tersebut? Mungkin memecahnya menjadi bagian-bagian kecil, atau sekadar memberikan dorongan semangat?','{\"model\":\"gemini-2.5-flash-lite\",\"tokens\":650}','2026-04-22 13:49:53','2026-04-22 13:49:53'),(11,1,'user','saya ingin membuat web ai untuk menyelesaikan quiz tersebut','{}','2026-04-22 13:51:45','2026-04-22 13:51:45'),(12,1,'assistant','Wah, ide yang keren sekali, Andi! Membuat web AI untuk menyelesaikan kuis itu ambisius dan pasti akan sangat membantu.\n\nMengingat *deadline* kuisnya hari ini, mungkin kita bisa memikirkan strategi terbaik untuk **\"Resolve Quiz Seasone Hactiv8\"** terlebih dahulu. Bagaimana kalau kita coba teknik \"Eat the Frog\"? Itu artinya, kita selesaikan tugas yang paling penting atau paling menantang (dalam hal ini, kuisnya) di awal hari.\n\nSetelah itu, baru kita bisa merencanakan langkah-langkah teknis untuk membangun web AI-mu. Gimana menurutmu?','{\"model\":\"gemini-2.5-flash-lite\",\"tokens\":788}','2026-04-22 13:51:45','2026-04-22 13:51:45'),(13,1,'user','boleh','{}','2026-04-22 13:52:15','2026-04-22 13:52:15'),(14,1,'assistant','Oke, Andi! Hebat sekali kamu siap untuk \"Eat the Frog\"-nya!\n\nUntuk tugas **\"Resolve Quiz Seasone Hactiv8\"**, apa yang sudah kamu punya atau apa yang perlu kamu lakukan sekarang untuk menyelesaikannya? Misalnya, apakah kuisnya sudah tersedia, atau ada materi yang perlu kamu pelajari dulu?\n\nKita bisa fokus menyelesaikan ini sampai tuntas ya!','{\"model\":\"gemini-2.5-flash-lite\",\"tokens\":876}','2026-04-22 13:52:15','2026-04-22 13:52:15'),(15,1,'user','sebutkan feature di dalamnya','{}','2026-04-22 13:59:31','2026-04-22 13:59:31'),(16,1,'assistant','Oh, kamu sedang membicarakan fitur-fitur dari aplikasi \"MiniPerpus\" yang ada di gambar itu ya, Andi? Itu adalah contoh panel administrasi perpustakaan.\n\nDari gambar tersebut, fitur-fitur utamanya terlihat seperti ini:\n\n**Di Sidebar Kiri:**\n*   **Dashboard:** Tampilan utama yang merangkum informasi penting.\n*   **MASTER DATA:**\n    *   Kategori\n    *   Penerbit\n    *   Buku\n*   **TRANSAKSI:**\n    *   Peminjaman\n    *   Laporan\n*   **AKUN:** Pengelolaan akun pengguna.\n\n**Di Area Utama (Dashboard):**\n*   Ringkasan data penting dalam bentuk kartu:\n    *   Total Buku\n    *   Total Kategori\n    *   Peminjaman\n    *   Pengguna\n\nJadi, aplikasi ini sepertinya berfungsi untuk mengelola data-data perpustakaan, mencatat transaksi peminjaman, dan menampilkan ringkasan informasi penting.\n\nApakah ada fitur spesifik dari aplikasi ini yang ingin kamu diskusikan lebih lanjut, Andi? Atau ini hanya sebagai contoh inspirasi untuk proyek AI-mu?','{\"model\":\"gemini-2.5-flash-lite\",\"tokens\":1264}','2026-04-22 13:59:31','2026-04-22 13:59:31'),(17,1,'user','Hallo bot hari apa ini','{}','2026-04-24 12:21:55','2026-04-24 12:21:55'),(18,1,'assistant','Halo! Hari ini adalah **Jumat, 24 April 2026**.\n\nAda yang bisa saya bantu terkait jadwal atau tugasmu, Andi?','{\"model\":\"gemini-2.5-flash-lite\",\"tokens\":835}','2026-04-24 12:21:55','2026-04-24 12:21:55'),(19,1,'user','Hallo apa kabar kamu','{}','2026-04-24 12:47:09','2026-04-24 12:47:09'),(20,1,'assistant','Halo, Andi! Kabar baik, terima kasih sudah bertanya. Saya siap membantumu menjadi lebih produktif hari ini!\n\nBagaimana denganmu? Ada yang bisa saya bantu terkait tugas-tugasmu, terutama **\"Resolve Quiz Seasone Hactiv8\"** yang *deadline*-nya sudah dekat?','{\"model\":\"gemini-2.5-flash-lite\",\"tokens\":799}','2026-04-24 12:47:09','2026-04-24 12:47:09');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(10) unsigned NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `dueDate` datetime DEFAULT NULL,
  `status` enum('pending','in_progress','done','cancelled') DEFAULT 'pending',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `fromChat` tinyint(1) DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_user_id` (`userId`),
  KEY `tasks_user_id_status` (`userId`,`status`),
  KEY `tasks_user_id_due_date` (`userId`,`dueDate`),
  CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,1,'Resolve Quiz Seasone Hactiv8','Menyelesaikan quiz hactive8 seasone 2','2026-04-22 15:00:00','done','high',0,'2026-04-22 13:11:29','2026-04-22 13:34:20'),(2,1,'Resolve Quiz Seasone Hactiv8','Menyelesaikan quiz hactive8 seasone 2','2026-04-22 13:16:00','pending','medium',0,'2026-04-22 13:16:22','2026-04-22 13:34:13');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `preferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`preferences`)),
  `lastActive` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `users_email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Andi Karna','andikarna@gmail.com','$2a$12$FrFSymO8x5Q6ZbNI.zYvo.9XxcLGqeO4O8ihn.BGvuxz0B8U2Ni3S','{\"tone\":\"mixed\",\"habits\":[]}','2026-04-22 13:08:10','2026-04-20 12:59:19','2026-04-22 13:08:10');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'hacktiv_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-24 21:16:27
