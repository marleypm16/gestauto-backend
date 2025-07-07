import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "postgresql://postgres:devdb123@localhost:5432/postgres",
    },
  },
});

export default prisma;

