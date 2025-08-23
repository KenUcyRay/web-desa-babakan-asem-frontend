/*
  Warnings:

  - The values [DPD] on the enum `agenda_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [DPD] on the enum `members_organization_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `agenda` MODIFY `type` ENUM('REGULAR', 'PKK', 'KARANG_TARUNA', 'BPD') NOT NULL DEFAULT 'REGULAR';

-- AlterTable
ALTER TABLE `members` MODIFY `organization_type` ENUM('PEMERINTAH', 'PKK', 'KARANG_TARUNA', 'BPD') NOT NULL;
