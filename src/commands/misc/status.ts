import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Embeds } from "../../utils/embeds";
import * as Style from "../../utils/style";
import Time from "../../utils/time";
import { Git } from "../../utils/misc";

const startup = Date.now();

export default <Command>{
    metadata: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Shows the current status for the bot.'),
    execute: async (_, user, interaction) => {
        const sent = Date.now();
        const hash = await Git.getVersionHash();
        await Embeds.create()
            .setTitle("Status")
            .setDescription(`
                Bot has a latency of \`${sent - interaction.createdTimestamp}ms\`.
                Currently running version \`git-${hash}\` using \`${Style.ENGINE_VERSION}\`. 
                ${Style.NAME} has been online for \`${Time.latestTime(Date.now() - startup)}\`.
            `)
            .send(interaction);
    },
}