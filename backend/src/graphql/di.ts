import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";

const prisma = new PrismaClient();

@Service()
export class PrismaService {
  get client() {
    return prisma;
  }
}
