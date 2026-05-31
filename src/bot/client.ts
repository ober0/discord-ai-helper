import { Client, EmbedBuilder, GatewayIntentBits, TextChannel } from "discord.js";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ],
    allowedMentions: {
        parse: ["users"],
        repliedUser: true
    },
    presence: {
        status: "online"
    }
});

client.once("ready", async () => {
    console.log(`✅ Бот запущен как ${client.user?.tag}`);

    // const channel = await client.channels.fetch(process.env.BOT_HOME_CHANELL!);
    //
    // if (channel && channel.isTextBased()) {
    //     const embed = new EmbedBuilder()
    //         .setTitle("Бот успешно запущен 🚀")
    //         .setFooter({ text: `Режим: ${process.env.NODE_ENV}` })
    //         .setColor("Random");
    //
    //     await (channel as TextChannel).send({
    //         embeds: [embed]
    //     });
    // }
});

export default client;