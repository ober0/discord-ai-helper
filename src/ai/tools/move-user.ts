import { tool } from "@langchain/core/tools";
import client from "../../bot/client";
import z from "zod";
import { ChannelType } from "discord.js";

const MoveUserSchema = z.object({
    userId: z.string(),
    moveToId: z.string().describe('айди канала в который переместится юзер'),
});


export const moveUserTool = tool(
    async (data: z.infer<typeof MoveUserSchema>) => {

        const guild = await client.guilds.fetch(process.env.GUILD_ID!);
        if (!guild) return [];

        const [user, channel] = await Promise.all([
            guild.members.fetch(data.userId),
            guild.channels.fetch(data.moveToId)
        ])

        if (!user) return 'Пользователь с таким айди не найден';
        if (!channel) return 'Канал с таким айди не найден';
        if (channel.type !== ChannelType.GuildVoice) return 'Переместиться можно тольео в голосовой канал';
        if (!user.voice.channel) return 'Пользователь должен быть в канале'

        await user.voice.setChannel(channel.id);

        return 'канал установлен';
    },
    {
        name: "moveUser",
        description: "Перемещает пользователя в другой канал по id",
        schema: MoveUserSchema,
    }
);