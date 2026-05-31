import { prisma } from "../prisma";
import { ActionHistory } from "@prisma/client";
import { Action } from "../types/action";

export async function createAction(action: Action): Promise<ActionHistory | { error: string }> {
    try {
         const response = await prisma.actionHistory.create({
            data: {
                userName: action.user.username,
                userDiscordId: action.user.id,
                req: action.data.req,
                res: action.data.res,
                aiCalls: action.aiCalls,
                timeMs: action.time
            }
        })

        return response
    }
    catch (e: any) {
        return {
            error: e.message ?? 'Неизвестная ошибка',
        }
    }


}