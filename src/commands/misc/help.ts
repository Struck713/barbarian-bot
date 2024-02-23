import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Embeds } from "../../lib/utils/embeds";
import commands from "..";

export const Help: Command = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Lists all the available commands.'),
    execute: async (client, interaction) => {
        await Embeds.create()
            .setTitle("Help")
            .setDescription(`There's a lot I can do for you. Here is a list of the avaliable commands:`)
            .addFields(commands.map(command => ({ name: `/${command.data.name}`, value: command.data.description, inline: true })))
            .send(interaction);
    },
}