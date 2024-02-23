import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Embeds } from "../../utils/embeds";
import commands from "..";

export default <Command>{
    metadata: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all the available commands.'),
    execute: async (_, user, interaction) => {
        await Embeds.create()
            .setTitle("Help")
            .setDescription(`There's a lot I can do for you. Here is a list of the avaliable commands:`)
            .addFields(commands.map(command => ({ name: `/${command.metadata.name}`, value: command.metadata.description, inline: true })))
            .send(interaction);
    },
}