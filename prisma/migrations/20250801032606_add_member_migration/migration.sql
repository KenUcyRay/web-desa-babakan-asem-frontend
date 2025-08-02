/*
  Warnings:

  - You are about to drop the column `importance_level` on the `members` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `members` table. All the data in the column will be lost.
  - The values [GOVERNMENT] on the enum `members_organization_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `members` DROP COLUMN `importance_level`,
    DROP COLUMN `is_active`,
    ADD COLUMN `important_level` INTEGER NOT NULL DEFAULT 1,
    ADD COLUMN `is_term` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `organization_type` ENUM('PEMERINTAH', 'PKK', 'KARANG_TARUNA', 'DPD', 'BPD') NOT NULL;
