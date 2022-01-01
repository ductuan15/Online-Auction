-- MariaDB dump 10.19  Distrib 10.6.5-MariaDB, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: 3bay
-- ------------------------------------------------------
-- Server version	10.6.5-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `_prisma_migrations`
--


--
-- Dumping data for table `auctions`
--

INSERT INTO `auctions` VALUES (1,'2021-12-27 05:49:50','2021-12-30 04:40:21',1000.0000,10000.0000,100000000.0000,1,NULL,1,1.0000,NULL,NULL,NULL,NULL),(2,'2021-12-27 05:50:14','2021-12-30 04:40:21',1000.0000,10000.0000,100000000.0000,2,NULL,1,2.0000,NULL,NULL,NULL,NULL),(3,'2021-12-27 05:50:31','2021-12-30 04:40:21',1000.0000,10000.0000,100000000.0000,3,NULL,1,3.0000,NULL,NULL,NULL,NULL),(4,'2021-12-27 05:50:42','2021-12-30 04:40:21',1000.0000,10000.0000,100000000.0000,4,NULL,1,4.0000,NULL,NULL,NULL,NULL),(5,'2021-12-27 05:50:54','2021-12-30 04:40:21',1000.0000,10000.0000,100000000.0000,5,NULL,1,5.0000,NULL,NULL,NULL,NULL);

--
-- Dumping data for table `bids`
--

