import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Embeds } from "../../lib/utils/embeds";
import YouTubeAPI, { YoutubeMetadata } from "../../lib/utils/youtube";
import { Text } from "../../lib/utils/misc";
import * as VoiceManager from "../../lib/voice";

export const Play: Command = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song by search.")
        .addStringOption(option => option.setName("search").setRequired(true).setDescription("A valid YouTube search, picking the top result.")),
    execute: async (_, interaction) => {

        if (!interaction.guild || !interaction.member) {
            await Embeds.error(interaction, "You are not in a guild!");
            return;
        }

        let user = await interaction.guild.members.cache.get(interaction.member.user.id);
        if (!user?.voice.channel) {
            await Embeds.error(interaction, "You are not in a voice channel!");
            return;
        }

        let search = interaction.options.get("search", true);
        let metadata = await YouTubeAPI.search(search.value as string);
        if (!metadata) {
            await Embeds.error(interaction, `Could not find anything associated with \`${search.value}\``);
            return;
        }
        
        let connection = VoiceManager.getVoiceFromGuildId(interaction.guild.id);
        if (connection) {
            connection.play(metadata);
            Embeds.create()
                .setAuthor({ name: "Added to queue" })
                .setTitle(metadata.getTitle())
                .setURL(metadata.getUrl())
                .setDescription(`by ${metadata.getAuthor()}`)
                .setImage(metadata.getThumbnailUrl())
                .send(interaction);
            return;
        }

        connection = VoiceManager.initializeVoice(user.voice.channel);
        connection.play(metadata);

        await Embeds.create()
            .setAuthor({ name: "Now Playing"})
            .setTitle(metadata.getTitle())
            .setURL(metadata.getUrl())
            .setDescription(`by ${metadata.getAuthor()}`)
            .setImage(metadata.getThumbnailUrl())
            .send(interaction);
    },
}