import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { TOKEN } from '../config.json';
import { Commands, deploy } from "./lib/command";
import { VoiceManager } from "./lib/voice";

const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates ] });
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
})

//deploy();

client.login(TOKEN);