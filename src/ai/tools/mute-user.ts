import { tool } from "@langchain/core/tools";
import client from "../../bot/client";
import z from "zod";

const MuteUserSchema = z.object({
    userId: z.string(),
    timeMin: z.number().describe('Время мута в минутах'),
});

export const muteUserTool = tool(
    async (data: z.infer<typeof MuteUserSchema>) => {
        const guild = await client.guilds.fetch(process.env.GUILD_ID!);

        if (!guild) {
            return { success: false, message: "Канал не найден" };
        }


        const member = await guild.members.fetch(data.userId);
        if (!member) {
            return { success: false, message: "Юзер не найден" };
        }

        await member.timeout(data.timeMin * 60);

    },
    {
        name: "muteUser",
        description: "Мутит пользователя",
        schema: MuteUserSchema,
    }
);