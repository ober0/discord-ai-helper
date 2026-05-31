import { tool } from "@langchain/core/tools";
import client from "../../bot/client";
import z from "zod";

const UnmuteUserSchema = z.object({
    userId: z.string(),
});

export const unmuteUserTool = tool(
    async (data: z.infer<typeof UnmuteUserSchema>) => {
        const guild = await client.guilds.fetch(process.env.GUILD_ID!);

        if (!guild) {
            return { success: false, message: "Канал не найден" };
        }


        const member = await guild.members.fetch(data.userId);
        if (!member) {
            return { success: false, message: "Юзер не найден" };
        }

        await member.timeout(null);

    },
    {
        name: "unmuteUser",
        description: "Снимает мут с пользователя",
        schema: UnmuteUserSchema,
    }
);