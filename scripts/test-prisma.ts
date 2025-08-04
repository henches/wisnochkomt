import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  try {
    const result = await prisma.$queryRawUnsafe(`SELECT 1`);
    console.log("✅ Connexion réussie:", result);
  } catch (err) {
    console.error("❌ Erreur de connexion Prisma:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
