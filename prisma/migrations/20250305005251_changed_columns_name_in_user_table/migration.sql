/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `birthDay` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isUserValidated` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isWriter` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `registrationExpiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tokenRegistration` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `userUUID` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token_registration]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `birth_day` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration_expires_at` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token_registration` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_uuid` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Collection" DROP CONSTRAINT "Collection_userId_fkey";

-- DropForeignKey
ALTER TABLE "Group" DROP CONSTRAINT "Group_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "GroupMembers" DROP CONSTRAINT "GroupMembers_memberId_fkey";

-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_userId_fkey";

-- DropForeignKey
ALTER TABLE "Story" DROP CONSTRAINT "Story_writerId_fkey";

-- DropForeignKey
ALTER TABLE "UserFeats" DROP CONSTRAINT "UserFeats_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserReading" DROP CONSTRAINT "UserReading_readerId_fkey";

-- DropIndex
DROP INDEX "User_tokenRegistration_key";

-- DropIndex
DROP INDEX "User_username_email_firstName_createdAt_idx";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "birthDay",
DROP COLUMN "createdAt",
DROP COLUMN "firstName",
DROP COLUMN "isActive",
DROP COLUMN "isUserValidated",
DROP COLUMN "isWriter",
DROP COLUMN "lastName",
DROP COLUMN "registrationExpiresAt",
DROP COLUMN "tokenRegistration",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
DROP COLUMN "userUUID",
ADD COLUMN     "birth_day" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstname" VARCHAR(100) NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_user_validated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_writer" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastname" VARCHAR(100) NOT NULL,
ADD COLUMN     "registration_expires_at" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "token_registration" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD COLUMN     "user_uuid" UUID NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_token_registration_key" ON "User"("token_registration");

-- CreateIndex
CREATE INDEX "User_username_email_firstname_created_at_idx" ON "User"("username", "email", "firstname", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_writerId_fkey" FOREIGN KEY ("writerId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD CONSTRAINT "Collection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReading" ADD CONSTRAINT "UserReading_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMembers" ADD CONSTRAINT "GroupMembers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFeats" ADD CONSTRAINT "UserFeats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
