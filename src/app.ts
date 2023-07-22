import { Client, Events, GatewayIntentBits } from "discord.js";
import { TOKEN } from '../config.json';
import { Commands } from "./lib/command";
import { VoiceManager } from "./lib/voice";

export const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent ] });
export const voiceManager = new VoiceManager();

client.once(Events.ClientReady, async client => {
    console.log(`Logged in as ${client.user.tag}`);
    console.log(`| Registered ${Commands.length} commands!`);
    console.log(`| Voice Manager Status: ${voiceManager ? "ONLINE" : "OFFLINE"}`);
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
    if (message.content.toLowerCase().includes("bruh")) {
        await message.channel.send("bruh");
    }
});

//deploy();

client.login(TOKEN);