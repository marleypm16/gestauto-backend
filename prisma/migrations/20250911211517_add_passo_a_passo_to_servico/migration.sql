/*
  Warnings:

  - You are about to drop the column `categoria` on the `Servico` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Servico_categoria_idx";

-- AlterTable
ALTER TABLE "Servico" DROP COLUMN "categoria",
ADD COLUMN     "passoAPasso" TEXT;
