import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import { YOUTUBE, TOKEN, BRUH } from '../config.json';
import { Commands } from "./lib/command";
import { VoiceManager } from "./lib/voice";
import { StateManager } from "./lib/state";
import { BruhListener } from "./lib/listeners/bruh";

import YTDlpWrap from "yt-dlp-wrap";
export const ytdl = new YTDlpWrap(YOUTUBE.BINARY);

export const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent ] });
export const voiceManager = new VoiceManager();
export const stateManager = new StateManager();
export const bruhManager = new BruhListener();

client.once(Events.ClientReady, async client => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`| Registered ${Commands.length} commands!`);
    console.log(`| Voice Manager Status: ${voiceManager ? "ONLINE" : "OFFLINE"}`);

    client.user.setPresence({
        status: "idle",
        activities: [
            {
                name: "The Brook & The Bluff",
                type: ActivityType.Listening,
                url: "https://open.spotify.com/track/7IN1eMlEGrcFUt2dNH1TQ2?si=61f9c4b1f4ea43ff",
            }
        ]
    });
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isChatInputCommand()) {
        const command = Commands.find(command => command.data.name === interaction.commandName);
        if (!command) {
            interaction.followUp({ content: "An error has occurred." });
            return;
        }
        await interaction.deferReply();
        command.execute(client, interaction);
    }
});

client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;
    let content = message.content.toLowerCase();
    if (message.channelId === BRUH.MESSAGE && content === "bruh") stateManager.bruhCount++;
});

//deploy();

client.login(TOKEN);