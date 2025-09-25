import { FastifyRequest, FastifyReply } from 'fastify';
import { ServicoService, CreateServicoData, UpdateServicoData } from '../services/servicoService';
import prisma from '../plugin/postgres';
import { validateEmpresaAccess } from '../utils/pathEmpresaValidation';

const servicoService = new ServicoService();

export class ServicoController {

    // ✅ EXEMPLO COM PATH PARAMETER - Aplicar este padrão nas outras rotas
    async criarServico(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { empresaId } = request.params as {  empresaId: string };
            
            
                  ;
                   const userId = (request.user as { id: string }).id;
                  // Validar acesso à empresa
                        if (!userId) {
                            return reply.code(401).send({
                                success: false,
                                message: "Token de autenticação inválido"
                            });
                        }
            
                  
                  const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
                  if (!hasAccess) return; // Resposta já foi enviada
            const data = request.body as CreateServicoData;
            
            // Validar se usuário tem acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

            // Validar se o usuário tem acesso à empresa do path
            const usuarioEmpresa = await prisma.usuarioEmpresa.findFirst({
                where: {
                    userId,
                    empresaId
                },
                include: {
                    empresa: {
                        select: { ativo: true }
                    }
                }
            });

            if (!usuarioEmpresa || !usuarioEmpresa.empresa.ativo) {
                return reply.code(403).send({
                    success: false,
                    message: "Acesso negado a esta empresa ou empresa inativa"
                });
            }

            // Validações do serviço
            if (!data.nome || !data.preco || !data.duracao) {
                return reply.code(400).send({
                    success: false,
                    message: "Nome, preço e duração são obrigatórios"
                });
            }

            if (data.preco <= 0) {
                return reply.code(400).send({
                    success: false,
                    message: "O preço deve ser maior que zero"
                });
            }

            if (data.duracao <= 0) {
                return reply.code(400).send({
                    success: false,
                    message: "A duração deve ser maior que zero"
                });
            }

            // Criar serviço com empresaId do path
            const novoServico = await servicoService.criarServico({
                ...data,
                empresa_id: empresaId
            });

            return reply.code(201).send({
                success: true,
                message: "Serviço criado com sucesso",
                data: novoServico
            });
        } catch (error: any) {
            return reply.code(400).send({
                success: false,
                message: error.message
            });
        }
    }
    

    async buscarTodosServicos(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
            const query = request.query as any;

            // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

            const usuarioEmpresa = await prisma.usuarioEmpresa.findFirst({
                where: { userId, empresaId },
                include: { empresa: { select: { ativo: true } } }
            });

            if (!usuarioEmpresa || !usuarioEmpresa.empresa.ativo) {
                return reply.code(403).send({
                    success: false,
                    message: "Acesso negado a esta empresa"
                });
            }

            // Resto da lógica igual, mas usando empresaId do path
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            
            const filtros = {
                nome: query.nome,
                passoAPasso: query.passoAPasso,
                ativo: query.ativo !== undefined ? query.ativo === 'true' : undefined,
                precoMin: query.precoMin ? parseFloat(query.precoMin) : undefined,
                precoMax: query.precoMax ? parseFloat(query.precoMax) : undefined,
                ordenarPor: query.ordenarPor as 'nome' | 'preco' | 'maisUtilizados' | 'maisLucrativos' | 'recentes',
                ordem: query.ordem as 'asc' | 'desc'
            };
            
            const resultado = await servicoService.buscarTodosServicos(empresaId, page, limit, filtros);

            return reply.code(200).send({
                success: true,
                message: "Serviços encontrados com sucesso",
                data: resultado
            });
        } catch (error: any) {
            return reply.code(500).send({
                success: false,
                message: error.message
            });
        }
    }

   

    async buscarServicoPorId(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id,empresaId } = request.params as { id: string, empresaId: string };
          


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
            const servico = await servicoService.buscarServicoPorId(id,empresaId);
            
            return reply.code(200).send({
                success: true,
                data: servico
            });
        } catch (error: any) {
            return reply.code(404).send({
                success: false,
                message: error.message
            });
        }
    }

    async atualizarServico(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
            const data = request.body as UpdateServicoData;

            if (!empresaId) {
                return reply.code(400).send({
                    success: false,
                    message: "ID da empresa é obrigatório"
                });
            }

            // Validações
            if (data.preco !== undefined && data.preco <= 0) {
                return reply.code(400).send({
                    success: false,
                    message: "O preço deve ser maior que zero"
                });
            }

            if (data.duracao !== undefined && data.duracao <= 0) {
                return reply.code(400).send({
                    success: false,
                    message: "A duração deve ser maior que zero"
                });
            }

            const servico = await servicoService.atualizarServico(id, data, empresaId);
            
            return reply.code(200).send({
                success: true,
                message: "Serviço atualizado com sucesso",
                data: servico
            });
        } catch (error: any) {
            return reply.code(400).send({
                success: false,
                message: error.message
            });
        }
    }

    async deletarServico(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
            if (!empresaId) {
                return reply.code(400).send({
                    success: false,
                    message: "ID da empresa é obrigatório"
                });
            }

            const resultado = await servicoService.deletarServico(id, empresaId);
            
            return reply.code(200).send({
                success: true,
                message: resultado.message
            });
        } catch (error: any) {
            return reply.code(400).send({
                success: false,
                message: error.message
            });
        }
    }

    async buscarServicosPorPassoAPasso(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { busca } = request.params as { busca: string };
            const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
            if (!empresaId) {
                return reply.code(400).send({
                    success: false,
                    message: "ID da empresa é obrigatório"
                });
            }

            const servicos = await servicoService.buscarServicosPorPassoAPasso(busca, empresaId);
            
            return reply.code(200).send({
                success: true,
                data: servicos
            });
        } catch (error: any) {
            return reply.code(500).send({
                success: false,
                message: error.message
            });
        }
    }

    async buscarServicosAtivos(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada

            if (!empresaId) {
                return reply.code(400).send({
                    success: false,
                    message: "ID da empresa é obrigatório"
                });
            }

            const servicos = await servicoService.buscarServicosAtivos(empresaId);
            
            return reply.code(200).send({
                success: true,
                data: servicos
            });
        } catch (error: any) {
            return reply.code(500).send({
                success: false,
                message: error.message
            });
        }
    }

    async ativarDesativarServico(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const { ativo } = request.body as { ativo: boolean };
            const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada

            if (!empresaId) {
                return reply.code(400).send({
                    success: false,
                    message: "ID da empresa é obrigatório"
                });
            }

            if (typeof ativo !== 'boolean') {
                return reply.code(400).send({
                    success: false,
                    message: "O campo 'ativo' deve ser um valor boolean"
                });
            }

            const resultado = await servicoService.ativarDesativarServico(id, ativo, empresaId);
            
            return reply.code(200).send({
                success: true,
                message: resultado.message,
                data: resultado.servico
            });
        } catch (error: any) {
            return reply.code(400).send({
                success: false,
                message: error.message
            });
        }
    }

    async obterEstatisticasServicos(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada

            if (!empresaId) {
                return reply.code(400).send({
                    success: false,
                    message: "ID da empresa é obrigatório"
                });
            }

            const estatisticas = await servicoService.obterEstatisticasServicos(empresaId);
            
            return reply.code(200).send({
                success: true,
                data: estatisticas
            });
        } catch (error: any) {
            return reply.code(500).send({
                success: false,
                message: error.message
            });
        }
    }

    async duplicarServico(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const { novoNome } = request.body as { novoNome: string };
            const { empresaId } = request.params as { empresaId: string };

            if (!empresaId) {
                return reply.code(400).send({
                    success: false,
                    message: "ID da empresa é obrigatório"
                });
            }

            if (!novoNome) {
                return reply.code(400).send({
                    success: false,
                    message: "O novo nome é obrigatório"
                });
            }

            const novoServico = await servicoService.duplicarServico(id, novoNome, empresaId);
            
            return reply.code(201).send({
                success: true,
                message: "Serviço duplicado com sucesso",
                data: novoServico
            });
        } catch (error: any) {
            return reply.code(400).send({
                success: false,
                message: error.message
            });
        }
    }

    async buscarServicosPopulares(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
            const query = request.query as any;
            const limite = parseInt(query.limite) || 10;

            const servicos = await servicoService.buscarServicosPopulares(limite);
            
            return reply.code(200).send({
                success: true,
                data: servicos
            });
        } catch (error: any) {
            return reply.code(500).send({
                success: false,
                message: error.message
            });
        }
    }

    async buscarServicosMaisUtilizados(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { empresaId } = request.params as { empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
            const query = request.query as any;
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            
            const filtros = {
                ordenarPor: 'maisUtilizados' as const,
                ordem: (query.ordem as 'asc' | 'desc') || 'desc',
                ativo: true // Apenas serviços ativos
            };

            const resultado = await servicoService.buscarTodosServicos(empresaId, page, limit, filtros);
            
            return reply.code(200).send({
                success: true,
                message: "Serviços ordenados por mais utilizados",
                data: resultado
            });
        } catch (error: any) {
            return reply.code(500).send({
                success: false,
                message: error.message
            });
        }
    }

    async buscarServicosMaisLucrativos(request: FastifyRequest, reply: FastifyReply) {
        try {
            const query = request.query as any;
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            
            const filtros = {
                ordenarPor: 'maisLucrativos' as const,
                ordem: (query.ordem as 'asc' | 'desc') || 'desc',
                ativo: true // Apenas serviços ativos
            };

            const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
            const resultado = await servicoService.buscarTodosServicos(empresaId, page, limit, filtros);
            
            return reply.code(200).send({
                success: true,
                message: "Serviços ordenados por mais lucrativos",
                data: resultado
            });
        } catch (error: any) {
            return reply.code(500).send({
                success: false,
                message: error.message
            });
        }
    }

    async obterRankingServicos(request: FastifyRequest, reply: FastifyReply) {
        try {
            const query = request.query as any;
            const limite = parseInt(query.limite) || 10;
            const tipo = query.tipo || 'utilizados'; // 'utilizados' ou 'lucrativos'

           const { empresaId } = request.params as {  empresaId: string };


      ;
       const userId = (request.user as { id: string }).id;
      // Validar acesso à empresa
            if (!userId) {
                return reply.code(401).send({
                    success: false,
                    message: "Token de autenticação inválido"
                });
            }

      
      const hasAccess = await validateEmpresaAccess(request, reply, empresaId);
      if (!hasAccess) return; // Resposta já foi enviada
            
            let resultado;
            if (tipo === 'lucrativos') {
                resultado = await servicoService.buscarTodosServicos(empresaId, 1, limite, {
                    ordenarPor: 'maisLucrativos',
                    ordem: 'desc',
                    ativo: true
                });
            } else {
                resultado = await servicoService.buscarTodosServicos(empresaId, 1, limite, {
                    ordenarPor: 'maisUtilizados', 
                    ordem: 'desc',
                    ativo: true
                });
            }
            
            return reply.code(200).send({
                success: true,
                message: `Ranking dos serviços mais ${tipo === 'lucrativos' ? 'lucrativos' : 'utilizados'}`,
                data: {
                    tipo,
                    ranking: resultado.servicos,
                    total: resultado.pagination.total
                }
            });
        } catch (error: any) {
            return reply.code(500).send({
                success: false,
                message: error.message
            });
        }
    }
}
    // Instância do controller para usar nas rotas
export const servicoController = new ServicoController();