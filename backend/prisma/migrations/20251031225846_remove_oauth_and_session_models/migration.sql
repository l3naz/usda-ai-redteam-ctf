/*
  Warnings:

  - You are about to drop the `OAuthAccount` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."OAuthAccount" DROP CONSTRAINT "OAuthAccount_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "displayName" TEXT,
ALTER COLUMN "username" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."OAuthAccount";

-- DropTable
DROP TABLE "public"."Session";

-- DropEnum
DROP TYPE "public"."OAuthProvider";
