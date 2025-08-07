-- CreateTable
CREATE TABLE `site_contents` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    `value_id` TEXT NOT NULL,
    `value_en` TEXT NOT NULL,
    `type` ENUM('TEXT', 'LINK', 'IMAGE', 'VIDEO') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `site_contents_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
