import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import { youtube, TOKEN } from '../config.json';
import commands from "./commands";
import YTDlpWrap from "yt-dlp-wrap";
import { Embeds } from "./lib/utils/embeds";

export const ytdl = new YTDlpWrap(youtube.binary_path);
export const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildVoiceStates, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ]
});

client.once(Events.ClientReady, async client => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({
        status: "idle",
        activities: [
            {
                name: "Roblox",
                type: ActivityType.Playing
            }
        ]
    });
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = commands.find(command => command.data.name === interaction.commandName);
        if (!command) {
            await Embeds.error(interaction, "Something went terribly wrong! Contact the developer.");
            return;
        }
        await interaction.deferReply();
        command.execute(client, interaction);
    }
});

client.login(TOKEN);
