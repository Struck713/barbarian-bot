import { ActivityType, Client, Events, GatewayIntentBits, PermissionsBitField } from "discord.js";
import { youtube, token } from '../config.json';
import commands from "./commands";
import YTDlpWrap from "yt-dlp-wrap";
import { Embeds } from "./utils/embeds";
import * as Style from "./utils/style";
import { db } from "./lib/database";
import { getRole } from "./lib/roles";


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
        const command = commands.find(command => command.metadata.name === interaction.commandName);
        if (!command) {
            await Embeds.error(interaction, "Something went terribly wrong! Contact the developer.");
            return;
        }
        await interaction.deferReply();

        const guild = interaction.guild;
        if (!guild) {
            await Embeds.error(interaction, `${Style.NAME} does not current support DMs!`);
            return;
        }

        const user = guild.members.cache.get(interaction.user.id);
        if (!user) {
            await Embeds.error(interaction, "You aren't a member of this server?? Something went wrong.");
            return;
        }

        if (command.role && !user.permissions.has(PermissionsBitField.All, true)) {
            if (command.role > await getRole(guild.id, user.id)) {
                await Embeds.error(interaction, "You do not have permission to execute this command!");
                return;
            }
        }

        command.execute(client, user, interaction);
    }
});

client.login(token);

process.on('SIGINT', () => {
    console.log(`Logging out of ${client.user?.tag}.`);
    client.destroy();
    db.destroy();
    process.exit();
});