/*
  Warnings:

  - Added the required column `testColumn` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "testColumn" INTEGER NOT NULL;
