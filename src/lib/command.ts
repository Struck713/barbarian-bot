import { Client, SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export interface Command {
    data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    execute: (client: Client, interaction: ChatInputCommandInteraction) => void;
}