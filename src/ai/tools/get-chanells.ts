import { tool } from "@langchain/core/tools";
import client from "../../bot/client";
import { ChannelType } from "discord.js";

export const getChannelsInfoTool = tool(
    async () => {
        const guild = await client.guilds.fetch(process.env.GUILD_ID!);

        if (!guild) {
            return JSON.stringify([]);
        }

        const channels = await guild.channels.fetch();

        const result = [...channels.values()]
            .filter(Boolean)
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
                    isPrivate
                };
            })
            .filter(Boolean);

        return JSON.stringify(result);
    },
    {
        name: "getChannels",
        description: "Получает все каналы сервера с типами, категориями, приватностью и voice статистикой, а так же список юзеров в войс каналах и их количество."
    }
);