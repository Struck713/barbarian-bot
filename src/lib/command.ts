import { ChatInputCommandInteraction, Client, GuildMember, SlashCommandBuilder } from "discord.js";
import { Role } from "./roles";

export interface Command {
    metadata: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    role?: Role;
    execute: (client: Client, user: GuildMember, interaction: ChatInputCommandInteraction) => void;
}