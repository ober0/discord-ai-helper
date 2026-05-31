import { tool } from "@langchain/core/tools";
import client from "../../bot/client";
import z from "zod";
import {
    ChannelType,
    PermissionsBitField,
    OverwriteResolvable
} from "discord.js";

const EditeChannelSchema = z.object({
    id: z.string(),
    name: z.string().optional().describe("Новое имя канала"),
    topic: z.string().optional().describe("Новое описание канала"),
    parentId: z.string().nullable().optional()
        .describe("Новая родительская категория"),
    nsfw: z.boolean().optional()
        .describe("Сделать канал 18+, только для текстового канала"),
    userLimit: z.number().optional()
        .describe("Лимит пользователей для голосового канала"),
    bitrate: z.number().optional()
        .describe("Битрейт голосового канала"),
    private: z.boolean().optional()
        .describe("Сделать канал приватным"),
    allowedRoleIds: z.array(z.string()).optional()
        .describe("Роли, которым разрешён доступ")
});

export const editeChannelTool = tool(
    async (data: z.infer<typeof EditeChannelSchema>) => {
        const guild = await client.guilds.fetch(process.env.GUILD_ID!);

        const channel = await guild.channels.fetch(data.id);

        if (!channel) {
            return {
                success: false,
                message: "Канал не найден"
            };
        }

        if (
            channel.type !== ChannelType.GuildVoice &&
            (
                data.userLimit !== undefined ||
                data.bitrate !== undefined
            )
        ) {
            return {
                success: false,
                message: "Битрейт и лимит пользователей доступны только для голосовых каналов"
            };
        }

        if (
            channel.type !== ChannelType.GuildText &&
            (
                data.nsfw !== undefined
            )
        ) {
            return {
                success: false,
                message: "nsfw доступны только для текстовых каналов"
            };
        }

        const editData: Record<string, unknown> = {};

        if (data.name !== undefined) {
            editData.name = data.name;
        }

        if (data.topic !== undefined) {
            editData.topic = data.topic;
        }

        if (data.parentId !== undefined) {
            editData.parent = data.parentId;
        }

        if (data.nsfw !== undefined) {
            editData.nsfw = data.nsfw;
        }

        if (data.userLimit !== undefined) {
            editData.userLimit = data.userLimit;
        }

        if (data.bitrate !== undefined) {
            editData.bitrate = data.bitrate;
        }

        await channel.edit(editData);

        if (data.private !== undefined) {
            if (data.private) {

                if (!("permissionOverwrites" in channel)) {
                    return {
                        success: false,
                        message: "Этот тип канала не поддерживает изменение прав"
                    };
                }

                const overwrites: OverwriteResolvable[] = [
                    {
                        id: guild.roles.everyone.id,
                        deny: [PermissionsBitField.Flags.ViewChannel]
                    }
                ];

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

                await channel.permissionOverwrites.set(overwrites);
            } else {
                if (!("permissionOverwrites" in channel)) {
                    return {
                        success: false,
                        message: "Этот тип канала не поддерживает изменение прав"
                    };
                }

                await channel.permissionOverwrites.set([]);
            }
        }

        const updatedChannel = await guild.channels.fetch(channel.id);

        return {
            success: true,

            channel: {
                id: updatedChannel?.id,
                name: updatedChannel?.name,
                type: updatedChannel
                    ? ChannelType[updatedChannel.type]
                    : null,
                parentId: updatedChannel?.parentId
            }
        };
    },
    {
        name: "editeChannel",
        description:
            "Изменяет канал. Поддерживает изменение имени, описания, категории, NSFW, приватности, прав доступа, битрейта и лимита пользователей.",
        schema: EditeChannelSchema
    }
);