-- CreateTable
CREATE TABLE `resident_statistics` (
    `id` VARCHAR(191) NOT NULL,
    `key` VARCHAR(255) NOT NULL,
    `value` INTEGER NOT NULL,
    `resident_type` ENUM('GENDER', 'PERNIKAHAN', 'AGAMA', 'USIA', 'KEPALA_KELUARGA', 'PERKERJAAN', 'PENDIDIKAN', 'WAJIB_PILIH', 'DUSUN') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `resident_statistics_key_key`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