INSERT INTO `bids` VALUES (1,500000.0000,'2022-01-01 07:21:49',NULL,'c5c40bc7-3166-46e0-b36a-68364e76770d',1,'ACCEPTED'),(2,600000.0000,'2022-01-01 07:27:04',NULL,'c5c40bc7-3166-46e0-b36a-68364e76770d',1,'ACCEPTED');

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` VALUES (1,'Electronics',NULL,'2021-11-15 17:54:55'),(2,'Laptops & PC',1,'2021-11-15 17:54:55'),(5,'Cameras & photo',1,'2021-11-15 17:54:55'),(6,'Camera',1,'2021-11-15 17:54:55'),(7,'Phones & Accessories',1,'2021-11-15 17:54:55'),(13,'Headsets',1,'2021-11-15 17:54:55'),(14,'Screen Protectors',1,'2021-11-15 17:54:55'),(15,'A',NULL,'2021-12-31 15:13:37');

--
-- Dumping data for table `otp`
--


--
-- Dumping data for table `product_des_history`
--

INSERT INTO `product_des_history` VALUES (8,'<p style=\"margin-left:0px;\"></p>\n<h1 style=\"margin-left:0px;\"><span style=\"color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 32px;font-family: Manrope;\">メンヘラ少女。３</span></h1>\n<p style=\"margin-left:0px;\"><span style=\"color: rgb(115,115,115);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto;\"><strong>目が覚めてから眠るまで、ずーっと一緒にいたいよー。だってキミが今何ををしているのか気になって何もできないんだもん。だーいすきだよ❤</strong></span></p>\n<p><span style=\"font-family: Roboto;\"><ins>https://store.line.me/stickershop/product/7103883/ja</ins><strong><br></strong></span></p>\n',1,'2021-12-31 17:47:05'),(13,'<p style=\"margin-left:0px;\"></p>\n<h1 style=\"margin-left:0px;\"><span style=\"color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 32px;font-family: Manrope;\">メンヘラ少女。３</span></h1>\n<p style=\"margin-left:0px;\"><span style=\"color: rgb(115,115,115);background-color: rgb(255,255,255);font-size: 14px;font-family: Roboto;\"><strong>目が覚めてから眠るまで、ずーっと一緒にいたいよー。だってキミが今何ををしているのか気になって何もできないんだもん。だーいすきだよ❤</strong></span></p>\n<p><span style=\"font-family: Roboto;\"><ins>https://store.line.me/stickershop/product/7103883/ja</ins><strong><br></strong></span></p>\n',2,'2021-12-31 19:05:35'),(14,'',3,'2021-12-31 19:19:06'),(15,'<p><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\"><strong><ins>■商品名■</ins></strong></span><strong><ins><br></ins></strong><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\">耳が動くうさぎ帽子 LEDライトタイプ</span><br><br><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\"><strong><ins>■商品説明■</ins></strong></span><strong><ins><br></ins></strong><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\">大人気！ぴょこぴょこ耳が動くうさぎ帽子</span><br><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\">LEDタイプで夜間や屋内のイベントにも！</span><br><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\">韓流スターやインフルエンサーなど著名人が身につけて 話題の「耳が動く帽子」からうさぎタイプが登場！</span><br><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\">TWICE BTS バンタンファンにおすすめです！</span><br><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\">Instagram(インスタグラム)やTikTok動画投稿にも人気です</span><br><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\">フリーサイズだから親子で楽しめます♪</span><br><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\">男の子・女の子にも似合うキュートなデザイン</span><br><br><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\"><strong><ins>■注意事項■</ins></strong></span><strong><ins><br></ins></strong><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\">※画像は、ご覧になっているモニターやPCなどの環境により、実物と多少カラーが異なる場合がございます。色味やサイズが異なるなどのクレームはご対応致しかねますので、ご了承ください。</span><br><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\">※光の当たり方、画面の明るさに よって色の見え方が若干異なり ます。ご了承ください。</span><br><br><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\"><strong><ins>【関連ワード】</ins></strong></span><strong><ins><br></ins></strong><span style=\"color: rgb(51,51,51);background-color: rgb(255,255,255);font-size: 13px;font-family: Hiragino Kaku Gothic ProN\", HiraKakuProN-W3, Meiryo, sans-serif, system-ui, emoji;\">韓流アイドル ライブ グッズ TWICE BTS ナヨン バンタン K-POP クラブ かわいい うさぎ帽子 耳が動く うさぎぼうし 変身 パーティー 誕生日 プレゼント 贈り物 男女兼用 超人気 ウサ耳ダンス 韓国 キャップ ハロウィン 仮装 コスプレ 耳がパタパタ 白</span></p>\n',4,'2021-12-31 19:23:37');

--
-- Dumping data for table `product_images`
--


--
-- Dumping data for table `products`
--

INSERT INTO `products` VALUES (1,'Samsung Galaxy Z Fold3 5G 256GB',7,'168d2f00-74a7-4eaa-b910-28db52f69048','2021-12-20 11:32:39',NULL,1),(2,'iPhone 13 Pro 128GB',7,'168d2f00-74a7-4eaa-b910-28db52f69048','2021-12-20 11:34:06',NULL,2),(3,'Lenovo Yoga Slim 7 14ITL05 i5 1135G7/8GB/512GB/Win10 (82A300DPVN) ',2,'168d2f00-74a7-4eaa-b910-28db52f69048','2021-12-20 11:40:21',NULL,3),(4,'Laptop Apple MacBook Pro 16 M1 Max 2021 10 core-CPU/32GB/1TB SSD/32 core-GPU',2,'168d2f00-74a7-4eaa-b910-28db52f69048','2021-12-20 11:42:18',NULL,4),(5,'Máy ảnh Fujifilm GFX 50S Mark II',6,'168d2f00-74a7-4eaa-b910-28db52f69048','2021-12-20 11:46:31',NULL,5),(9,'メンヘラ少女。LINE STICKER',5,'f81e827e-ea75-43cf-ae4e-5e676d25592c','2021-12-31 17:47:05',NULL,NULL),(14,'メンヘラ少女。LINE STICKER 2',5,'f81e827e-ea75-43cf-ae4e-5e676d25592c','2021-12-31 19:05:35',NULL,NULL),(15,'きもち',6,'f81e827e-ea75-43cf-ae4e-5e676d25592c','2021-12-31 19:19:06',NULL,NULL),(16,'耳が動くうさぎ帽子 LEDタイプ 韓国 韓流グッズ 女の子 子ども アイドル ウサギ帽子 耳が動く オルチャン',6,'f81e827e-ea75-43cf-ae4e-5e676d25592c','2021-12-31 19:23:37',NULL,NULL),(17,'S',6,'f81e827e-ea75-43cf-ae4e-5e676d25592c','2021-12-31 19:26:52',NULL,NULL);

--
-- Dumping data for table `upgrade_to_seller_requests`
--

INSERT INTO `upgrade_to_seller_requests` VALUES ('a5ffdd5c-2aff-4efc-8ec8-f87c74f9c1da');

--
-- Dumping data for table `user_watchlist`
--

INSERT INTO `user_watchlist` VALUES ('f81e827e-ea75-43cf-ae4e-5e676d25592c',1),('f81e827e-ea75-43cf-ae4e-5e676d25592c',2);

--
-- Dumping data for table `users`
--

INSERT INTO `users` VALUES ('168d2f00-74a7-4eaa-b910-28db52f69048','Shirato Jiro','example@email.com',0,'BIDDER','$2b$10$hS91w5CLXlL30gSoUwvZn.B7YaYacBzD8wyO440tUzzs8t30F7HvO','2021-12-01 13:36:52',1,NULL,'62301bffc3dfb45d4439aa2db6dd4c901bbaee81d5e26f30c6397aa651934b0d0b324d0199d6d39e7fc8af74638f9367af621f4ef46713862801d11b09353a986448e4e3ec08997e94e8e6847213e843ec325d21f682a579fcdba0b08fa48f12f22bef84ca31ed4a642d82617634cef49ca6d685bf866ac765108c3a3148163e21204decaa14facf2bf12eb7f2955c2ae3f855b8b0dbb27cd744efd15dcfaf21eddb4bf7c47dead4302d6955e8407a0d02b1ab826f4b39d5073b34438aecb8c80645e67c262f7acf6dc27b69757f53d4e1478a3aeb9af8bd2ac37e4d1874cabaad302afa8966909c1ed57737bf5a126b7e7429c099eb9abf4d97a85a92161ad3','〒106-0044東京都港区東麻布1-8-1-801'),('8a1a78b7-df44-426b-897b-d0da597f7fe2','Tuan Cuong','example.tuan@gmail.com',0,'ADMINISTRATOR','$2b$10$hS91w5CLXlL30gSoUwvZn.B7YaYacBzD8wyO440tUzzs8t30F7HvO','2000-06-14 17:00:00',1,NULL,'9982a0c5a79f8d056f50d27e1eca22f0221d4b0d543f369362ad5d40aaacb108495b975b421a06b86b84ff5a89a9bda9ae42093d1ab7de58d4219f50d06d7a447a67089f0c1ae326806c7afba652765bab328942bc9ba22f1b4455890d76d50afcf9f69b23e4c753478f44df2e4533dcb3cdbdd227b35eaf29506a3080d6be0d8072f432320562a770d75e83e5d9daf0e5ed99986eb0e7a16de8e915f83d93bdfaa63640418a89d823745456ee0d775d7eb5f9c14df142b8882baef025e6ffeb0291ab565cf39349ec95ee72a261d1ac7ec95a244b4b30ab120f2d2d1db9cfd3854b88cd9ebfc244e4ad4e3d6b940cd072e978b49ef2243db6d7a49bbe7f7a20','500 LVQ'),('a5ffdd5c-2aff-4efc-8ec8-f87c74f9c1da','Kiet Hoang','example.kiet@gmail.com',0,'BIDDER','$2b$10$S4k6JJWGBmSwFNxfAWiaKuGhRivtxhUgA5/V.dNjxI3lNTHWxecYG','2000-11-05 17:00:00',1,NULL,'cc0dd8feb43334cd940c20edbfb3cb5e58865913e1457524cfeb6a01e6b360a19ec09cc0b1bcb8a509445337392cf60c85c1af77704d2f9c37adf0084223d5cf935613489591e7f4e26cf3be05ec2e3d29cd6fb265195c5c9371c7ab69e35ccb0c42a04d545c7ce5bf8815b217c54c7738f3ee3a4bbce3824480db28ed98095be410d5a28294e7ef735d2bd14f8e849ec0b353c80c0270f6cb1afed55c13ed68e3aad07b02a186c4a8f55176bca38a4129ca63fb8adc85ca3693dcf2f31672e60ddfe30a2ef88ebcb2c9c1233fdf815d3d2723fcb8d65574763f4ae085ddd11b14f61ef6d2d1884308c29b9ab798f8ba7836e7fb7eabcbd7d63bae7760cfb04d','DN'),('c5c40bc7-3166-46e0-b36a-68364e76770d','Shirato Jiro Bidder','example01@email.com',0,'BIDDER','$2b$10$FlkdF6FOjWPE3IN5LBtXZ.iU01leUXsFuam4rboexdnLP0AT0MfCy','2021-12-01 13:36:52',1,NULL,'65c55d644bb4564ac3908db7414d84308b9949be916dba5d7cc6017bbdbc5acf07d25b2450fd18ca520b3c2b36829622cb42593abfdcf5a7962944f5c274d27fbe385c3ef1179ebdd16daf0e9917298f8559efc89dedcca21935490478489a40cd40e793100cd0deee1db2011827c137aa20900e84239b53ab29a13abf74ce714f0015ef7b90ad1626520c3e4d72ee944e0a64c5322def1b6c9c1852382f9d86d128320ea79b9013b6229aeb1b5e315f9b4723d306aefdb4b16d3051fb70b1d58f6e0d7a4b80d02c7a4e759cff0ae9e41407e49e9dc72f2b0eb6fde26461dd8a804c1a1804384a75bf3a8f5fc175dda0ea0ae72d3c11173903d9e5d818672477','〒106-0044東京都港区東麻布1-8-1-801'),('f3422923-a512-49e7-b73d-a1e63645c60f','Nguyen Van A','email2@example.com',0,'SELLER','$2b$10$AqyyfrOcSq9Vg9cEm5iLQuHiBx27hBRzPssg1bd44uzPX8B578io2','2000-12-11 17:00:00',1,NULL,'93c91b73cfce699c7fcbc305ebf5e8286a0753ac44c39e0d6f429010e14971c879dcd1be6a5147c0a693abb76312485009ba4d9eb11de021093e7017123b027e1869131f491605f523e4a04babe8e0c627186fa12feccc4150080a75f11a3895804550d31536022edec0535af6a3fc868e4bd9680d2776338552dd7c7d76eceb714b854737ca67014f5476e8a2002e68fb3ea7bd1092b37255bd8cb9a00fcecf191342dd73f9958720d0a143abce79c509d4993414af8ab6cf2ca0e58a2d48b7db519dced2f79c76fdd14010e5ff4ae08da3e91eb93274e386b8aaad1429fb8f8f20d87f7ddfd3ac822abaf973d22b54f045182beff91bd24da851d73c2432fa','Japan'),('f81e827e-ea75-43cf-ae4e-5e676d25592c','Huy','example.huy@gmail.com',0,'SELLER','$2b$10$9x/LxQUdUABhkBXxD9Ab5e4h5.YWraXcvp3Ux19SVhXfu6GH6iicO','2000-02-16 17:00:00',1,NULL,'d070f6b6d4e894fbc56403a6737d01314ffb86d6799fd7b4980cdba6402d7a1bbfe10898ead3968c76cf1e797255503081ad21cebbbaac77007e79c3d5f550f66f4df13a2d1a078d137056ec359ed2b83847bbe80d69be9c99ad6aafc4c5c381da6ced15a60004926c99e9e9ae04edbbef9a33e22294797b42e8b6f27421d428366228a70a5afa85cdf7ef534e75f4e7e99943bb2da514e80f05b6e793791166d105ad15ce132f8d3ce3e138a0accfd7c44975f8e6153a4469cb4183430690e3a30542c02117224ccde3baff66ce04074b4ef875c73c111dc22299a766f0b99aec38bc2c63e597ba30a51fbc868270ad4b2b7a25b8650f83dd57a5431a2db4b9','Vietnam');
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-01-01 16:01:17
