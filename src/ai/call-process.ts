import { Message } from "discord.js";
import { graph } from "./graph";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { BASE_PROMPT } from "../consts/prompts";
import { TokenUsage } from "../types/usage";
import { createUsage } from "../repositories/usage";
import { createAction } from "../repositories/action";
import { CallProcess } from "../types/callProcess";
import { AI_MODELS } from "../consts";

export async function aiCallProcess(message: Message): Promise<CallProcess> {
    const start = performance.now();

    const aiResponse = await graph.invoke(
        {
            messages: [
                new SystemMessage(
                    BASE_PROMPT
                ),
                new HumanMessage(message.content)
            ]
        },
        {
            recursionLimit: 15,
            configurable: {
                callerId: message.author.id,
                channelId: message.channel.id,
                guildId: message.guild?.id ?? 0,
            }
        }
    ).catch(console.error);

    const end = performance.now();

    const time = end - start


    if (!aiResponse) {
        return {
            text: `произошла ошибка (${time}ms)`,
            time
        }
    }

    let responseMessageText = (aiResponse.messages.at(-1)?.text ?? `Произошла ошибка и я не смог обработать ваш запрос.`) + ` (${Math.round(time)} ms)`
    const usage: TokenUsage = aiResponse.messages
        .map(message => (message.response_metadata as any)?.usage)
        .filter(Boolean)
        .reduce(
            (acc, usage) => {
                return {
                    input: acc.input + (usage.prompt_tokens ?? 0),
                    output: acc.output + (usage.completion_tokens ?? 0),
                    cachedInput: acc.cachedInput + (usage.prompt_tokens_details?.cached_tokens ?? 0),
                };
            },
            {
                input: 0,
                output: 0,
                cachedInput: 0
            }
        );


    const messageCount = {
        total: aiResponse.messages.length,
        ai: aiResponse.messages.filter(el => el.type === 'ai').length,
        tools: aiResponse.messages.filter(el => el.type === 'tool').length,
    }

    const createdAction = await createAction({
        data: {
            req: message.content,
            res: responseMessageText,
        },
        user: {
            id: message.author.id,
            username: message.author.username
        },
        aiCalls: messageCount.ai,
        time
    })

    if (createdAction && 'error' in createdAction) {
        console.error(createdAction.error);
        responseMessageText += '\n Не удалось обновить action таблицу'
    } else {
        const createdUsageResponse  = await createUsage(createdAction.id, usage, AI_MODELS)

        if (createdUsageResponse && 'error' in createdUsageResponse) {
            console.error(createdUsageResponse.error);
            responseMessageText += '\n Не удалось обновить usage таблицу'
        }
    }

    return {
        text: responseMessageText,
        usage,
        messageCount,
        time
    };
}