import { tool } from "@langchain/core/tools";
import client from "../../bot/client";
import z from "zod"

export const findRoleTool = tool(
    async (filters: {
        name?: string
    }) => {
        const guild = await client.guilds.fetch(process.env.GUILD_ID!);

        if (!guild) {
            return JSON.stringify([]);
        }

        const rolesCollection = await guild.roles.fetch()
        const roles = [...rolesCollection.values()]

        const filtered = roles.filter(el => {
            if (filters.name) {
                if (!el.name.toLowerCase().includes(filters.name.toLowerCase())) {
                    return false
                }
            }

            return true
        })

        return JSON.stringify(
            filtered.map(el => ({
                color: el.colors,
                name: el.name,
                users: el.permissions.toArray(),
                position: el.position,
                id: el.id,
            }))
        )

    },
    {
        name: "findRole",
        description: "Получает все роли, айди, права роли, цвета и позицию в иерархии. с фильтрами по имени",
        schema: z.object({
            name: z.string().optional().describe('Поиск по имени роли'),
        })
    }
);