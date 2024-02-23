import { SlashCommandBuilder } from "discord.js";
import { Command, deploy } from "../lib/command";
import { Embeds } from "../lib/utils/embeds";
import commands from ".";

const MY_SNOWFLAKE = "140520164629151744";

export const Deploy: Command = {
    data: new SlashCommandBuilder()
        .setName('deploy')
        .setDescription('Deploys slash commands for the bot.'),
    execute: async (_, interaction) => {
        if (interaction.user.id === MY_SNOWFLAKE) {
            deploy();
            await Embeds.create()
                    .setTitle("Deployed commands")
                    .setDescription(`${commands.length} commands have been deployed.`)
                    .send(interaction);
        } else await Embeds.error(interaction, "You do not have permission to execute this command!");
    },
}