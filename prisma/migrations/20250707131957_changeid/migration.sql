/*
  Warnings:

  - You are about to drop the column `expose_id` on the `Assinatura` table. All the data in the column will be lost.
  - You are about to drop the column `expose_id` on the `Carros` table. All the data in the column will be lost.
  - You are about to drop the column `expose_id` on the `Clientes` table. All the data in the column will be lost.
  - You are about to drop the column `expose_id` on the `Empresa` table. All the data in the column will be lost.
  - You are about to drop the column `expose_id` on the `Estoque` table. All the data in the column will be lost.
  - You are about to drop the column `expose_id` on the `Fatura` table. All the data in the column will be lost.
  - You are about to drop the column `expose_id` on the `OrdemServico` table. All the data in the column will be lost.
  - You are about to drop the column `expose_id` on the `OsServico` table. All the data in the column will be lost.
  - You are about to drop the column `expose_id` on the `Plano` table. All the data in the column will be lost.
  - You are about to drop the column `expose_id` on the `PosVenda` table. All the data in the column will be lost.
  - You are about to drop the column `expose_id` on the `ProdutoEstoque` table. All the data in the column will be lost.
  - You are about to drop the column `categoriaId` on the `Produtos` table. All the data in the column will be lost.
  - You are about to drop the column `expose_id` on the `Produtos` table. All the data in the column will be lost.
  - You are about to drop the column `expose_id` on the `Servico` table. All the data in the column will be lost.
  - You are about to drop the column `expose_id` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `expose_id` on the `UsuarioEmpresa` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Assinatura" DROP COLUMN "expose_id";

-- AlterTable
ALTER TABLE "Carros" DROP COLUMN "expose_id";

-- AlterTable
ALTER TABLE "Clientes" DROP COLUMN "expose_id";

-- AlterTable
ALTER TABLE "Empresa" DROP COLUMN "expose_id";

-- AlterTable
ALTER TABLE "Estoque" DROP COLUMN "expose_id";

-- AlterTable
ALTER TABLE "Fatura" DROP COLUMN "expose_id";

-- AlterTable
ALTER TABLE "OrdemServico" DROP COLUMN "expose_id";

-- AlterTable
ALTER TABLE "OsServico" DROP COLUMN "expose_id";

-- AlterTable
ALTER TABLE "Plano" DROP COLUMN "expose_id";

-- AlterTable
ALTER TABLE "PosVenda" DROP COLUMN "expose_id";

-- AlterTable
ALTER TABLE "ProdutoEstoque" DROP COLUMN "expose_id";

-- AlterTable
ALTER TABLE "Produtos" DROP COLUMN "categoriaId",
DROP COLUMN "expose_id";

-- AlterTable
ALTER TABLE "Servico" DROP COLUMN "expose_id";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "expose_id";

-- AlterTable
ALTER TABLE "UsuarioEmpresa" DROP COLUMN "expose_id";
