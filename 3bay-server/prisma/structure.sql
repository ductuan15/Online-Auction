-- MariaDB dump 10.19  Distrib 10.6.5-MariaDB, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: 3bay
-- ------------------------------------------------------
-- Server version	10.6.5-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE = @@TIME_ZONE */;
/*!40103 SET TIME_ZONE = '+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0 */;
/*!40101 SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins`
(
    `id`           varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `name`         varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email`        varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `dob`          datetime                                DEFAULT NULL,
    `refreshToken` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `auctions`
--

DROP TABLE IF EXISTS `auctions`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auctions`
(
    `id`                      int(11)        NOT NULL AUTO_INCREMENT,
    `startTime`               datetime       NOT NULL DEFAULT current_timestamp(),
    `closeTime`               datetime                DEFAULT NULL,
    `openPrice`               decimal(19, 4) NOT NULL,
    `incrementPrice`          decimal(19, 4) NOT NULL,
    `buyoutPrice`             decimal(19, 4)          DEFAULT NULL,
    `productId`               int(11)        NOT NULL,
    `winnerBidderId`          int(11)                 DEFAULT NULL,
    `autoExtendAuctionTiming` tinyint(1)     NOT NULL,
    PRIMARY KEY (`id`),
    KEY `auctions_fk0` (`productId`),
    KEY `auctions_fk1` (`winnerBidderId`),
    CONSTRAINT `auctions_fk0` FOREIGN KEY (`productId`) REFERENCES `products` (`id`),
    CONSTRAINT `auctions_fk1` FOREIGN KEY (`winnerBidderId`) REFERENCES `bids` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bids`
--

DROP TABLE IF EXISTS `bids`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bids`
(
    `id`         int(11)                                 NOT NULL,
    `bidPrice`   decimal(19, 4)                          NOT NULL DEFAULT 0.0000,
    `bidTime`    datetime                                NOT NULL DEFAULT current_timestamp(),
    `bidComment` varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
    `isAccepted` tinyint(1)                              NOT NULL DEFAULT 1,
    `bidderId`   varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `auctionId`  int(11)                                 NOT NULL,
    PRIMARY KEY (`id`),
    KEY `bids_fk0` (`bidderId`),
    KEY `bids_fk1` (`auctionId`),
    CONSTRAINT `bids_fk0` FOREIGN KEY (`bidderId`) REFERENCES `users` (`uuid`),
    CONSTRAINT `bids_fk1` FOREIGN KEY (`auctionId`) REFERENCES `auctions` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories`
(
    `id`         int(11)                                 NOT NULL AUTO_INCREMENT,
    `title`      varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
    `parent_id`  int(11)                                          DEFAULT NULL,
    `created_at` datetime                                         DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `id_UNIQUE` (`id`),
    UNIQUE KEY `categories_title_uindex` (`title`),
    KEY `fk_category_category_idx` (`parent_id`),
    CONSTRAINT `categories_fk0` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB
  AUTO_INCREMENT = 38
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_des_history`
--

DROP TABLE IF EXISTS `product_des_history`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_des_history`
(
    `id`          int(11)                                 NOT NULL AUTO_INCREMENT,
    `description` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `productId`   int(11)                                 NOT NULL,
    `createdAt`   datetime                                NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `product_des_history_fk0` (`productId`),
    CONSTRAINT `product_des_history_fk0` FOREIGN KEY (`productId`) REFERENCES `products` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_images`
(
    `id`        int(11)                         NOT NULL AUTO_INCREMENT,
    `productId` int(11)                         NOT NULL,
    `img`       text COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`id`),
    KEY `product_images_fk0` (`productId`),
    CONSTRAINT `product_images_fk0` FOREIGN KEY (`productId`) REFERENCES `products` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products`
(
    `id`           int(11)                                 NOT NULL AUTO_INCREMENT,
    `name`         varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `categoryId`   int(11)                                 NOT NULL,
    `sellerId`     int(11)                                 NOT NULL,
    `createdAt`    datetime                                NOT NULL DEFAULT current_timestamp(),
    `deletedAt`    datetime                                         DEFAULT NULL,
    `currentPrice` decimal(19, 4)                          NOT NULL,
    PRIMARY KEY (`id`),
    KEY `products_fk0` (`categoryId`),
    CONSTRAINT `products_fk0` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `upgrade_to_bidder_requests`
--

DROP TABLE IF EXISTS `upgrade_to_bidder_requests`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `upgrade_to_bidder_requests`
(
    `userId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`userId`),
    CONSTRAINT `upgrade_to_bidder_requests_fk0` FOREIGN KEY (`userId`) REFERENCES `users` (`uuid`) ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_watchlist`
--

DROP TABLE IF EXISTS `user_watchlist`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_watchlist`
(
    `userId`    varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `productId` int(11)                                 NOT NULL,
    PRIMARY KEY (`userId`, `productId`),
    KEY `user_watchlist_fk0` (`userId`),
    KEY `user_watchlist_fk1` (`productId`),
    CONSTRAINT `user_watchlist_fk0` FOREIGN KEY (`userId`) REFERENCES `users` (`uuid`) ON UPDATE CASCADE,
    CONSTRAINT `user_watchlist_fk1` FOREIGN KEY (`productId`) REFERENCES `products` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users`
(
    `uuid`         varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT uuid(),
    `name`         varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email`        varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `isDisabled`   tinyint(1)                              NOT NULL DEFAULT 0,
    `type`         int(11)                                 NOT NULL DEFAULT 0,
    `pwd`          varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `dob`          datetime                                         DEFAULT NULL,
    `verified`     tinyint(1)                              NOT NULL DEFAULT 0,
    `profile`      varchar(255) CHARACTER SET utf8mb3               DEFAULT NULL,
    `refreshToken` varchar(255) COLLATE utf8mb4_unicode_ci          DEFAULT NULL,
    PRIMARY KEY (`uuid`),
    UNIQUE KEY `email` (`email`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE = @OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE = @OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT = @OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS = @OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION = @OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES = @OLD_SQL_NOTES */;

-- Dump completed on 2021-12-12 19:27:39
