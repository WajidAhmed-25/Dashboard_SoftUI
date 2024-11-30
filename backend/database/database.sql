-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 30, 2024 at 05:31 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `auto_order_db2`
--
CREATE DATABASE IF NOT EXISTS `auto_order_db2` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `auto_order_db2`;

-- --------------------------------------------------------

--
-- Table structure for table `assign_order`
--

CREATE TABLE `assign_order` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `is_active` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `assign_order`
--

INSERT INTO `assign_order` (`id`, `order_id`, `user_id`, `status`, `is_active`, `created_at`, `updated_at`) VALUES
(4, 16, 3, 'Pending', 'active', '2024-10-21 06:58:00', '2024-10-21 06:58:16');

-- --------------------------------------------------------

--
-- Table structure for table `badge`
--

CREATE TABLE `badge` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `badge` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `min_order_completed` bigint(20) UNSIGNED DEFAULT NULL,
  `is_active` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `email_responses`
--

CREATE TABLE `email_responses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email_subject` varchar(255) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL,
  `size` varchar(255) DEFAULT NULL,
  `placement` varchar(255) DEFAULT NULL,
  `order_type` varchar(255) DEFAULT NULL,
  `required_file_format` varchar(255) DEFAULT NULL,
  `number_of_colors` varchar(255) DEFAULT NULL,
  `colors_list` varchar(255) DEFAULT NULL,
  `other_details` text DEFAULT NULL,
  `garment_type` varchar(255) DEFAULT NULL,
  `sentiments` varchar(255) DEFAULT NULL,
  `attachments` text DEFAULT NULL,
  `date` varchar(255) DEFAULT NULL,
  `email_address` varchar(255) DEFAULT NULL,
  `client_code` varchar(255) DEFAULT NULL,
  `price` varchar(255) DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL,
  `project_tag` text DEFAULT NULL,
  `assign_order_to_designer` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `email_responses`
--

