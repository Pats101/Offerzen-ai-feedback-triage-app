/*
  Warnings:

  - You are about to drop the column `category` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Feedback` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Feedback` table. All the data in the column will be lost.
  - Added the required column `nextAction` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sentiment` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `summary` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `Feedback` table without a default value. This is not possible if the table is not empty.
  - Made the column `priority` on table `Feedback` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Feedback_status_idx";

-- AlterTable
ALTER TABLE "Feedback" DROP COLUMN "category",
DROP COLUMN "content",
DROP COLUMN "status",
DROP COLUMN "updatedAt",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "nextAction" TEXT NOT NULL,
ADD COLUMN     "sentiment" TEXT NOT NULL,
ADD COLUMN     "summary" TEXT NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL,
ALTER COLUMN "priority" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Feedback_priority_idx" ON "Feedback"("priority");

-- CreateIndex
CREATE INDEX "Feedback_sentiment_idx" ON "Feedback"("sentiment");
