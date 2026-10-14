/*
  Warnings:

  - Added the required column `phone` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `services` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contact" ADD COLUMN     "phone" INTEGER NOT NULL,
ADD COLUMN     "services" TEXT NOT NULL;
