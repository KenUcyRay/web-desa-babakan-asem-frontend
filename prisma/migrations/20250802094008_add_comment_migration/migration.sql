-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_user_id_fkey`;

-- DropIndex
DROP INDEX `comments_user_id_fkey` ON `comments`;
