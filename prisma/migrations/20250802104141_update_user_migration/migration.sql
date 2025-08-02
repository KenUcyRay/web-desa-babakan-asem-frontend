/*
  Warnings:

  - The values [CONTRIBUTOR] on the enum `users_role` will be removed. If these variants are still used in the database, this will fail.

*/
-- DropIndex
DROP INDEX `users_reset_token_key` ON `users`;

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('REGULAR', 'ADMIN', 'PKK', 'BUMDES', 'KARANG_TARUNA', 'BPD') NOT NULL,
    MODIFY `reset_token` VARCHAR(500) NULL;
