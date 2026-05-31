import { tool } from "@langchain/core/tools";
import client from "../../bot/client";
import { ChannelType } from "discord.js";
import z from "zod";


export const findChannelsTool = tool(
    async (filters: {
        name?: string,
        userCount?: {
            lte?: number,
            gte?: number
        },
        type?: 'voice' | 'text' | 'category' | 'media'
    }) => {
        const guild = await client.guilds.fetch(process.env.GUILD_ID!);


        if (!guild) {
            return JSON.stringify([]);
        }

        const channels = await guild.channels.fetch();

        const result = [...channels.values()]
            .map(channel => {
                if (!channel) return null;

                const category = channel.parent
                    ? {
                        id: channel.parent.id,
                        name: channel.parent.name
                    }
                    : null;

                const typeMap: Record<number, string> = {
                    [ChannelType.GuildText]: "text",
                    [ChannelType.GuildVoice]: "voice",
                    [ChannelType.GuildCategory]: "category",
                    [ChannelType.GuildMedia]: "media",
                };

                const type = typeMap[channel.type] ?? channel.type;

                const isVoice = channel.isVoiceBased();

                const membersCount = isVoice ? channel.members.size : 0;

                const everyoneOverwrite = channel.guild.roles.everyone
                    ? channel.permissionOverwrites.cache.get(channel.guild.roles.everyone.id)
                    : undefined;

                const isPrivate = !!everyoneOverwrite?.deny.has("ViewChannel");

                let members: { name: string; id: string }[] = [];

                if (isVoice) {
                    members = [...channel.members.values()].map(member => ({
                        id: member.id,
                        name: member.displayName,
                        accountName: member.user.username,
                    }));
                }

                return {
                    id: channel.id,
                    name: "name" in channel ? channel.name : null,
                    type,
                    category,
                    isVoice,
                    membersCount,
                    members,
                    isPrivate,
                    nsfw: channel.type === ChannelType.GuildText ? channel.nsfw : undefined,
                    voiceSettings: channel.type === ChannelType.GuildVoice ? {
                        bitrate: channel.bitrate,
                        userLimit: channel.userLimit
                    } : undefined
                };
            })
            .filter(el => {
                if (!el) {
                    return false
                }
                if (filters.name) {
                    if (!el?.name?.toLowerCase().includes(filters.name.toLowerCase())) {
                        return false;
                    }
                }

                if (filters.userCount) {
                    const count = el?.membersCount;

                    if (filters.userCount.lte != null) {
                        if (count == null || count > filters.userCount.lte) {
                            return false;
                        }
                    }

                    if (filters.userCount.gte != null) {
                        if (count == null || count < filters.userCount.gte) {
                            return false;
                        }
                    }
                }

                if (filters.type) {
                    if (el.type !== filters.type) {
                        return false;
                    }
                }

                return true;
            });

        return JSON.stringify(result);
    },
    {
        name: "findChannels",
        description: "Получает по фильтрам каналы сервера с типами, категориями, приватностью и voice статистикой, а так же список юзеров в войс каналах и их количество.",
        schema: z.object({
            name: z.string().optional().describe('Поиск по имени канала'),
            userCount: z.object({
                lte: z.number().optional().describe('Меньше или равно'),
                gte: z.number().optional().describe('Больше или равно'),
            }).optional(),
            type: z.string().optional().describe('Тип канала: voice | text | category | media'),
        })
    }
);