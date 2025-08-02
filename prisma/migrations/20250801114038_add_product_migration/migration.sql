/*
  Warnings:

  - You are about to drop the column `whatsapp_link` on the `products` table. All the data in the column will be lost.
  - Added the required column `link_whatsapp` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `ratings` DROP FOREIGN KEY `ratings_user_id_fkey`;

-- DropIndex
DROP INDEX `products_user_id_fkey` ON `products`;

-- DropIndex
DROP INDEX `ratings_user_id_fkey` ON `ratings`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `whatsapp_link`,
    ADD COLUMN `link_whatsapp` VARCHAR(255) NOT NULL;
