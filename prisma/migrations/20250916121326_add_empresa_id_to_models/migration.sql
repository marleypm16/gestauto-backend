/*
  Warnings:

  - Added the required column `empresa_id` to the `Estoque` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresa_id` to the `Produtos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresa_id` to the `Servico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Estoque" ADD COLUMN     "empresa_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Produtos" ADD COLUMN     "empresa_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Servico" ADD COLUMN     "empresa_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Produtos" ADD CONSTRAINT "Produtos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Estoque" ADD CONSTRAINT "Estoque_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Servico" ADD CONSTRAINT "Servico_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
