/*
  Warnings:

  - A unique constraint covering the columns `[tokenRegistration]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_tokenRegistration_key" ON "User"("tokenRegistration");
