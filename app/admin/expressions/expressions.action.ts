"use server"

import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library"
import { prisma } from "@/src/lib/prisma"
import { Expression } from "@/types/Expression"

export const getExpressionsAction: () => Promise<Expression[]> = async () => {
    console.log("GET !!!!!!!!!!!!!!!!!!!!!!!")
    try {
        console.log("try !!!!!!!!!!!!!!!!!!!!!!!")

        const _expressions: Expression[] = await prisma.expression.findMany({
            orderBy: {
                createdAt: "desc"
            }
        })
        console.log("after !!!!!!!!!!!!!!!!!!!!!!!")

        return _expressions
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        throw error; // ou retournez un message d'erreur approprié
    }
}

export const modifyExpressionAction = async (expressionId: number, expression: Expression) => {
    console.log("🚀 ~ modifyExpressionAction ~ expression:", expression)
    console.log("🚀 ~ createExpressionAction ~ expressionId:", expressionId)
    try {
        console.log("zzzz")
        await prisma.expression.update({
            where: {
                id: expressionId
            },
            data: {
                text: expression.text,
                info: expression.info
            }
        });
        return {
            message: 'Updated'
        }
    }
    catch {
        console.error("Erreur lors de la modification de l'expression :", expressionId);
        return { message: "Error" }
    }
}

export const createExpressionAction = async (expression: Expression) => {
    console.log("🚀 ~ createExpressionAction ~ expression:", expression)
    try {
        console.log("zzzz")
        await prisma.expression.create({
            data: {
                text: expression.text,
                author: expression.author,
                info: expression.info
            }
        });
        return {
            message: 'Created'
        }
    }
    catch {
        console.error("Erreur lors de la création de l'expression :", expression);
        return { message: "Error" }
    }
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

export const importExpressionsAction = async (expressions: Expression[]) => {
    console.log("🚀 ~ replaceExpressionsAction ~ expressions:", expressions)

    try {
        await prisma.expression.deleteMany({});
        console.log('Toutes les expressions ont été supprimés.');

        const expressionsToAdd = expressions.map(expression => ({
            text: expression.text,
            author: expression.author,
            info: expression.info
        }))
        console.log("🚀 ~ importExpressionsAction ~ expressionsToAdd:", expressionsToAdd)
        const newUser = await prisma.expression.createMany({
            data: expressionsToAdd
        });
        console.log('Nouveelles expressions créées :', newUser);
    }
    catch (error) {
        // Gestion des erreurs spécifiques
        if (error instanceof PrismaClientKnownRequestError) {
            // Erreurs connues de Prisma
            console.error('Prisma error:', error.message);
            return { success: false, message: "Erreur de base de données", error: error.message };
        } else {
            // Autres types d'erreurs
            console.error('Unexpected error:', error);
            return { success: false, message: "Erreur inattendue", error: error instanceof Error ? error.message : String(error) };
        }
    }
}