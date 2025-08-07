/*
  Warnings:

  - You are about to drop the `poi` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `region` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `poi` DROP FOREIGN KEY `POI_regionId_fkey`;

-- DropTable
DROP TABLE `poi`;

-- DropTable
DROP TABLE `region`;
