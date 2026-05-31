import  { Events } from "discord.js";
import client from "../client";
import { aiCallProcess } from "../../ai/call-process";

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    const response = await aiCallProcess(message)

    return message.reply(response.text)
});