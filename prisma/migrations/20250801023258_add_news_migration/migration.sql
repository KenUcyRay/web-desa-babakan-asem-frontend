/*
  Warnings:

  - You are about to drop the column `user_id` on the `news` table. All the data in the column will be lost.
  - Added the required column `userId` to the `news` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `news` DROP FOREIGN KEY `news_user_id_fkey`;

-- DropIndex
DROP INDEX `news_user_id_fkey` ON `news`;

-- AlterTable
ALTER TABLE `news` DROP COLUMN `user_id`,
    ADD COLUMN `userId` VARCHAR(191) NOT NULL;
