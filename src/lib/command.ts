import { ChatInputCommandInteraction, Client, GuildMember, SlashCommandBuilder } from "discord.js";
import { PermissionLevel } from "./permissions";

export interface Command {
    metadata: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    permission?: PermissionLevel;
    execute: (client: Client, user: GuildMember, interaction: ChatInputCommandInteraction) => void;
}