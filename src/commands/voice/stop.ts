import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import YouTubeAPI, { YoutubeMetadata } from "../../lib/utils/youtube";
import { voiceManager } from "../../app";
import { Embeds } from "../../lib/utils/embeds";

export const Stop: Command = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Disconnect from voice and clear the queue."),
    execute: async (client, interaction) => {

        if (!interaction.guild || !interaction.member) {
            await Embeds.error(interaction, "You are not in a guild!");
            return;
        }

        let user = await interaction.guild.members.cache.get(interaction.member.user.id);
        if (!user || !user.voice || !user.voice.channel) {
            await Embeds.error(interaction, "You are not in a voice channel!");
            return;
        }

        let connection = voiceManager.get(interaction.guild.id);
        if (connection) {
            connection.disconnect();
            await Embeds.send(interaction, embed => embed.setAuthor({ name: "Disconnected" }).setDescription("Disconnected from voice and cleared the queue."));
            return;
        }

        await Embeds.error(interaction, "I am not in a voice channel!");
    },
}