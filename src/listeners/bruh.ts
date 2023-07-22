import { Events } from "discord.js";
import { client } from "../app";

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;
    if (message.content.toLowerCase().includes("bruh")) {
        await message.channel.send("bruh");
    }
});