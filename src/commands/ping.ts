import { SlashCommandBuilder } from "discord.js";
import { Command } from "../lib/command";

export const Ping: Command = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    execute: async (client, interaction) => {
        await interaction.followUp({
            ephemeral: true,
            content: "Pong!"
        });
    },
}