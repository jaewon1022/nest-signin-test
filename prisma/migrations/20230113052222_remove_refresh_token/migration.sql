/*
  Warnings:

  - You are about to drop the column `refresh_token` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_refresh_token_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "refresh_token";
