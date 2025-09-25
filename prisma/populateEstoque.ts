import { PrismaClient } from '../app/generated/prisma';

const prisma = new PrismaClient();

/**
 * Script para popular o banco com estoques padrão
 * Cria 2 estoques: "Principal" e "Almoxerifado" para cada empresa
 */
async function populateEstoque() {
  console.log('🚀 Iniciando população dos estoques...');

  try {
    // Buscar todas as empresas ativas
    const empresas = await prisma.empresa.findMany({
      where: {
        ativo: true
      },
      select: {
        id: true,
        razao_social: true
      }
    });

    if (empresas.length === 0) {
      console.log('⚠️ Nenhuma empresa encontrada. Crie empresas primeiro.');
      return;
    }

    console.log(`📊 Encontradas ${empresas.length} empresa(s) ativa(s)`);

    // Para cada empresa, criar os estoques padrão
    for (const empresa of empresas) {
      console.log(`\n🏢 Processando empresa: ${empresa.razao_social}`);

      // Verificar se já existem estoques para esta empresa
      const estoquesExistentes = await prisma.estoque.findMany({
        where: {
          empresa_id: empresa.id
        }
      });

      if (estoquesExistentes.length > 0) {
        console.log(`  ⚠️ Empresa já possui ${estoquesExistentes.length} estoque(s). Pulando...`);
        continue;
      }

      // Criar estoque "Principal"
      const estoquePrincipal = await prisma.estoque.create({
        data: {
          nome: 'Principal',
          empresa_id: empresa.id
        }
      });

      // Criar estoque "Almoxarifado"
      const estoqueAlmoxarifado = await prisma.estoque.create({
        data: {
          nome: 'Almoxarifado',
          empresa_id: empresa.id
        }
      });

      console.log(`  ✅ Criado estoque: ${estoquePrincipal.nome} (ID: ${estoquePrincipal.id})`);
      console.log(`  ✅ Criado estoque: ${estoqueAlmoxarifado.nome} (ID: ${estoqueAlmoxarifado.id})`);

      // Opcional: Criar alguns produtos de exemplo para cada estoque
      await criarProdutosExemplo(estoquePrincipal.id, estoqueAlmoxarifado.id, empresa.id);
    }

    console.log('\n🎉 População dos estoques concluída com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao popular estoques:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Criar produtos de exemplo para os estoques
 */
async function criarProdutosExemplo(estoquePrincipalId: string, estoqueAlmoxarifadoId: string, empresaId: string) {
  console.log('  📦 Criando produtos de exemplo...');

  try {
    // Produtos para o estoque Principal (mais usados)
    const produtosPrincipal = [
      {
        nome: 'Óleo Motor 5W30',
        descricao: 'Óleo sintético para motor',
        preco: 45.90,
        estoque_id: estoquePrincipalId,
        empresa_id: empresaId
      },
      {
        nome: 'Filtro de Óleo',
        descricao: 'Filtro de óleo automotivo',
        preco: 25.50,
        estoque_id: estoquePrincipalId,
        empresa_id: empresaId
      },
      {
        nome: 'Pastilha de Freio Dianteira',
        descricao: 'Pastilha de freio cerâmica',
        preco: 89.90,
        estoque_id: estoquePrincipalId,
        empresa_id: empresaId
      },
      {
        nome: 'Pneu 195/65 R15',
        descricao: 'Pneu radial para automóveis',
        preco: 320.00,
        estoque_id: estoquePrincipalId,
        empresa_id: empresaId
      }
    ];

    // Produtos para o Almoxarifado (estoque de reserva)
    const produtosAlmoxarifado = [
      {
        nome: 'Correia Dentada',
        descricao: 'Correia dentada para motor',
        preco: 125.00,
        estoque_id: estoqueAlmoxarifadoId,
        empresa_id: empresaId
      },
      {
        nome: 'Vela de Ignição',
        descricao: 'Vela de ignição iridium',
        preco: 35.90,
        estoque_id: estoqueAlmoxarifadoId,
        empresa_id: empresaId
      },
      {
        nome: 'Filtro de Ar',
        descricao: 'Filtro de ar do motor',
        preco: 42.50,
        estoque_id: estoqueAlmoxarifadoId,
        empresa_id: empresaId
      },
      {
        nome: 'Bateria 60Ah',
        descricao: 'Bateria automotiva 60 amperes',
        preco: 280.00,
        estoque_id: estoqueAlmoxarifadoId,
        empresa_id: empresaId
      }
    ];

    // Criar produtos do estoque Principal
    for (const produto of produtosPrincipal) {
      const novoProduto = await prisma.produtos.create({
        data: produto
      });

      // Adicionar quantidade inicial no estoque
      await prisma.produtoEstoque.create({
        data: {
          produtoId: novoProduto.id,
          estoqueId: estoquePrincipalId,
          quantidade: Math.floor(Math.random() * 50) + 10 // Entre 10 e 60 unidades
        }
      });
    }

    // Criar produtos do Almoxarifado
    for (const produto of produtosAlmoxarifado) {
      const novoProduto = await prisma.produtos.create({
        data: produto
      });

      // Adicionar quantidade inicial no estoque
      await prisma.produtoEstoque.create({
        data: {
          produtoId: novoProduto.id,
          estoqueId: estoqueAlmoxarifadoId,
          quantidade: Math.floor(Math.random() * 30) + 5 // Entre 5 e 35 unidades
        }
      });
    }

    console.log(`    ✅ Criados ${produtosPrincipal.length} produtos no estoque Principal`);
    console.log(`    ✅ Criados ${produtosAlmoxarifado.length} produtos no Almoxarifado`);

  } catch (error) {
    console.error('    ❌ Erro ao criar produtos de exemplo:', error);
    // Não lançar erro para não interromper o processo principal
  }
}

/**
 * Função para limpar estoques (útil para desenvolvimento)
 */
async function limparEstoques() {
  console.log('🗑️ Limpando estoques existentes...');

  try {
    // Deletar relações produto-estoque primeiro
    await prisma.produtoEstoque.deleteMany();
    console.log('  ✅ Relações produto-estoque removidas');

    // Deletar produtos
    await prisma.produtos.deleteMany();
    console.log('  ✅ Produtos removidos');

    // Deletar estoques
    await prisma.estoque.deleteMany();
    console.log('  ✅ Estoques removidos');

    console.log('🎉 Limpeza concluída!');

  } catch (error) {
    console.error('❌ Erro ao limpar estoques:', error);
    throw error;
  }
}

// Executar o script
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--clean')) {
    await limparEstoques();
  }
  
  await populateEstoque();
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  main()
    .then(() => {
      console.log('✅ Script executado com sucesso!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erro na execução:', error);
      process.exit(1);
    });
}

export { populateEstoque, limparEstoques };
