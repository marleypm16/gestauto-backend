/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Servico` table. All the data in the column will be lost.
  - Added the required column `atualizadoEm` to the `Servico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Servico" DROP COLUMN "createdAt",
ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "atualizadoEm" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "categoria" VARCHAR(100),
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletadoEm" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Servico_ativo_idx" ON "Servico"("ativo");

-- CreateIndex
CREATE INDEX "Servico_categoria_idx" ON "Servico"("categoria");

-- CreateIndex
CREATE INDEX "Servico_deletadoEm_idx" ON "Servico"("deletadoEm");
