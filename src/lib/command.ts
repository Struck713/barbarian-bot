import { CommandInteraction, Client, REST, Routes, SlashCommandBuilder, ChatInputCommandInteraction, SharedSlashCommandOptions, SlashCommandSubcommandsOnlyBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import { TOKEN, DEVELOPMENT } from '../../config.json';
import commands from "../commands";

export interface Command {
    data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    execute: (client: Client, interaction: ChatInputCommandInteraction) => void;
}

export const deploy = () => {
    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(TOKEN);

    // and deploy your commands!
    (async () => {
        try {
            console.log(`Started refreshing ${commands.length} application (/) commands.`);
            // The put method is used to fully refresh all commands in the guild with the current set
            // Routes.applicationGuildCommands(DEVELOPMENT.APPLICATION_ID, DEVELOPMENT.GUILD_ID)
            const data = await rest.put(
                Routes.applicationCommands(DEVELOPMENT.APPLICATION_ID),
                { body: commands.map(command => command.data) },
            ) as any[];

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
}