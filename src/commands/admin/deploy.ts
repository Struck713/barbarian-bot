import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Embeds } from "../../utils/embeds";
import commands from "..";

import { token, development } from '../../../config.json';

const MY_SNOWFLAKE = "140520164629151744";

export default <Command>{
    data: new SlashCommandBuilder()
        .setName('deploy')
        .setDescription('Deploys slash commands for the bot.'),
    execute: async (_, interaction) => {
        if (interaction.user.id === MY_SNOWFLAKE) {
            const rest = new REST().setToken(token);

            // and deploy your commands!
            (async () => {
                try {
                    console.log(`Started refreshing ${commands.length} application (/) commands.`);
                    // The put method is used to fully refresh all commands in the guild with the current set
                    // Routes.applicationGuildCommands(DEVELOPMENT.APPLICATION_ID, DEVELOPMENT.GUILD_ID)
                    const data = await rest.put(
                        Routes.applicationCommands(development.application_id),
                        { body: commands.map(command => command.data) },
                    ) as any[];

                    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
                } catch (error) {
                    // And of course, make sure you catch and log any errors!
                    console.error(error);
                }
            })();
            await Embeds.create()
                    .setTitle("Deployed commands")
                    .setDescription(`${commands.length} commands have been deployed.`)
                    .send(interaction);
        } else await Embeds.error(interaction, "You do not have permission to execute this command!");
    },
}