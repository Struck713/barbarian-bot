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

const REPLIES = [
    "https://media.discordapp.net/attachments/709446245516574860/1153875831857352784/gideobn_lala.gif",
    "https://media.discordapp.net/attachments/1072009407497515059/1150969108008017960/brett.gif",
    "https://images-ext-2.discordapp.net/external/nqpPlVXUTEYQzmBZuYAhWBNyCRaxTVQ_GT8cNjfQaCQ/https/media.tenor.com/GEuUa7wY5JwAAAPo/sad-speech-bubble.mp4",
    "https://media.discordapp.net/attachments/709446245516574860/1150672443426484246/maletic.gif",
    "https://images-ext-1.discordapp.net/external/zSnVZqNRKx3g9Rc4D1kc7Hl_p2Qs5uomscPH6p9lp2E/https/media.tenor.com/HrUh7_ReprYAAAPo/police-help-speech-bubble.mp4",
    "https://media.tenor.com/ESD9F3r4uXIAAAPo/bubble-text-owl-text-bubble.mp4",
    "https://media.discordapp.net/attachments/709446245516574860/1151728821150695464/fridge.gif?width=507&height=676"
]

client.on(Events.MessageCreate, async message => {
    if (Math.random() < 0.1) {
        await message.reply({ files: [ REPLIES[Math.floor(Math.random() * REPLIES.length)] ]});
        return;
    }
})

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