import { tool } from "@langchain/core/tools";
import client from "../../bot/client";
import z from "zod";

const DeleteRoleSchema = z.object({
    userId: z.string(),
    roleId: z.string(),
});

export const deleteRoleTool = tool(
    async (data: z.infer<typeof DeleteRoleSchema>) => {
        const guild = await client.guilds.fetch(process.env.GUILD_ID!);

        if (!guild) {
            return { success: false, message: "Канал не найден" };
        }

        const role = await guild.roles.fetch(data.roleId);
        if (!role) {
            return { success: false, message: "Роль не найдена" };
        }

        const member = await guild.members.fetch(data.userId);
        if (!member) {
            return { success: false, message: "Юзер не найден" };
        }

        if (![...member.roles.cache.values()].some(memberRole => memberRole.name === role.name)) {
            return {
                success: false,
                message: 'У юзера нет данной роли'
            }
        }

        await member.roles.remove(role);

        return {
            success: true,
        }

    },
    {
        name: "deleteRole",
        description: "Добавляет роль пользователю на сервере",
        schema: DeleteRoleSchema,
    }
);