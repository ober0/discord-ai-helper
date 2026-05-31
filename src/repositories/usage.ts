import { TokenUsage } from "../types/usage";
import { prisma } from "../prisma";

export async function createUsage(actionId: number, usage: TokenUsage, model: string): Promise<void | { error: string }> {
    try {
         await prisma.aiUsage.create({
            data: {
                inputCachedTokens: usage.cachedInput,
                inputTokens: usage.input,
                outputTokens: usage.output,
                actionHistory: {
                    connect: {
                        id: actionId
                    }
                },
                model
            }
        })
    }
    catch (e: any) {
        return {
            error: e.message ?? 'Неизвестная ошибка',
        }
    }


}