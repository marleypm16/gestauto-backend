/*
  Warnings:

  - The primary key for the `Assinatura` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Carros` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Clientes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Empresa` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Estoque` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Fatura` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OrdemServico` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OsServico` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Plano` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PosVenda` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProdutoEstoque` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Produtos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Servico` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `UsuarioEmpresa` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Assinatura" DROP CONSTRAINT "Assinatura_empresaid_fkey";

-- DropForeignKey
ALTER TABLE "Assinatura" DROP CONSTRAINT "Assinatura_planoId_fkey";

-- DropForeignKey
ALTER TABLE "Carros" DROP CONSTRAINT "Carros_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "Clientes" DROP CONSTRAINT "Clientes_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "Clientes" DROP CONSTRAINT "Clientes_funcionario_id_fkey";

-- DropForeignKey
ALTER TABLE "Fatura" DROP CONSTRAINT "Fatura_assinaturaId_fkey";

-- DropForeignKey
ALTER TABLE "OrdemServico" DROP CONSTRAINT "OrdemServico_carro_id_fkey";

-- DropForeignKey
ALTER TABLE "OrdemServico" DROP CONSTRAINT "OrdemServico_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "OrdemServico" DROP CONSTRAINT "OrdemServico_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "OrdemServico" DROP CONSTRAINT "OrdemServico_funcionario_id_fkey";

-- DropForeignKey
ALTER TABLE "OrdemServico" DROP CONSTRAINT "OrdemServico_servicoId_fkey";

-- DropForeignKey
ALTER TABLE "OsServico" DROP CONSTRAINT "OsServico_funcionario_id_fkey";

-- DropForeignKey
ALTER TABLE "OsServico" DROP CONSTRAINT "OsServico_ordem_servico_id_fkey";

-- DropForeignKey
ALTER TABLE "PosVenda" DROP CONSTRAINT "PosVenda_cliente_id_fkey";

-- DropForeignKey
ALTER TABLE "PosVenda" DROP CONSTRAINT "PosVenda_empresa_id_fkey";

-- DropForeignKey
ALTER TABLE "PosVenda" DROP CONSTRAINT "PosVenda_servico_id_fkey";

-- DropForeignKey
ALTER TABLE "ProdutoEstoque" DROP CONSTRAINT "ProdutoEstoque_estoqueId_fkey";

-- DropForeignKey
ALTER TABLE "ProdutoEstoque" DROP CONSTRAINT "ProdutoEstoque_produtoId_fkey";

-- DropForeignKey
ALTER TABLE "Produtos" DROP CONSTRAINT "Produtos_estoque_id_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioEmpresa" DROP CONSTRAINT "UsuarioEmpresa_empresaId_fkey";

-- DropForeignKey
ALTER TABLE "UsuarioEmpresa" DROP CONSTRAINT "UsuarioEmpresa_userId_fkey";

-- AlterTable
ALTER TABLE "Assinatura" DROP CONSTRAINT "Assinatura_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresaid" SET DATA TYPE TEXT,
ALTER COLUMN "planoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Assinatura_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Assinatura_id_seq";

-- AlterTable
ALTER TABLE "Carros" DROP CONSTRAINT "Carros_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "cliente_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Carros_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Carros_id_seq";

-- AlterTable
ALTER TABLE "Clientes" DROP CONSTRAINT "Clientes_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ALTER COLUMN "funcionario_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Clientes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Clientes_id_seq";

-- AlterTable
ALTER TABLE "Empresa" DROP CONSTRAINT "Empresa_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Empresa_id_seq";

-- AlterTable
ALTER TABLE "Estoque" DROP CONSTRAINT "Estoque_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Estoque_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Estoque_id_seq";

-- AlterTable
ALTER TABLE "Fatura" DROP CONSTRAINT "Fatura_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "assinaturaId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Fatura_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Fatura_id_seq";

-- AlterTable
ALTER TABLE "OrdemServico" DROP CONSTRAINT "OrdemServico_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "cliente_id" SET DATA TYPE TEXT,
ALTER COLUMN "funcionario_id" SET DATA TYPE TEXT,
ALTER COLUMN "carro_id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ALTER COLUMN "servicoId" SET DATA TYPE TEXT,
ADD CONSTRAINT "OrdemServico_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OrdemServico_id_seq";

-- AlterTable
ALTER TABLE "OsServico" DROP CONSTRAINT "OsServico_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "funcionario_id" SET DATA TYPE TEXT,
ALTER COLUMN "ordem_servico_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "OsServico_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OsServico_id_seq";

-- AlterTable
ALTER TABLE "Plano" DROP CONSTRAINT "Plano_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Plano_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Plano_id_seq";

-- AlterTable
ALTER TABLE "PosVenda" DROP CONSTRAINT "PosVenda_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "servico_id" SET DATA TYPE TEXT,
ALTER COLUMN "empresa_id" SET DATA TYPE TEXT,
ALTER COLUMN "cliente_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PosVenda_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PosVenda_id_seq";

-- AlterTable
ALTER TABLE "ProdutoEstoque" DROP CONSTRAINT "ProdutoEstoque_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "produtoId" SET DATA TYPE TEXT,
ALTER COLUMN "estoqueId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProdutoEstoque_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ProdutoEstoque_id_seq";

-- AlterTable
ALTER TABLE "Produtos" DROP CONSTRAINT "Produtos_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "estoque_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Produtos_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Produtos_id_seq";

-- AlterTable
ALTER TABLE "Servico" DROP CONSTRAINT "Servico_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Servico_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Servico_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AlterTable
ALTER TABLE "UsuarioEmpresa" DROP CONSTRAINT "UsuarioEmpresa_pkey",
ADD COLUMN     "expose_id" SERIAL NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "empresaId" SET DATA TYPE TEXT,
ADD CONSTRAINT "UsuarioEmpresa_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "UsuarioEmpresa_id_seq";

-- AddForeignKey
ALTER TABLE "UsuarioEmpresa" ADD CONSTRAINT "UsuarioEmpresa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsuarioEmpresa" ADD CONSTRAINT "UsuarioEmpresa_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_empresaid_fkey" FOREIGN KEY ("empresaid") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Assinatura" ADD CONSTRAINT "Assinatura_planoId_fkey" FOREIGN KEY ("planoId") REFERENCES "Plano"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fatura" ADD CONSTRAINT "Fatura_assinaturaId_fkey" FOREIGN KEY ("assinaturaId") REFERENCES "Assinatura"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clientes" ADD CONSTRAINT "Clientes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Clientes" ADD CONSTRAINT "Clientes_funcionario_id_fkey" FOREIGN KEY ("funcionario_id") REFERENCES "UsuarioEmpresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carros" ADD CONSTRAINT "Carros_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produtos" ADD CONSTRAINT "Produtos_estoque_id_fkey" FOREIGN KEY ("estoque_id") REFERENCES "Estoque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoEstoque" ADD CONSTRAINT "ProdutoEstoque_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produtos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoEstoque" ADD CONSTRAINT "ProdutoEstoque_estoqueId_fkey" FOREIGN KEY ("estoqueId") REFERENCES "Estoque"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_funcionario_id_fkey" FOREIGN KEY ("funcionario_id") REFERENCES "UsuarioEmpresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_carro_id_fkey" FOREIGN KEY ("carro_id") REFERENCES "Carros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdemServico" ADD CONSTRAINT "OrdemServico_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosVenda" ADD CONSTRAINT "PosVenda_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosVenda" ADD CONSTRAINT "PosVenda_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PosVenda" ADD CONSTRAINT "PosVenda_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "Clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OsServico" ADD CONSTRAINT "OsServico_funcionario_id_fkey" FOREIGN KEY ("funcionario_id") REFERENCES "UsuarioEmpresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OsServico" ADD CONSTRAINT "OsServico_ordem_servico_id_fkey" FOREIGN KEY ("ordem_servico_id") REFERENCES "OrdemServico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
