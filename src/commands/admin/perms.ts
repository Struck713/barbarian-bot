import { Colors, SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Embeds } from "../../utils/embeds";
import { PermissionLevel, getNameFromPermissionLevel, permissionManager } from "../../lib/permissions";

export default <Command>{
    metadata: new SlashCommandBuilder()
        .setName('perms')
        .setDescription('Changes internal bot permissions for a user')
        .addSubcommand(subcommand => subcommand
                .setName("set")
                .setDescription("Sets a user's permission level")
                .addUserOption(option => option.setName("user").setDescription("The user to set the permission level for").setRequired(true))
                .addStringOption(option => option.setName("level")
                    .setDescription("The permission level to set the user to")
                    .setChoices(...Object.keys(PermissionLevel).map(level => ({ name: level, value: level })))
                    .setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName("view")
            .setDescription("View a users permission level")
            .addUserOption(option => option.setName("user").setDescription("The user to set the permission level for").setRequired(true))
        )
        .setDMPermission(false),
    permission: PermissionLevel.ADMIN,
    execute: async (_, user, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        if (subcommand == "set") {
            const level = interaction.options.getString("level", true);
            const target = interaction.options.getUser("user", true);
            const permissionLevel = PermissionLevel[level as keyof typeof PermissionLevel];

            permissionManager.setPermissionLevel(interaction.guild!.id, target.id, permissionLevel);

            await Embeds.create()
                .setTitle("Permission Level")
                .setDescription(`${target.toString()}'s permission level has been changed to \`${getNameFromPermissionLevel(permissionLevel)}\``)
                .send(interaction);
        } else if (subcommand == "view") {
            const target = interaction.options.getUser("user", true);
            const permissionLevel = permissionManager.getPermissionLevel(interaction.guild!.id, target.id);

            await Embeds.create()
                .setTitle("Permission Level")
                .setDescription(`${target.toString()}'s permission level is \`${getNameFromPermissionLevel(permissionLevel)}\``)
                .send(interaction);
        }
    },
}