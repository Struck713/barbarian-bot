import { SlashCommandBuilder } from "discord.js";
import { voiceManager } from "../../app";
import { Command } from "../../lib/command";
import { Embeds } from "../../lib/utils/embeds";
import YouTubeAPI, { YoutubeMetadata } from "../../lib/utils/youtube";

export const Play: Command = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play sound in a voice channel using a URL.")
        .addStringOption(option => option.setName("url").setRequired(false).setDescription("A valid YouTube URL."))
        .addStringOption(option => option.setName("search").setRequired(false).setDescription("A valid YouTube search, picking the top result.")),
    execute: async (client, interaction) => {

        const playMetadata = async (metadata: YoutubeMetadata) => {
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
                connection.play(metadata);
                await Embeds.send(interaction, embed => embed.setAuthor({ name: "Added to queue" })
                    .setTitle(metadata.getTitle())
                    .setURL(metadata.getUrl())
                    .setDescription(`by ${metadata.getAuthor()}`)
                    .setImage(metadata.getThumbnailUrl()));
                return;
            }
    
            connection = voiceManager.join(user.voice.channel);
            connection.play(metadata);
    
            await Embeds.send(interaction, embed => embed.setAuthor({ name: "Now Playing"})
                .setTitle(metadata.getTitle())
                .setURL(metadata.getUrl())
                .setDescription(`by ${metadata.getAuthor()}`)
                .setImage(metadata.getThumbnailUrl()));
        }

        let search = interaction.options.get("search", false);
        let url = interaction.options.get("url", false);
        if (url) {
            let metadata = await YouTubeAPI.getMetadata(url.value as string);
            if (!metadata) {
                await Embeds.error(interaction, `\`${url.value}\` is not a valid YouTube URL.`);
                return;
            }
            await playMetadata(metadata);
        } else if (search) {
            let metadata = await YouTubeAPI.search(search.value as string);
            if (!metadata) {
                await Embeds.error(interaction, `The search \`${search.value}\` did not return anything on YouTube.`);
                return;
            }
            await playMetadata(metadata);
        } else {
            await Embeds.error(interaction, `Please specify either a search or valid YouTube URL.`);
            return;
        }

    },
}