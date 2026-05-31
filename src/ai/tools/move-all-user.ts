import { tool } from "@langchain/core/tools";
import client from "../../bot/client";
import z from "zod";
import { ChannelType } from "discord.js";

const MoveAllUsersSchema = z.object({
    moveFromId: z.string().describe('айди канала в котором находятся юзеры'),
    moveToId: z.string().describe('айди канала в который переместятся юзеры'),
});


export const moveAllUsersTool = tool(
    async (data: z.infer<typeof MoveAllUsersSchema>) => {


        const guild = await client.guilds.fetch(process.env.GUILD_ID!);
        if (!guild) return [];

        const [from, to] = await Promise.all([
            guild.channels.fetch(data.moveFromId),
            guild.channels.fetch(data.moveToId)
        ])

        if (!from) return 'Канал from с таким айди не найден';
        if (!to) return 'Канал to с таким айди не найден';
        if (from.type !== ChannelType.GuildVoice || to.type !== ChannelType.GuildVoice) return 'Переместиться можно только из голосового канала в голосовой канал';

        await Promise.all(
            [...from.members.values()].map(async (member) => {
                await member.voice.setChannel(to.id)
            })
        )
        return `канал установлен для ${from.members.size} пользователей`;
    },
    {
        name: "moveAllUsers",
        description: "Перемещает всех юзеров в канале в другой канал",
        schema: MoveAllUsersSchema,
    }
);