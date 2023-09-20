import { SlashCommandBuilder } from "discord.js";
import { Command } from "../lib/command";
import { Embeds } from "../lib/utils/embeds";
import { Style } from "../lib/utils/style";
import Time from "../lib/utils/time";

const TIME_AT_START = Date.now();

export const Status: Command = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Shows the current status for the bot.'),
    execute: async (client, interaction) => {
        await Embeds.send(interaction, embed => embed
            .setTitle("Status")
            .setDescription(`
                Use \`/help\` to see all the commands. \n
                Currently running version \`${Style.VERSION}\` using \`${Style.ENGINE_VERSION}\`. 
                ${Style.NAME} has been online for \`${Time.latestTime(Date.now() - TIME_AT_START)}\`.
            `));
    },
}