import prisma from "../plugin/postgres";

export class EmpresaService{
    static async getUserEmpresas(userId: number) {
       const empresas =  await prisma.usuarioEmpresa.findMany({
            where: {
                userId: userId
            },
            include: {
                empresa: true
            }
        })

        return empresas
    }
}