INSERT INTO `email_responses` (`id`, `email_subject`, `category`, `priority`, `size`, `placement`, `order_type`, `required_file_format`, `number_of_colors`, `colors_list`, `other_details`, `garment_type`, `sentiments`, `attachments`, `date`, `email_address`, `client_code`, `price`, `color`, `project_tag`, `assign_order_to_designer`, `created_at`, `updated_at`) VALUES
(1, 'Re: Please find your order \"2024 KENDRICK BARBEQUE BLACK HAT Logo\"', 'Edit Request', 'RUSH', 'null', 'null', 'Digitizing', 'DST', 'null', 'null', 'That text it not readable please make it bigger with satin stitches thanks', 'null', 'Positive', '[{\"filename\": \"98A42CDD-2AD8-45EE-B5F7-A60234E01DFD.png\", \"mimeType\": \"image/png\", \"file_path\": \"attachments\\\\98A42CDD-2AD8-45EE-B5F7-A60234E01DFD.png\"}]', 'Wed, 15 May 2024 15:44:15 -0600', 'wajidahmed903@gmail.com', NULL, '', '', '', 0, '2024-10-15 17:37:12', '2024-11-29 12:41:28'),
(2, 'Re: Cherubimsa', 'Edit Request', 'null', 'null', 'null', 'null', 'null', 'null', NULL, 'null', 'null', 'Neutral', '[]', 'Wed, 15 May 2024 21:58:41 +0000', 'wajidahmed903@gmail.com', NULL, '', '', '', 0, '2024-10-15 17:37:12', '2024-11-24 15:50:03'),
(3, 'Re: Please find your order \"N-Djamena Logo (Rev-1)\" i', 'Submitted', 'RUSH', 'null', 'null', 'Digitizing', 'DST', 'null', 'null', 'Please fill in the white stripes in the American flag. I need this back as soon as possible.', 'null', 'Positive', '[{\"filename\": \"N\'Djamena test sew 4.jpg\", \"mimeType\": \"image/jpeg\", \"file_path\": \"attachments\\\\N\'Djamena test sew 4.jpg\"}]', 'Wed, 15 May 2024 22:06:17 +0000 (UTC)', 'wajidahmed903@gmail.com', '', '', '', '', 0, '2024-10-15 17:37:12', '2024-10-15 17:37:12'),
(4, 'Re: Please find your order \"TD Livestock Logo\"', 'Follow Up', 'Happy', 'null', 'null', 'Vector', 'DST', 'null', 'null', 'Ca you fix the \"E\" so it\'s even with the other letters', 'null', 'Neutral', '[]', 'Wed, 15 May 2024 17:39:23 -0500', 'wajidahmed903@gmail.com', '', '', '', '', 0, '2024-10-15 17:37:12', '2024-10-15 17:37:12'),
(5, 'Re: Please find your order \"TD Livestock Logo\"', 'Rejected', 'RUSH', 'null', 'null', 'Digitizing', 'DST', 'null', 'null', 'Ca you fix the \"E\" so it\'s even with the other letters', 'null', 'Neutral', '[]', 'Wed, 15 May 2024 17:39:23 -0500', 'wajidahmed903@gmail.com', 'WAJID12345', '', '', '', 0, '2024-10-15 17:37:12', '2024-10-15 17:37:12'),
(6, 'Re: Please find your order \"TD Livestock Logo\"', 'Assign Order', 'RUSH', 'null', 'null', 'Digitizing', 'DST', 'null', 'null', 'Ca you fix the \"E\" so it\'s even with the other letters', 'null', 'Neutral', '[{\"filename\":\"image.jpg\",\"file_path\":\"https://media.istockphoto.com/id/652750800/vector/pakistan.webp?s=1024x1024&w=is&k=20&c=FtvsofUg6FoSbstz0aVsZQ7F47TS5OMIMsH543yLFIE=\",\"mimeType\":\"image/jpg\"}]', 'Wed, 15 May 2024 17:39:23 -0500', 'wajidahmed903@gmail.com', '', '', '', '', 3, '2024-10-15 17:37:12', '2024-10-15 17:37:12'),
(7, 'Re: Please find your order \"TD Livestock Logo\"', 'Assign Order', 'RUSH', '5', 'Shirt', 'Vector', 'DST', 'null', 'hex', 'Ca you fix the \"E\" so it\'s even with the other letters', 'Male', 'Positive', '[{\"filename\":\"image.jpg\",\"file_path\":\"https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg\",\"mimeType\":\"image/jpg\"}]', 'Wed, 15 May 2024 17:39:23 -0500', 'wajidahmed903@gmail.com', '', '20,000', 'Red', 'sadsasdasdas,asdasdasdasd', 9, '2024-10-15 17:37:12', '2024-10-15 17:37:12'),
(8, 'Experts at Work', 'New Order', 'RUSH', '3', 'Hat', 'Digitizing', 'DST', 'null', '5', 'Please, digitize it for: SIDE OF HAT - 3\" WIDE (ONLY THE TEXT)', 'Male', 'Positive', '[{\"filename\":\"logo-light.jpeg\",\"file_path\":\"blob:http://localhost:3000/077f9b29-49f5-4099-9bef-e17ffa1f3e2e\",\"mimeType\":\"image/jpeg\"}]', 'Thu, 16 May 2024 10:26:27 -0400 (EDT)', 'wajidahmed903@gmail.com', '1456fg78ki', '15,000', 'yellow', 'sdasdasdasdas,sadasddasdasdas,sdasdasdasd', 4, '2024-10-15 17:37:12', '2024-11-29 10:57:34'),
(9, 'dfadas', 'Promotional', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', '', '[]', 'Thu, 16 May 2024 14:56:44 +0000', 'wajidahmed903@gmail.com', '', '', '', '', 0, '2024-10-15 17:37:12', '2024-10-15 17:37:12'),
(16, 'wajid', 'New Order', 'Negative', '4', 'Hata', 'Digitizing', 'DST', 'null', '5', 'Please, digitize it for: SIDE OF HAT - 3 WIDE (ONLY THE TEXT)', 'Male', 'Positive', '[{\"filename\":\"logo-light.jpeg\",\"file_path\":\"blob:http://localhost:3000/077f9b29-49f5-4099-9bef-e17ffa1f3e2e\",\"mimeType\":\"image/jpeg\"},{\"filename\":\"images.jpeg\",\"file_path\":\"blob:http://localhost:3000/4ee9fc23-e418-441c-9693-978b20960c0d\",\"mimeType\":\"image/jpeg\"},{\"filename\":\"screenshot.png\",\"file_path\":\"blob:http://localhost:3000/ac8a0db5-04c7-4680-a02c-83f56e2259d2\",\"mimeType\":\"image/png\"}]', 'Thu, 16 May 2024 10:26:27 -0400 (EDT)', 'wajidahmed903@gmail.com', '0012132', '15,0000', 'oranges', 'sdasdasdasdas,ad2,123', 4, '2024-10-15 17:37:12', '2024-11-23 17:44:21');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marketplace_orders`
--

CREATE TABLE `marketplace_orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `total_price` varchar(255) DEFAULT NULL,
  `is_active` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marketplace_orders_assign`
--

CREATE TABLE `marketplace_orders_assign` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `is_active` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marketplace_orders_bids`
--

CREATE TABLE `marketplace_orders_bids` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `bid_amount` varchar(255) DEFAULT NULL,
  `is_active` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_100000_create_password_resets_table', 1),
(2, '2019_08_19_000000_create_failed_jobs_table', 1),
(3, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(4, '2024_10_19_192049_create_user_category_table', 1),
(5, '2024_10_19_192102_create_users_table', 1),
(6, '2024_10_19_192113_create_email_responses_table', 1),
(7, '2024_10_19_192124_create_assign_order_table', 1),
(8, '2024_10_19_192134_create_order_logs_table', 1),
(9, '2024_10_19_192144_create_order_status_table', 1),
(10, '2024_10_19_192152_create_badge_table', 1),
(11, '2024_10_19_192200_create_order_invoice_table', 1),
(12, '2024_10_19_192208_create_marketplace_orders_table', 1),
(13, '2024_10_19_192217_create_marketplace_orders_bids_table', 1),
(14, '2024_10_19_192225_create_marketplace_orders_assign_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `order_invoice`
--

CREATE TABLE `order_invoice` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `total_price` varchar(255) DEFAULT NULL,
  `invoice_path` varchar(255) DEFAULT NULL,
  `is_active` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_logs`
--

CREATE TABLE `order_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `is_active` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_logs`
--

INSERT INTO `order_logs` (`id`, `order_id`, `user_id`, `status`, `description`, `is_active`, `created_at`, `updated_at`) VALUES
(10, 16, 1, 'Assign', 'this is WAJIDasdsa', 'active', '2024-10-21 06:58:00', '2024-11-29 13:18:40'),
(11, 16, 1, 'Completed', 'ssadasd', 'active', '2024-10-21 06:58:16', '2024-10-21 06:58:16'),
(12, 16, 3, 'Delivered', 'sd', 'active', '2024-10-21 06:58:16', '2024-11-24 13:54:53');

-- --------------------------------------------------------

--
-- Table structure for table `order_status`
--

CREATE TABLE `order_status` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `is_active` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `role` enum('superadmin','admin','user','customer','manager','marketplace','designer','QC','account') NOT NULL DEFAULT 'user',
  `profile_picture` varchar(255) DEFAULT NULL,
  `is_active` enum('active','inactive') NOT NULL DEFAULT 'active',
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `last_name`, `email`, `password`, `phone_number`, `role`, `profile_picture`, `is_active`, `category_id`, `created_at`, `updated_at`) VALUES
(1, 'admin', NULL, 'test@gmaasdil.com', '$2y$10$n.zqu3VrZ0mP943m8cBUuOBmU5wTpmvSPHorfS2.FBIkvp1C8vdX.', NULL, 'user', NULL, 'active', 3, '2024-10-20 06:19:40', '2024-10-20 06:19:40'),
(2, 'test2', NULL, 'test2@gmaasdil.com', '$2y$10$WTNOt4kk5d/mhBAS28Zy2uk359JkhvXovqwQec7gl5pS9gIExih/6', NULL, 'user', NULL, 'active', 1, '2024-10-20 06:19:56', '2024-10-20 06:19:56'),
(3, 'designer2', NULL, 'test3@gmaasdil.com', '$2y$10$n.zqu3VrZ0mP943m8cBUuOBmU5wTpmvSPHorfS2.FBIkvp1C8vdX.', NULL, 'user', NULL, 'active', 3, '2024-10-20 06:19:40', '2024-10-20 06:19:40'),
(13, 'wajid', NULL, 'wajid1@gmail.com', '$2y$10$10WChibs9RPopOBWhV1DHOI0cXaRAi6vJE6GOIPUGUK0isfmF7E7K', NULL, 'account', NULL, 'active', 4, '2024-11-30 10:49:55', '2024-11-30 10:49:55');

-- --------------------------------------------------------

--
-- Table structure for table `user_category`
--

CREATE TABLE `user_category` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category` varchar(255) NOT NULL,
  `is_active` enum('active','inactive') NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_category`
--

INSERT INTO `user_category` (`id`, `category`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'management', 'active', '2024-10-20 05:49:19', '2024-10-20 05:49:19'),
(3, 'Production', 'active', '2024-10-20 06:16:53', '2024-10-20 06:16:53'),
(4, 'Designer', 'active', '2024-11-02 13:19:02', '2024-11-20 13:19:02');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `assign_order`
--
ALTER TABLE `assign_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `assign_order_order_id_foreign` (`order_id`),
  ADD KEY `assign_order_user_id_foreign` (`user_id`);

--
-- Indexes for table `badge`
--
ALTER TABLE `badge`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `badge_badge_unique` (`badge`);

--
-- Indexes for table `email_responses`
--
ALTER TABLE `email_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email_responses_assign_order_to_designer_foreign` (`assign_order_to_designer`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `marketplace_orders`
--
ALTER TABLE `marketplace_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `marketplace_orders_order_id_foreign` (`order_id`),
  ADD KEY `marketplace_orders_user_id_foreign` (`user_id`);

--
-- Indexes for table `marketplace_orders_assign`
--
ALTER TABLE `marketplace_orders_assign`
  ADD PRIMARY KEY (`id`),
  ADD KEY `marketplace_orders_assign_order_id_foreign` (`order_id`),
  ADD KEY `marketplace_orders_assign_user_id_foreign` (`user_id`);

--
-- Indexes for table `marketplace_orders_bids`
--
ALTER TABLE `marketplace_orders_bids`
  ADD PRIMARY KEY (`id`),
  ADD KEY `marketplace_orders_bids_order_id_foreign` (`order_id`),
  ADD KEY `marketplace_orders_bids_user_id_foreign` (`user_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_invoice`
--
ALTER TABLE `order_invoice`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_invoice_order_id_foreign` (`order_id`),
  ADD KEY `order_invoice_user_id_foreign` (`user_id`);

--
-- Indexes for table `order_logs`
--
ALTER TABLE `order_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_logs_order_id_foreign` (`order_id`),
  ADD KEY `order_logs_user_id_foreign` (`user_id`);

--
-- Indexes for table `order_status`
--
ALTER TABLE `order_status`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_status_order_id_foreign` (`order_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_category_id_foreign` (`category_id`);

--
-- Indexes for table `user_category`
--
ALTER TABLE `user_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_category_category_unique` (`category`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assign_order`
--
ALTER TABLE `assign_order`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `badge`
--
ALTER TABLE `badge`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `email_responses`
--
ALTER TABLE `email_responses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marketplace_orders`
--
ALTER TABLE `marketplace_orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marketplace_orders_assign`
--
ALTER TABLE `marketplace_orders_assign`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marketplace_orders_bids`
--
ALTER TABLE `marketplace_orders_bids`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `order_invoice`
--
ALTER TABLE `order_invoice`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_logs`
--
ALTER TABLE `order_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `order_status`
--
ALTER TABLE `order_status`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `user_category`
--
ALTER TABLE `user_category`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assign_order`
--
ALTER TABLE `assign_order`
  ADD CONSTRAINT `assign_order_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `email_responses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assign_order_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `marketplace_orders`
--
ALTER TABLE `marketplace_orders`
  ADD CONSTRAINT `marketplace_orders_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `email_responses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `marketplace_orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `marketplace_orders_assign`
--
ALTER TABLE `marketplace_orders_assign`
  ADD CONSTRAINT `marketplace_orders_assign_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `marketplace_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `marketplace_orders_assign_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `marketplace_orders_bids`
--
ALTER TABLE `marketplace_orders_bids`
  ADD CONSTRAINT `marketplace_orders_bids_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `marketplace_orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `marketplace_orders_bids_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_invoice`
--
ALTER TABLE `order_invoice`
  ADD CONSTRAINT `order_invoice_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `email_responses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_invoice_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_logs`
--
ALTER TABLE `order_logs`
  ADD CONSTRAINT `order_logs_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `email_responses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `order_status`
--
ALTER TABLE `order_status`
  ADD CONSTRAINT `order_status_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `email_responses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `user_category` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
