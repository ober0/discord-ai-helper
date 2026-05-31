import  { Events } from "discord.js";
import client from "../client";

client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    return message.reply(message.content)
});