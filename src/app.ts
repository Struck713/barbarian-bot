import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import { YOUTUBE, TOKEN } from '../config.json';
import { COMMANDS } from "./commands";
import { VoiceManager } from "./lib/voice";
import { StateManager } from "./lib/state";
import YTDlpWrap from "yt-dlp-wrap";
import { Embeds } from "./lib/utils/embeds";
import { PollManager } from "./commands/poll";
export const ytdl = new YTDlpWrap(YOUTUBE.BINARY);

export const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] });
export const voiceManager = new VoiceManager();
export const stateManager = new StateManager();
export const pollManager = new PollManager();

client.once(Events.ClientReady, async client => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`| Registered ${COMMANDS.length} commands!`);
    console.log(`| Voice Manager Status: ${voiceManager ? "ONLINE" : "OFFLINE"}`);

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
        const command = COMMANDS.find(command => command.data.name === interaction.commandName);
        if (!command) {
            await Embeds.error(interaction, "Something went terribly wrong! Contact the developer.");
            return;
        }
        await interaction.deferReply();
        command.execute(client, interaction);
    }
});

client.login(TOKEN);