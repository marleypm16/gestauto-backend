/*
  Warnings:

  - A unique constraint covering the columns `[produtoId,estoqueId]` on the table `ProdutoEstoque` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProdutoEstoque_produtoId_estoqueId_key" ON "ProdutoEstoque"("produtoId", "estoqueId");
