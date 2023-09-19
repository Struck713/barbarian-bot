import { SlashCommandBuilder } from "discord.js";
import { Command, deploy } from "../lib/command";
import { Embeds } from "../lib/utils/embeds";
import { COMMANDS } from ".";

const MY_SNOWFLAKE = "140520164629151744";

export const Deploy: Command = {
    data: new SlashCommandBuilder()
        .setName('deploy')
        .setDescription('Deploys slash commands for the bot.'),
    execute: async (client, interaction) => {
        if (interaction.user.id === MY_SNOWFLAKE) {
            deploy();
            await Embeds.send(interaction, embed => embed
                    .setTitle("Deployed commands")
                    .setDescription(`${COMMANDS.length} commands have been deployed.`));
        } else await Embeds.error(interaction, "You do not have permission to execute this command!");
    },
}