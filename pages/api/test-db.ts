import { prisma } from "@/src/lib/prisma";

export default async function handler(req, res) {
  try {
    console.log("DATABASE_URL:", process.env.DATABASE_URL);

    const expressions = await prisma.expression.findMany();
    res.status(200).json({ success: true, data: expressions });
  } catch (error) {
    console.error('Erreur Prisma :', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
