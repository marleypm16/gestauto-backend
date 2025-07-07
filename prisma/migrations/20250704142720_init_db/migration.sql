-- CreateEnum
CREATE TYPE "StatusEmpresa" AS ENUM ('PENDENTE', 'ATIVA', 'INATIVA');

-- CreateEnum
CREATE TYPE "StatusAssinatura" AS ENUM ('ATIVA', 'CANCELADA', 'PENDENTE');

-- CreateEnum
CREATE TYPE "StatusFatura" AS ENUM ('PAGA', 'PENDENTE', 'ATRASADA');

-- CreateEnum
CREATE TYPE "StatusOrdemServico" AS ENUM ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA', 'CANCELADA', 'ATRASADA');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "confirmar_email" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "data_contrato" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" SERIAL NOT NULL,
    "razao_social" VARCHAR(255) NOT NULL,
    "cnpj" VARCHAR(14) NOT NULL,
    "email" VARCHAR(255),
    "telefone" VARCHAR(20),
    "cep" VARCHAR(255) NOT NULL,
    "rua" VARCHAR(255) NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "bairro" VARCHAR(255) NOT NULL,
    "cidade" VARCHAR(255) NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "complemento" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "status_empresa" "StatusEmpresa" NOT NULL DEFAULT 'PENDENTE',

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsuarioEmpresa" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "funcao" VARCHAR(50) NOT NULL,
    "salario" DECIMAL(10,2),
    "permisso" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsuarioEmpresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plano" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plano_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Assinatura" (
    "id" SERIAL NOT NULL,
    "empresaid" INTEGER NOT NULL,
    "planoId" INTEGER NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataFim" TIMESTAMP(3),
    "status" "StatusAssinatura" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gatewayId" VARCHAR(255),

    CONSTRAINT "Assinatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fatura" (
    "id" SERIAL NOT NULL,
    "assinaturaId" INTEGER NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "status" "StatusFatura" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transacaoId" VARCHAR(255),

    CONSTRAINT "Fatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Clientes" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "telefone" VARCHAR(20),
    "empresa_id" INTEGER NOT NULL,
    "funcionario_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carros" (
    "id" SERIAL NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "marca" VARCHAR(255) NOT NULL,
    "modelo" VARCHAR(255) NOT NULL,
    "ano" INTEGER NOT NULL,
    "placa" VARCHAR(20) NOT NULL,
    "cor" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Carros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produtos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(500),
    "preco" DECIMAL(10,2) NOT NULL,
    "estoque_id" INTEGER NOT NULL,
    "categoriaId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Produtos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estoque" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nome" VARCHAR(255) NOT NULL,

    CONSTRAINT "Estoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoEstoque" (
    "id" SERIAL NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "estoqueId" INTEGER NOT NULL,
    "quantidade" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProdutoEstoque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdemServico" (
    "id" SERIAL NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "funcionario_id" INTEGER NOT NULL,
    "carro_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "metodo_pagamento" VARCHAR(50) NOT NULL,
    "status" "StatusOrdemServico" NOT NULL DEFAULT 'PENDENTE',
    "desconto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "hora_entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora_saida" TIMESTAMP(3),
    "preco_total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "servicoId" INTEGER,

    CONSTRAINT "OrdemServico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PosVenda" (
    "id" SERIAL NOT NULL,
    "servico_id" INTEGER NOT NULL,
    "empresa_id" INTEGER NOT NULL,
    "cliente_id" INTEGER NOT NULL,
    "data_contato" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PosVenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" VARCHAR(500),
    "preco" DECIMAL(10,2) NOT NULL,
    "duracao" INTEGER NOT NULL,
    "tempo_pos_venda" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OsServico" (
    "id" SERIAL NOT NULL,
    "funcionario_id" INTEGER NOT NULL,
    "ordem_servico_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OsServico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_email_key" ON "Empresa"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UsuarioEmpresa_userId_empresaId_key" ON "UsuarioEmpresa"("userId", "empresaId");

-- CreateIndex
CREATE UNIQUE INDEX "Clientes_email_key" ON "Clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Carros_placa_key" ON "Carros"("placa");

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
