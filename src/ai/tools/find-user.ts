import { tool } from "@langchain/core/tools";
import client from "../../bot/client";
import z from "zod";

const FindUserFiltersSchema = z.object({
    name: z.string().optional(),
    id: z.string().optional(),
    roleId: z.string().optional()
});


export const findUserTool = tool(
    async (filters: z.infer<typeof FindUserFiltersSchema>) => {

        const guild = await client.guilds.fetch(process.env.GUILD_ID!);
        if (!guild) return [];

        const members = await guild.members.fetch();
        const list = [...members.values()];


        const filtered = list.filter(member => {
            if (filters.name) {
                if (!member.displayName
                    .toLowerCase()
                    .includes(filters.name.toLowerCase()) && !member.user.username
                    .toLowerCase()
                    .includes(filters.name.toLowerCase())
                ) return false;
            }

            if (filters.id) {
                if (member.id !== filters.id) return false;
            }

            if (filters.roleId) {
                if (!member.roles.cache.has(filters.roleId)) return false;
            }

            return true;
        });

        const result = filtered.map(member => ({
            id: member.id,
            serverName: member.displayName,
            username: member.user.username,
            bot: member.user.bot,
            color: member.displayColor,
            roles: [...member.roles.cache.values()].map(role => ({
                id: role.id,
                name: role.name,
            })),
            voice: {
                inVoice: !!member.voice.channel,
                channelId: member.voice.channelId ?? null
            },
            presence: member.presence
                ? { status: member.presence.status }
                : null,
            joinedAt: member.joinedAt
        }));


        return JSON.stringify(result);
    },
    {
        name: "findUser",
        description: "Поиск пользователей Discord по имени, id, роли и username. Ответ включает в себя общую информацию, айди, роли, дату вступления, положение войса и онлайна",
        schema: FindUserFiltersSchema,
    }
);