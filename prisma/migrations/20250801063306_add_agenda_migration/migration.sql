/*
  Warnings:

  - You are about to drop the `agendas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `agendas`;

-- CreateTable
CREATE TABLE `agenda` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `featured_image` VARCHAR(255) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `view_count` INTEGER NOT NULL DEFAULT 0,
    `is_published` BOOLEAN NOT NULL DEFAULT false,
    `published_at` DATETIME(3) NULL,
    `type` ENUM('REGULAR', 'PKK', 'KARANG_TARUNA', 'DPD', 'BPD') NOT NULL DEFAULT 'REGULAR',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
