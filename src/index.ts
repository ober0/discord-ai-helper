import "dotenv/config";
import client  from "./bot/client";

import './bot/routes/messages'

client.login(process.env.DISCORD_BOT_TOKEN!);