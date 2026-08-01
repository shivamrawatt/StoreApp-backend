-- MySQL dump 10.13  Distrib 8.4.9, for Linux (x86_64)
--
-- Host: gondola.proxy.rlwy.net    Database: railway
-- ------------------------------------------------------
-- Server version	9.4.0

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
-- Temporary view structure for view `owner_user_view`
--

DROP TABLE IF EXISTS `owner_user_view`;
/*!50001 DROP VIEW IF EXISTS `owner_user_view`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `owner_user_view` AS SELECT 
 1 AS `name`,
 1 AS `shop_id`,
 1 AS `email`,
 1 AS `mobile`,
 1 AS `subscription_status`,
 1 AS `subscription_expires`,
 1 AS `created_at`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `owners`
--

DROP TABLE IF EXISTS `owners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `owners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(120) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `full_name` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `owners`
--

LOCK TABLES `owners` WRITE;
/*!40000 ALTER TABLE `owners` DISABLE KEYS */;
INSERT INTO `owners` VALUES (9,'shivam','shivam@storeapp.com','$2b$10$t3TWOIuKgM2kCVzD2jDdeOsl53LDKYFsFHJPmdnGsGAG58wvLiqPG','Shivam Rawat','2026-02-19 07:58:34');
/*!40000 ALTER TABLE `owners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pending_admins`
--

DROP TABLE IF EXISTS `pending_admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pending_admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `shop_name` varchar(150) DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `otp` varchar(10) DEFAULT NULL,
  `verified` tinyint(1) DEFAULT '0',
  `expires_at` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `invite_token` varchar(120) DEFAULT NULL,
  `invite_expires` datetime DEFAULT NULL,
  `email_verified` tinyint DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pending_admins`
--

LOCK TABLES `pending_admins` WRITE;
/*!40000 ALTER TABLE `pending_admins` DISABLE KEYS */;
INSERT INTO `pending_admins` VALUES (15,'admin_test2','$2b$10$yqPDEp296XxFHsZ30sEl..GarbxyRm05nMmlqTnm9owUg6LeRM0Ma','Demo Shop','Admin Demo','rajivrawatt054@gmail.com','9999999999','172598',1,'2026-02-11 08:14:21','2026-02-11 08:04:41','be8baf49234bc6cd53be6dc111e42439ef874660919b553a81d51aad630b8f31','2026-02-12 08:04:42',0);
/*!40000 ALTER TABLE `pending_admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shop_id` int NOT NULL,
  `name` varchar(150) NOT NULL,
  `name_lower` varchar(150) NOT NULL,
  `stock` int NOT NULL,
  `unit` varchar(30) DEFAULT 'kg',
  `price` decimal(10,2) NOT NULL,
  `image` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_shop_product` (`shop_id`,`name_lower`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,'Air Fryer','air fryer',13,'Unit',4599.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770716945/store-products/rbbbuqzsyv9npi763xgm.png','2026-02-10 09:49:06','2026-02-26 05:27:25'),(3,1,'Hair dryer','hair dryer',11,'Unit',999.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717251/store-products/dpyt3rzk0pj3og7o9rdb.png','2026-02-10 09:54:13','2026-02-11 04:49:24'),(4,1,'Speaker','speaker',18,'Unit',1499.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717308/store-products/icvnnn3vvvlrqdnd9cgq.png','2026-02-10 09:55:10','2026-02-21 09:27:11'),(5,1,'Earbuds','earbuds',31,'Unit',899.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717350/store-products/chdarfwuegi0nwletxzv.png','2026-02-10 09:55:51','2026-02-26 05:27:57'),(6,1,'Electric Kettle','electric kettle',15,'Unit',699.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717411/store-products/rfjjeketqnct55pq52d8.png','2026-02-10 09:56:53','2026-02-10 09:56:53'),(7,1,'Iron','iron',8,'Unit',899.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717498/store-products/zcyojmijgsfz57lklod7.png','2026-02-10 09:58:19','2026-02-10 09:58:19'),(8,1,'Headphone','headphone',25,'Unit',1599.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717547/store-products/e13rscgobyazxqbxvorz.png','2026-02-10 09:59:08','2026-02-21 07:54:02'),(9,1,'Hard Drive (2TB)','hard drive (2tb)',11,'Unit',7999.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717595/store-products/uhyzabafpz4aeyym444j.png','2026-02-10 09:59:56','2026-02-26 05:23:07'),(10,1,'OnePlus Mobile','oneplus mobile',8,'Unit',28999.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717643/store-products/scfaee4qzbsnbl7yscgw.png','2026-02-10 10:00:45','2026-02-10 10:00:45'),(11,1,'Mixture Grinder','mixture grinder',12,'Unit',3599.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717702/store-products/s3znfeiow5brhbnbf7du.png','2026-02-10 10:01:44','2026-02-10 10:01:44'),(12,1,'Mouse','mouse',18,'Unit',799.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717739/store-products/o5ath4vagllsau0pnxoc.png','2026-02-10 10:02:21','2026-02-10 10:02:21'),(13,1,'Keyboard','keyboard',13,'Unit',2999.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717779/store-products/kspolfvcbbll7riwlklf.png','2026-02-10 10:03:00','2026-02-10 10:03:00'),(14,1,'Pendrive 128GB','pendrive 128gb',24,'Unit',999.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717835/store-products/vhn9kfj3jnazwwlpggxt.png','2026-02-10 10:03:56','2026-02-10 10:03:56'),(15,1,'Smart Watch','smart watch',44,'Unit',1799.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717882/store-products/qb3m8tr6suzegwnrejpy.png','2026-02-10 10:04:45','2026-02-10 10:04:45'),(16,1,'Tablet','tablet',5,'Unit',14999.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717920/store-products/thebj1phqlotxgf4esll.png','2026-02-10 10:05:21','2026-02-10 10:05:21'),(17,1,'Trimmer','trimmer',15,'Unit',2199.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1770717991/store-products/swskdqhtrbewcw8zzndl.png','2026-02-10 10:06:33','2026-02-21 07:53:52'),(24,7,'Oil','oil',22,'Litre',145.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1771394792/store-products/izjbwxemqslr0p1vn1dl.png','2026-02-18 06:06:34','2026-02-18 06:07:53'),(25,8,'Kafan','kafan',44,'Unit',349.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1771395049/store-products/unuzowtoyp8iniqzonck.jpg','2026-02-18 06:10:50','2026-02-18 06:11:19'),(33,12,'Item1','item1',1270,'Mil',33333.00,'https://res.cloudinary.com/dtfdgup2r/image/upload/v1772083869/store-products/usthsb9c868phbvuvzuf.jpg','2026-02-26 05:31:06','2026-02-26 05:32:00');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shops`
--

DROP TABLE IF EXISTS `shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shops` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `username` varchar(120) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shops`
--

LOCK TABLES `shops` WRITE;
/*!40000 ALTER TABLE `shops` DISABLE KEYS */;
INSERT INTO `shops` VALUES (1,'Electronics One','rajivrawatt054@gmail.com','rajiv123','2026-02-10 09:29:39'),(7,'Meri Dukaan','shivamrawatt054@gmail.com','shiv123','2026-02-18 05:48:26'),(8,'Kitaab Ghar','suraj@gmail.com','suraj123','2026-02-18 06:03:16'),(12,'AtiSunder','rajivrawatt054@gmail.com','sunder123','2026-02-26 05:30:08');
/*!40000 ALTER TABLE `shops` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_transactions`
--

DROP TABLE IF EXISTS `subscription_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subscription_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `payment_id` varchar(150) DEFAULT NULL,
  `plan` varchar(50) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(30) DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `subscription_transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_transactions`
--

LOCK TABLES `subscription_transactions` WRITE;
/*!40000 ALTER TABLE `subscription_transactions` DISABLE KEYS */;
INSERT INTO `subscription_transactions` VALUES (1,22,NULL,'weekly',59.00,'PAID','2026-02-20 13:49:45'),(2,24,NULL,'monthly',149.00,'PAID','2026-02-20 16:01:56'),(3,1,NULL,'monthly',149.00,'PAID','2026-02-20 16:04:28'),(4,1,NULL,'weekly',59.00,'PAID','2026-02-21 09:56:42'),(5,1,NULL,'weekly',59.00,'PAID','2026-02-21 10:20:07'),(6,1,NULL,'weekly',59.00,'PAID','2026-02-21 10:20:40'),(7,1,NULL,'monthly',149.00,'PAID','2026-02-21 10:21:53'),(8,1,NULL,'weekly',59.00,'PAID','2026-02-21 10:32:02'),(9,1,NULL,'weekly',59.00,'PAID','2026-02-21 10:40:54'),(10,1,NULL,'weekly',59.00,'PAID','2026-02-21 10:41:12'),(11,1,NULL,'weekly',59.00,'PAID','2026-02-21 10:50:32'),(12,1,NULL,'weekly',59.00,'PAID','2026-02-21 10:56:18'),(13,1,NULL,'weekly',59.00,'PAID','2026-02-21 11:05:58'),(14,1,NULL,'weekly',59.00,'PAID','2026-02-21 11:07:39'),(15,1,NULL,'weekly',59.00,'PAID','2026-02-25 08:13:52'),(16,1,NULL,'weekly',59.00,'PAID','2026-02-26 05:22:03'),(17,1,NULL,'weekly',59.00,'PAID','2026-02-26 05:22:29'),(18,28,NULL,'weekly',59.00,'PAID','2026-02-26 05:30:38'),(19,1,NULL,'monthly',149.00,'PAID','2026-03-06 15:15:45'),(20,1,NULL,'monthly',149.00,'PAID','2026-03-06 15:16:01');
/*!40000 ALTER TABLE `subscription_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction_items`
--

DROP TABLE IF EXISTS `transaction_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `transaction_id` int NOT NULL,
  `product_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `quantity` int DEFAULT NULL,
  `unit` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transaction_id` (`transaction_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `transaction_items_ibfk_1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`),
  CONSTRAINT `transaction_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction_items`
--

LOCK TABLES `transaction_items` WRITE;
/*!40000 ALTER TABLE `transaction_items` DISABLE KEYS */;
INSERT INTO `transaction_items` VALUES (1,1,5,'Earbuds',899.00,1,'Unit'),(2,2,4,'Bluetooth Speaker',1499.00,1,'Unit'),(4,4,1,'Air Fryer',3999.00,6,' Unit'),(5,5,3,'Hair dryer',999.00,1,'Unit'),(6,6,1,'Air Fryer',3999.00,1,' Unit'),(7,7,4,'Bluetooth Speaker',1499.00,1,'Unit'),(9,9,4,'Bluetooth Speaker',1499.00,1,'Unit'),(10,10,1,'Air Fryer',3999.00,1,' Unit'),(11,11,1,'Air Fryer',3999.00,1,' Unit'),(12,12,4,'Bluetooth Speaker',1499.00,1,'Unit'),(13,13,1,'Air Fryer',3999.00,1,' Unit'),(14,14,24,'Oil',145.00,1,'Litre'),(15,15,25,'Kafan',349.00,1,'Unit'),(16,16,1,'Air Fryer',3999.00,1,' Unit'),(17,17,1,'Air Fryer',3999.00,1,' Unit'),(20,20,1,'Air Fryer',4599.00,1,'Unit'),(21,21,5,'Earbuds',899.00,1,'Unit');
/*!40000 ALTER TABLE `transaction_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `shop_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `time` datetime DEFAULT CURRENT_TIMESTAMP,
  `payment_method` enum('CASH','CARD') DEFAULT NULL,
  `payment_status` enum('PENDING','PAID','FAILED') DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_mobile` varchar(50) DEFAULT NULL,
  `stripe_payment_intent_id` varchar(255) DEFAULT NULL,
  `stripe_client_secret` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `shop_id` (`shop_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,1,899.00,'2026-02-10 10:11:06','CASH','PAID','shivam','7714171462',NULL,NULL,'2026-02-10 10:11:06'),(2,1,1499.00,'2026-02-10 10:12:13','CARD','PAID','shivam','9739450865','pi_3SzDvWL2iMDwTsCf03whOWaf','pi_3SzDvWL2iMDwTsCf03whOWaf_secret_VAGYjitaP0n0esxkouGlZoUAj','2026-02-10 10:12:13'),(4,1,23994.00,'2026-02-10 13:02:41','CARD','FAILED','Gshsh','6461616','pi_3SzGaUL2iMDwTsCf06fZYqSo','pi_3SzGaUL2iMDwTsCf06fZYqSo_secret_HQCubLttmhLetP0CIKgc5fTJb','2026-02-10 13:02:41'),(5,1,999.00,'2026-02-11 04:48:54','CARD','PAID','Donald Trump ','7979797979','pi_3SzVMBL2iMDwTsCf0yYdYhHZ','pi_3SzVMBL2iMDwTsCf0yYdYhHZ_secret_KisS7WjTQXCSwd8hgVnrroFm1','2026-02-11 04:48:54'),(6,1,3999.00,'2026-02-12 12:19:29','CASH','PAID','shivam','9785857365',NULL,NULL,'2026-02-12 12:19:29'),(7,1,1499.00,'2026-02-12 12:19:54','CARD','PAID','rajan','8795049867','pi_3SzysAL2iMDwTsCf07sBhzbR','pi_3SzysAL2iMDwTsCf07sBhzbR_secret_DGxenpT9DkwufhGlyyLm0Cs2M','2026-02-12 12:19:54'),(9,1,1499.00,'2026-02-14 10:00:10','CASH','PAID','Shivam','35659592925',NULL,NULL,'2026-02-14 10:00:10'),(10,1,3999.00,'2026-02-14 10:00:28','CARD','PAID','Rajiv','64682028','pi_3T0feLL2iMDwTsCf0VDEEQzU','pi_3T0feLL2iMDwTsCf0VDEEQzU_secret_6ouPZITBZdtkaYvN6fPyiUOD9','2026-02-14 10:00:28'),(11,1,3999.00,'2026-02-16 09:32:49','CASH','PAID','Shivam','9729130865',NULL,NULL,'2026-02-16 09:32:49'),(12,1,1499.00,'2026-02-16 09:39:05','CARD','PAID','sanjay','8939737465','pi_3T1OGkL2iMDwTsCf1WqyTuMp','pi_3T1OGkL2iMDwTsCf1WqyTuMp_secret_hgRiOv13XnEsSylDy2ySto83d','2026-02-16 09:39:05'),(13,1,3999.00,'2026-02-16 12:50:11','CARD','PAID','Rawat','9720130985','pi_3T1RFgL2iMDwTsCf1T6zEhPn','pi_3T1RFgL2iMDwTsCf1T6zEhPn_secret_220WMYKCZYgoA1tbnCuPm87Wf','2026-02-16 12:50:11'),(14,7,145.00,'2026-02-18 06:07:25','CARD','PAID','rahul','6857574847','pi_3T23v2L2iMDwTsCf1VeYClPg','pi_3T23v2L2iMDwTsCf1VeYClPg_secret_YbWIGPEPD0BTtqao8Z62uHRxo','2026-02-18 06:07:25'),(15,8,349.00,'2026-02-18 06:11:18','CASH','PAID','sanjay','9056873898',NULL,NULL,'2026-02-18 06:11:18'),(16,1,3999.00,'2026-02-20 04:54:38','CASH','PAID','Rajiv','12345678908',NULL,NULL,'2026-02-20 04:54:38'),(17,1,3999.00,'2026-02-20 08:27:22','CARD','PAID','rawat','7878787778','pi_3T2p3ZL2iMDwTsCf05buBErv','pi_3T2p3ZL2iMDwTsCf05buBErv_secret_yAb3rnUZLWthbMHrDr375ZIZ8','2026-02-20 08:27:22'),(20,1,4599.00,'2026-02-26 05:27:25','CASH','PAID','Shivam','7668892003',NULL,NULL,'2026-02-26 05:27:25'),(21,1,899.00,'2026-02-26 05:27:40','CARD','PAID','Rajiv','7668892003','pi_3T4x6vL2iMDwTsCf0bbUIm1Y','pi_3T4x6vL2iMDwTsCf0bbUIm1Y_secret_wxiWa39MxjdIlokcPP5FVVir7','2026-02-26 05:27:40');
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(120) NOT NULL,
  `password` varchar(255) NOT NULL,
  `shop_id` int DEFAULT NULL,
  `name` varchar(120) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `mobile` varchar(30) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `email_verified` tinyint DEFAULT '0',
  `otp` varchar(10) DEFAULT NULL,
  `otp_expires` datetime DEFAULT NULL,
  `role` enum('admin','staff') NOT NULL,
  `subscription_status` varchar(20) DEFAULT 'inactive',
  `subscription_expires` datetime DEFAULT NULL,
  `subscription_plan` varchar(50) DEFAULT NULL,
  `pending_shop_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `shop_id` (`shop_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'rajiv123','$2b$10$5hDbPwIu77yXvWfgr.UrI.KbzV5Fewe//P145f/dwS9YpLi3wReyS',1,'Rajiv singh','rajiv@gmail.com','9870684465','2026-02-10 09:29:39','2026-03-06 15:16:00',1,NULL,NULL,'admin','active','2026-04-05 15:16:01','monthly',NULL),(22,'shiv123','$2b$10$6yQcwPrC6g..Mqzz.GSFCedrchhORA1TVS.AjPA9TDKsskvYM8zBi',7,'Shivam Rawat','shivamrawatt054@gmail.com','7676767676','2026-02-18 05:47:35','2026-02-20 08:20:18',1,NULL,NULL,'admin','active','2026-02-27 08:20:19','weekly',NULL),(24,'suraj123','$2b$10$W/JOBxyf8BKDNjt3474v5u7HaKHTxgn4cyVyg2yXbN2ccjvd4IZTe',8,'Suraj Singh','suraj@gmail.com','7676767676','2026-02-18 06:02:46','2026-02-20 10:32:28',1,NULL,NULL,'admin','active','2026-03-22 10:32:29','monthly',NULL),(28,'sunder123','$2b$10$TlJaV0Oa.1N47IbU441z4.9H0BNeZUhwE0V2ZbHJ02O7TWQfAiTaK',12,'Sundar','rajivrawatt054@gmail.com','8585858588','2026-02-26 05:29:39','2026-02-26 05:30:38',1,NULL,NULL,'admin','active','2026-03-05 05:30:38','weekly',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `owner_user_view`
--

/*!50001 DROP VIEW IF EXISTS `owner_user_view`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `owner_user_view` AS select `users`.`name` AS `name`,`users`.`shop_id` AS `shop_id`,`users`.`email` AS `email`,`users`.`mobile` AS `mobile`,`users`.`subscription_status` AS `subscription_status`,`users`.`subscription_expires` AS `subscription_expires`,`users`.`created_at` AS `created_at` from `users` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-27 12:50:11
