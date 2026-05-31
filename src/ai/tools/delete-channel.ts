import { tool } from "@langchain/core/tools";
import client from "../../bot/client";
import z from "zod";
import {
    ChannelType,
    PermissionsBitField,
    OverwriteResolvable
} from "discord.js";

const DeleteChannelSchema = z.object({
    id: z.string(),
});


export const deleteChannelTool = tool(
    async (data: z.infer<typeof DeleteChannelSchema>) => {
        const guild = await client.guilds.fetch(process.env.GUILD_ID!);

       const channel = await guild.channels.fetch(data.id)

        if (!channel) return 'канал не существует';

        await channel.delete();

    },
    {
        name: "deleteChannel",
        description:
            "Удаляет канал по айди.",
        schema: DeleteChannelSchema
    }
);