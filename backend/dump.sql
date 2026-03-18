-- MySQL dump 10.13  Distrib 8.0.45, for macos14.8 (arm64)
--
-- Host: 127.0.0.1    Database: nestjs_tutorial
-- ------------------------------------------------------
-- Server version	8.0.45

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
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('14a0c682-c7c3-4ab0-84c9-74c641cc22a6','59e76b36fb1303926cbc3acafce67ba6460d4b648578a71ece3f8d2407aaa3c0','2026-03-13 10:52:51.396','20260313105251',NULL,NULL,'2026-03-13 10:52:51.355',1),('df7ae4cf-6950-4c65-8c4e-7d5086065629','04d1bf9dbec20064231c85e9f6928c378e1082d13d0e81db24b1a6d2b98c0f18','2026-03-10 15:03:05.245','20260310150305_new_creation',NULL,NULL,'2026-03-10 15:03:05.158',1),('e326fd69-4d09-4d43-9982-b556ab2da42c','7be6609a9ab22b4693b0869bc5da56d99ec700858c4dd69282c86e06d109724c','2026-03-14 15:50:19.042','20260314155018_like',NULL,NULL,'2026-03-14 15:50:18.982',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comment`
--

DROP TABLE IF EXISTS `Comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `likes` int NOT NULL DEFAULT '0',
  `createsAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatesAt` datetime(3) NOT NULL,
  `authorId` int NOT NULL,
  `postId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Comment_authorId_fkey` (`authorId`),
  KEY `Comment_postId_fkey` (`postId`),
  CONSTRAINT `Comment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
INSERT INTO `Comment` VALUES (1,'Nice Post',1,'2026-03-13 12:15:21.216','2026-03-15 05:51:29.006',1,1),(2,'I agree',0,'2026-03-13 12:39:49.861','2026-03-13 12:39:49.861',1,1);
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Comment_Like`
--

DROP TABLE IF EXISTS `Comment_Like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Comment_Like` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('like','dislike') COLLATE utf8mb4_unicode_ci NOT NULL,
  `userId` int NOT NULL,
  `commentId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Comment_Like_userId_commentId_key` (`userId`,`commentId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comment_Like`
--

LOCK TABLES `Comment_Like` WRITE;
/*!40000 ALTER TABLE `Comment_Like` DISABLE KEYS */;
INSERT INTO `Comment_Like` VALUES (1,'like',1,1);
/*!40000 ALTER TABLE `Comment_Like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Post`
--

DROP TABLE IF EXISTS `Post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Post` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(10000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createsAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `views` int NOT NULL DEFAULT '0',
  `likes` int NOT NULL DEFAULT '0',
  `authorId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Post_authorId_fkey` (`authorId`),
  CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Post`
--

LOCK TABLES `Post` WRITE;
/*!40000 ALTER TABLE `Post` DISABLE KEYS */;
INSERT INTO `Post` VALUES (1,'First Post','This is First Post','2026-03-11 14:01:10.854',40,-1,1),(2,'aaa','asdasd','2026-03-11 14:38:01.323',0,0,1),(3,'Cannabis','doesn\'t just blur memories—it can reshape them. A new study found THC makes people significantly more likely to \"remember\" words that were never presented (false memories) and struggle with daily tasks like remembering appointments, regardless of whether the dose was 20mg or 40mg','2026-03-12 12:50:48.467',20,0,1),(4,'What\'s it like being a physicist?','\nWhat are the best things and worse things about being a theoretically physicist. Would I like engineering more? I\'m in the process of decision making.','2026-03-12 13:51:12.994',7,0,1),(5,'George Martin','George R.R. Martin has co-authored a physics paper (Spoilers Published)\n','2026-03-12 13:56:02.299',4,0,7),(6,'hoping r/physics sees this and unbans me','\ni have more questions to ask\n\nlike\n\nwhy does \"gravity\" make everything round except for Time?','2026-03-12 13:56:28.881',2,0,7),(7,'Korean tteokbokki chain Dookki’s Taiwan branch runs promo mocking Korea’s WBC loss, sparks backlash and forced apology','Dookki (두끼), one of Korea’s biggest tteokbokki franchise brands, is facing backlash after its Taiwan branch posted a marketing promo on social media that taunted Korea’s 4-5 loss to Taiwan in the WBC group stage on March 8.\n\nThe promo featured photos of a man kneeling and holding a sign reading “We shouldn’t have manipulated the score” and “A gentleman doesn’t blame tteokbokki,” advertising a two-person set for 540 TWD (~25,000 KRW) through the end of Marc\n','2026-03-12 13:57:48.440',4,0,7),(8,'Is a math degree really useless?','\nHello, I am torn as I love math a ton and it’s the one subject I feel pretty confident in. I am currently in calculus 2 at university and I’ve gotten an A in every math class this past year. I even find myself working ahead as I practiced integrate by parts, trig sub, and partial fractions prior to us learning them. I love everything in every math class I’ve taken so far and I’ve even tried out a few proofs and I really enjoy them!','2026-03-12 14:06:40.932',2,0,7),(9,'AI can\'t do math. Why?','So, I asked bard.google to convert 1,035,000 MB to the simplest form to see if it could do it. It then said this was equal to 1 GB. What? I asked it some clarifying questions and . . . it doubled down on its answer.\n\n','2026-03-12 14:08:17.364',4,0,4),(10,'AI can\'t do math. Why?','\nSo, I asked bard.google to convert 1,035,000 MB to the simplest form to see if it could do it. It then said this was equal to 1 GB. What? I asked it some clarifying questions and . . . it doubled down on its answer.','2026-03-12 14:08:59.886',2,0,4),(11,'TSA officer callouts','spike amid partial government shutdown as more than 300 leave agency','2026-03-12 14:10:20.691',8,0,4),(12,'Iranian school was on U.S. target list, may have been mistaken as military site','\nThe strike killed at least 175, many of them children, and has raised questions as to whether the military’s use of AI to identify targets was a factor.','2026-03-12 14:11:03.097',16,0,4);
/*!40000 ALTER TABLE `Post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Post_Like`
--

DROP TABLE IF EXISTS `Post_Like`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Post_Like` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `postId` int NOT NULL,
  `type` enum('like','dislike') COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Post_Like_postId_userId_key` (`postId`,`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Post_Like`
--

LOCK TABLES `Post_Like` WRITE;
/*!40000 ALTER TABLE `Post_Like` DISABLE KEYS */;
INSERT INTO `Post_Like` VALUES (2,1,1,'dislike');
/*!40000 ALTER TABLE `Post_Like` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `User` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createsAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_username_key` (`username`),
  UNIQUE KEY `User_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'NeolJoahae','minsuk603@gmail.com','$2b$12$YmTFYiLlUbZiFGWtg/e8POZEs32t/aQMtgeYU7oqsn/PeV5eXBsaO','2026-03-11 13:24:37.984'),(4,'mohae','mkwon@ucsd.edu','$2b$12$UE6Cxex/iSrn42w85QITWO9AlrDDcZiRL4KCJF4cv4l4k4C6QSn7.','2026-03-11 13:29:50.312'),(5,'GGoggi','mkwon@naver.com','$2b$12$USb3nymDrS9xL0eXbrcheu9.0YWwR6Mg/rr7MpwBcfTAWNe2QF82e','2026-03-11 13:39:30.197'),(6,'Sogoggi','minsuk603@naver.com','$2b$12$wkkpJdCdho9/9ifBVXYDHOcYeFIaBx8l7z6o1ryyWUoE/oZ.Tgk0.','2026-03-11 13:40:07.979'),(7,'Mulgogi','mulgogi@yahoo.com','$2b$12$vE0e.dgWKQG4fzwjqf/i2eB/q6P4vREYNcZYZrCLmYYWQXK/Ak0.S','2026-03-12 13:54:12.284'),(8,'loginlogin','someweirdemail@somewirdsite.com','$2b$12$0cyl.6L2NirStkLk2lTFYOqxBQWCjJJEbGSNMNUKpgwACLeEyHkMK','2026-03-18 12:57:37.321');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `UserSetting`
--

DROP TABLE IF EXISTS `UserSetting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `UserSetting` (
  `id` int NOT NULL AUTO_INCREMENT,
  `notification` tinyint(1) NOT NULL,
  `snsEnabled` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `UserSetting`
--

LOCK TABLES `UserSetting` WRITE;
/*!40000 ALTER TABLE `UserSetting` DISABLE KEYS */;
/*!40000 ALTER TABLE `UserSetting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VerificationCode`
--

DROP TABLE IF EXISTS `VerificationCode`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VerificationCode` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createsAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatesAt` datetime(3) DEFAULT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `requestNum` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `VerificationCode_userId_key` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VerificationCode`
--

LOCK TABLES `VerificationCode` WRITE;
/*!40000 ALTER TABLE `VerificationCode` DISABLE KEYS */;
/*!40000 ALTER TABLE `VerificationCode` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-18 22:58:20
