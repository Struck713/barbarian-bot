import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Role, getNameFromRole, getRole, setRole } from "../../lib/roles";
import { Embeds } from "../../utils/embeds";

export default <Command>{
    metadata: new SlashCommandBuilder()
        .setName('perms')
        .setDescription('Changes internal bot permissions for a user')
        .addSubcommand(subcommand => subcommand
                .setName("set")
                .setDescription("Sets a user's permission level")
                .addUserOption(option => option.setName("user").setDescription("The user to set the permission level for").setRequired(true))
                .addStringOption(option => option.setName("role")
                    .setDescription("The permission level to set the user to")
                    .setChoices(...Object.keys(Role).map(level => ({ name: level, value: level })))
                    .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName("view")
            .setDescription("View a users permission level")
            .addUserOption(option => option.setName("user").setDescription("The user to set the permission level for").setRequired(true))
        )
        .setDMPermission(false),
    role: Role.ADMINISTRATOR,
    execute: async (_, user, interaction) => {

        if (!interaction.guild) {
            await Embeds.error(interaction, "You are not in a guild!");
            return; // This shouldnt happen
        }

        const subcommand = interaction.options.getSubcommand();
        if (subcommand == "set") {
            const selectedRole = interaction.options.getString("role", true);
            const target = interaction.options.getUser("user", true);
            const role = Role[selectedRole as keyof typeof Role];

            await setRole(interaction.guild.id, target.id, role);

            await Embeds.create()
                .setTitle("Permission Level")
                .setDescription(`${target.toString()}'s permission level has been changed to \`${getNameFromRole(role)}\``)
                .send(interaction);
        } else if (subcommand == "view") {
            const target = interaction.options.getUser("user", true);
            const role = await getRole(interaction.guild.id, target.id);

            await Embeds.create()
                .setTitle("Permission Level")
                .setDescription(`${target.toString()}'s permission level is \`${getNameFromRole(role)}\``)
                .send(interaction);
        }
    },
}