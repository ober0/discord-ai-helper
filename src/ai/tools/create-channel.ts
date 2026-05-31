import { tool } from "@langchain/core/tools";
import client from "../../bot/client";
import z from "zod";
import {
    ChannelType,
    PermissionsBitField,
    OverwriteResolvable
} from "discord.js";

const CreateChannelSchema = z.object({
    name: z.string(),
    type: z.enum([
        "text",
        "voice",
        "forum",
        "category"
    ]).describe("Тип канала"),
    parentId: z.string().optional().describe("Родительская категория"),
    private: z.boolean().optional().default(false),
    allowedRoleIds: z.array(z.string()).optional().describe(
        "Роли, которым разрешён доступ"
    ),
    topic: z.string().optional().describe('Описание канала'),
    nsfw: z.boolean().optional().default(false).describe('Сделать ли ограничение 18+, только для текстового канала'),
    userLimit: z.number().optional().describe('Ограничение по юзерам. Только для войса'),
    bitrate: z.number().optional().describe('Битрейт канала, для войса')
});

const typeMap = {
    text: ChannelType.GuildText,
    voice: ChannelType.GuildVoice,
    forum: ChannelType.GuildForum,
    category: ChannelType.GuildCategory
} as const;

export const createChannelTool = tool(
    async (data: z.infer<typeof CreateChannelSchema>) => {
        const guild = await client.guilds.fetch(process.env.GUILD_ID!);

        const overwrites: OverwriteResolvable[] = [];

        if (data.private) {
            overwrites.push({
                id: guild.roles.everyone.id,
                deny: [PermissionsBitField.Flags.ViewChannel]
            });

            for (const roleId of data.allowedRoleIds ?? []) {
                overwrites.push({
                    id: roleId,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.Connect,
                        PermissionsBitField.Flags.Speak
                    ]
                });
            }
        }

        const channel = await guild.channels.create({
            name: data.name,
            type: typeMap[data.type],
            parent: data.parentId,
            permissionOverwrites: overwrites,
            topic: data.topic,
            nsfw: typeMap[data.type] === ChannelType.GuildText ? data.nsfw : undefined,
            userLimit: typeMap[data.type] === ChannelType.GuildVoice ?  data.userLimit : undefined,
            bitrate: typeMap[data.type] === ChannelType.GuildVoice ? data.bitrate : undefined
        });

        return {
            success: true,
            id: channel.id,
            name: channel.name,
            type: ChannelType[channel.type],
            parentId: channel.parentId
        };
    },
    {
        name: "createChannel",
        description:
            "Создает текстовый, голосовой, форумный или другой канал. Может создать приватный канал с доступом только для указанных ролей.",
        schema: CreateChannelSchema
    }
);