import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Embeds } from "../../utils/embeds";
import { Style } from "../../utils/style";
import Time from "../../utils/time";

const startup = Date.now();

export default <Command>{
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Shows the current status for the bot.'),
    execute: async (_, interaction) => {
        let sent = Date.now();
        await Embeds.create()
            .setTitle("Status")
            .setDescription(`
                Bot has a latency of \`${sent - interaction.createdTimestamp}ms\`.
                Currently running version \`${Style.VERSION}\` using \`${Style.ENGINE_VERSION}\`. 
                ${Style.NAME} has been online for \`${Time.latestTime(Date.now() - startup)}\`.
            `)
            .send(interaction);
    },
}