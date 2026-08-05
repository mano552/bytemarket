import { PrismaClient } from "@prisma/client";

// Single shared Prisma instance - typed automatically from schema.prisma
const prisma: PrismaClient = new PrismaClient();

export default prisma;
