import { tool } from "@langchain/core/tools";
import z from "zod";
import { getActions } from "../../repositories/action";

const getUsageSchema = z.object({
    timeHours: z
        .number()
        .optional()
        .describe(
            "Время статистики в часах. Например 1 = последний час, undefined = всё время"
        ),
});

export const getUsageTool = tool(
    async (data: z.infer<typeof getUsageSchema>) => {
        const actions = await getActions(data.timeHours);

        const totalTokensUsage = actions.reduce(
            (acc, usage) => {
                return {
                    input:
                        acc.input +
                        (usage.usage?.inputTokens ?? 0),
                    output:
                        acc.output +
                        (usage.usage?.outputTokens ?? 0),
                    cachedInput:
                        acc.cachedInput +
                        (usage.usage?.inputCachedTokens ?? 0),
                };
            },
            {
                input: 0,
                output: 0,
                cachedInput: 0,
            }
        );

        const requests = actions.length;

        const userRequestMap: Record<
            string,
            {
                requests: number;
                usage: {
                    input: number;
                    output: number;
                    cachedInput: number;
                };
            }
        > = {};

        for (const action of actions) {
            const userName = action.userName ?? "unknown";

            if (!userRequestMap[userName]) {
                userRequestMap[userName] = {
                    requests: 0,
                    usage: {
                        input: 0,
                        output: 0,
                        cachedInput: 0,
                    },
                };
            }

            userRequestMap[userName].requests += 1;

            userRequestMap[userName].usage.input +=
                action.usage?.inputTokens ?? 0;

            userRequestMap[userName].usage.output +=
                action.usage?.outputTokens ?? 0;

            userRequestMap[userName].usage.cachedInput +=
                action.usage?.inputCachedTokens ?? 0;
        }

        return {
            summary: {
                requests,
                totalTokensUsage,
            },
            perUser: userRequestMap,
        };
    },
    {
        name: "getUsage",
        description:
            "Возвращает статистику использования: токены и количество запросов по пользователям",
        schema: getUsageSchema,
    }
);