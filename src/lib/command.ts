import { CommandInteraction, Client, REST, Routes, SlashCommandBuilder } from "discord.js";
import { Ping } from "../commands/ping";
import { Play } from "../commands/voice/play";
import { Skip } from "../commands/voice/skip";
import { TOKEN, DEVELOPMENT } from '../../config.json';

export interface Command {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">,
    execute: (client: Client, interaction: CommandInteraction) => void;
}

export const Commands: Command[] = [ Ping, Play, Skip ];

export const deploy = () => {
    // Construct and prepare an instance of the REST module
    const rest = new REST().setToken(TOKEN);

    // and deploy your commands!
    (async () => {
        try {
            console.log(`Started refreshing ${Commands.length} application (/) commands.`);

            console.log(Commands.map(command => command.data.toJSON()))

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationGuildCommands(DEVELOPMENT.APPLICATION_ID, DEVELOPMENT.GUILD_ID),
                { body: Commands.map(command => command.data) },
            ) as any[];

            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
}