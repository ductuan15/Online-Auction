-- MariaDB dump 10.19  Distrib 10.6.5-MariaDB, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: 3bay
-- ------------------------------------------------------
-- Server version	10.6.5-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE = @@TIME_ZONE */;
/*!40103 SET TIME_ZONE = '+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS, UNIQUE_CHECKS = 0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0 */;
/*!40101 SET @OLD_SQL_MODE = @@SQL_MODE, SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES = @@SQL_NOTES, SQL_NOTES = 0 */;

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
    `winningBidId`            int(11)                 DEFAULT NULL,
    `autoExtendAuctionTiming` tinyint(1)     NOT NULL,
    `currentPrice`            decimal(19, 4) NOT NULL DEFAULT 0.0000,
    PRIMARY KEY (`id`),
    KEY `auctions_fk0` (`productId`),
    KEY `auctions_fk1` (`winningBidId`),
    CONSTRAINT `auctions_fk0` FOREIGN KEY (`productId`) REFERENCES `products` (`id`),
    CONSTRAINT `auctions_fk1` FOREIGN KEY (`winningBidId`) REFERENCES `bids` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!50003 SET @saved_cs_client = @@character_set_client */;
/*!50003 SET @saved_cs_results = @@character_set_results */;
/*!50003 SET @saved_col_connection = @@collation_connection */;
/*!50003 SET character_set_client = utf8mb3 */;
/*!50003 SET character_set_results = utf8mb3 */;
/*!50003 SET collation_connection = utf8mb4_general_ci */;
/*!50003 SET @saved_sql_mode = @@sql_mode */;
/*!50003 SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO' */;
DELIMITER ;;
/*!50003 CREATE */ /*!50017 DEFINER =`root`@`localhost`*/ /*!50003 TRIGGER only_one_opening_auction_per_product
    BEFORE INSERT
    on auctions
    FOR EACH ROW
BEGIN
    DECLARE openingAuction INT;
    SELECT COUNT(*)
    INTO openingAuction
    FROM auctions
    WHERE auctions.productId = NEW.productId
      AND (auctions.closeTime IS NULL OR auctions.closeTime > NOW());
    IF openingAuction > 0 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'One auction has been opened for this product';
    END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode = @saved_sql_mode */;
/*!50003 SET character_set_client = @saved_cs_client */;
/*!50003 SET character_set_results = @saved_cs_results */;
/*!50003 SET collation_connection = @saved_col_connection */;
/*!50003 SET @saved_cs_client = @@character_set_client */;
/*!50003 SET @saved_cs_results = @@character_set_results */;
/*!50003 SET @saved_col_connection = @@collation_connection */;
/*!50003 SET character_set_client = utf8mb4 */;
/*!50003 SET character_set_results = utf8mb4 */;
/*!50003 SET collation_connection = utf8mb4_unicode_ci */;
/*!50003 SET @saved_sql_mode = @@sql_mode */;
/*!50003 SET sql_mode =
        'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */;
DELIMITER ;;
/*!50003 CREATE */ /*!50017 DEFINER =`root`@`localhost`*/ /*!50003 TRIGGER update_latest_auctions
    AFTER INSERT
    on auctions
    FOR EACH ROW
BEGIN
    UPDATE products
    SET products.latestAuctionId = new.id
    WHERE products.id = new.productId;
END */;;
DELIMITER ;
/*!50003 SET sql_mode = @saved_sql_mode */;
/*!50003 SET character_set_client = @saved_cs_client */;
/*!50003 SET character_set_results = @saved_cs_results */;
/*!50003 SET collation_connection = @saved_col_connection */;

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
    CONSTRAINT `categories_fk0` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `otp`
--

DROP TABLE IF EXISTS `otp`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `otp`
(
    `id`         varchar(255) COLLATE utf8mb4_unicode_ci                                NOT NULL,
    `type`       enum ('VERIFY','CHANGE_PWD','CHANGE_EMAIL') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VERIFY',
    `otp`        varchar(255) COLLATE utf8mb4_unicode_ci                                NOT NULL,
    `expiryTime` datetime                                                               NOT NULL,
    `data`       varchar(255) COLLATE utf8mb4_unicode_ci                                         DEFAULT NULL,
    PRIMARY KEY (`id`, `type`)
) ENGINE = InnoDB
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
    `id`          int(11)                         NOT NULL AUTO_INCREMENT,
    `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `productId`   int(11)                         NOT NULL,
    `createdAt`   datetime                        NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `product_des_history_fk0` (`productId`),
    CONSTRAINT `product_des_history_fk0` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
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
    `id`              int(11)                                 NOT NULL AUTO_INCREMENT,
    `name`            varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `categoryId`      int(11)                                 NOT NULL,
    `sellerId`        varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `createdAt`       datetime                                NOT NULL DEFAULT current_timestamp(),
    `deletedAt`       datetime                                         DEFAULT NULL,
    `latestAuctionId` int(11)                                          DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `latestAuctionId_UNIQUE` (`latestAuctionId`),
    KEY `products_fk0` (`categoryId`),
    KEY `products_fk1` (`sellerId`),
    FULLTEXT KEY `name` (`name`),
    CONSTRAINT `products_fk0` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON UPDATE CASCADE,
    CONSTRAINT `products_fk1` FOREIGN KEY (`sellerId`) REFERENCES `users` (`uuid`) ON UPDATE CASCADE,
    CONSTRAINT `products_fk2` FOREIGN KEY (`latestAuctionId`) REFERENCES `auctions` (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `upgrade_to_seller_requests`
--

DROP TABLE IF EXISTS `upgrade_to_seller_requests`;
/*!40101 SET @saved_cs_client = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `upgrade_to_seller_requests`
(
    `userId` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (`userId`),
    CONSTRAINT `upgrade_to_seller_requests_fk0` FOREIGN KEY (`userId`) REFERENCES `users` (`uuid`) ON UPDATE CASCADE
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
    `uuid`         varchar(255) COLLATE utf8mb4_unicode_ci                             NOT NULL,
    `name`         varchar(255) COLLATE utf8mb4_unicode_ci                             NOT NULL,
    `email`        varchar(255) COLLATE utf8mb4_unicode_ci                             NOT NULL,
    `isDisabled`   tinyint(1)                                                          NOT NULL DEFAULT 0,
    `role`         enum ('BIDDER','SELLER','ADMINISTRATOR') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'BIDDER',
    `pwd`          varchar(255) COLLATE utf8mb4_unicode_ci                             NOT NULL,
    `dob`          datetime                                                                     DEFAULT NULL,
    `verified`     tinyint(1)                                                          NOT NULL DEFAULT 0,
    `profile`      varchar(255) COLLATE utf8mb4_unicode_ci                                      DEFAULT NULL,
    `refreshToken` varchar(512) COLLATE utf8mb4_unicode_ci                             NOT NULL,
    `address`      varchar(255) COLLATE utf8mb4_unicode_ci                                      DEFAULT NULL,
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

-- Dump completed on 2021-12-31 23:14:00
