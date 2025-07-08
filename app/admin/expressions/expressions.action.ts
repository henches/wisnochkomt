"use server"

import { prisma } from "@/src/lib/prisma"
import { Expression } from "@/types/Expression"

export const getExpressionsAction: () => Promise<Expression[]> = async () => {
    try {
        const _expressions: Expression[] = await prisma.expression.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
        return _expressions
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        throw error; // ou retournez un message d'erreur approprié
    }
}

export const createExpressionAction = async (expression: Expression) => {
    console.log("🚀 ~ createExpressionAction ~ expression:", expression)
    try {
        console.log("zzzz")
        await prisma.expression.create({
            data: {
                text: expression.text,
                info: expression.info
            }
        });
        return {
            message: 'Created'
        }
    }
    catch { 
        console.error("Erreur lors de la création de l'expression :", expression);
        return { message: "Error" } }
}


export const deleteExpressionAction = async (id: number) => {
    console.log("🚀 ~ deleteExpressionAction ~ id:", id)
    try {
        await prisma.expression.delete({
            where: {
                id
            }
        })
        return {
            message: 'Deleted'
        }
    }
    catch { return { message: "Error" } }
}