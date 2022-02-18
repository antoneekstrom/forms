import { PrismaClient } from "@prisma/client";
import { Service } from "typedi";

const prisma = new PrismaClient();

/**
 * A service for injecting the prisma client into graphql resolvers.
 */
@Service()
export class PrismaService {
  get client() {
    return prisma;
  }
}
