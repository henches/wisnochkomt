"use server"

import { prisma } from "@/src/lib/prisma"
import { Expression } from "@/types/Expression"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

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

export const modifyExpressionAction = async (expressionId: number, expression: Expression) => {
    try {
        await prisma.expression.update({
            where: {
                id: expressionId
            },
            data: {
                text: expression.text,
                author: expression.author,
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
    try {
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

    try {
        await prisma.expression.deleteMany({});

        const expressionsToAdd = expressions.map(expression => ({
            text: expression.text,
            author: expression.author,
            info: expression.info
        }))
        const newUser = await prisma.expression.createMany({
            data: expressionsToAdd
        });
    }
    catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            console.error('Prisma error:', error.message);
            return { success: false, message: "Erreur de base de données", error: error.message };
        } else {
            console.error('Unexpected error:', error);
            return { success: false, message: "Erreur inattendue", error: error instanceof Error ? error.message : String(error) };
        }
    }
}