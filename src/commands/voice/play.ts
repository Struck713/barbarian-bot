import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import YouTubeAPI, { YoutubeMetadata } from "../../lib/utils/youtube";
import { voiceManager } from "../../app";

export const Play: Command = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play sound in a voice channel using a URL.")
        .addStringOption(option => option.setName("url").setRequired(true).setDescription("A YouTube, Soundcloud or Spotify URL.")),
    execute: async (client, interaction) => {
        let { value } = interaction.options.get("url", true);
        let metadata = await YouTubeAPI.getMetadata(value as string);
        if (!metadata) {
            await interaction.followUp({ content: `\`${value}\` is not a valid YouTube URL!` });
            return;
        }

        if (!interaction.guild || !interaction.member) {
            await interaction.followUp({ content: "You are not in a guild!" });
            return;
        }

        
        let user = await interaction.guild.members.cache.get(interaction.member.user.id);
        if (!user || !user.voice || !user.voice.channel) {
            await interaction.followUp({ content: "You are not in a voice channel!" });
            return;
        }
        
        let connection = voiceManager.get(interaction.guild.id);
        if (connection) {
            connection.play(metadata);
            await interaction.followUp({ content: `**Added to queue:** ${metadata.getTitle()} - ${metadata.getAuthor()}` });
            return;
        }

        connection = voiceManager.join(user.voice.channel);
        connection.play(metadata);

        await interaction.followUp({ content: `**Now playing:** ${metadata.getTitle()} - ${metadata.getAuthor()}` });
    },
}