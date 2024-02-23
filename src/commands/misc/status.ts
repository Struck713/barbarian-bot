import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Embeds } from "../../lib/utils/embeds";
import { Style } from "../../lib/utils/style";
import Time from "../../lib/utils/time";

const STARTUP_TIME = Date.now();

export const Status: Command = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Shows the current status for the bot.'),
    execute: async (client, interaction) => {
        let sent = Date.now();
        await Embeds.create()
            .setTitle("Status")
            .setDescription(`
                Bot has a latency of \`${sent - interaction.createdTimestamp}ms\`.
                Currently running version \`${Style.VERSION}\` using \`${Style.ENGINE_VERSION}\`. 
                ${Style.NAME} has been online for \`${Time.latestTime(Date.now() - STARTUP_TIME)}\`.
            `)
            .send(interaction);
    },
}