import { tool } from "@langchain/core/tools";
import client from "../../bot/client";
import z from "zod";

const AddRoleSchema = z.object({
    userId: z.string(),
    roleId: z.string(),
});

export const addRoleTool = tool(
    async (data: z.infer<typeof AddRoleSchema>) => {
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

        try {
            await member.roles.add(role);
        }
        catch (error) {
            console.log(error);
        }


    },
    {
        name: "addRole",
        description: "Добавляет роль пользователю на сервере",
        schema: AddRoleSchema,
    }
);