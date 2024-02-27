import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Embeds } from "../../utils/embeds";
import YouTubeAPI from "../../utils/youtube";
import * as VoiceManager from "../../lib/voice";

export default <Command>{
    metadata: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song by search.")
        .addStringOption(option => option.setName("search").setRequired(true).setDescription("A valid YouTube search, picking the top result.")),
    execute: async (_, user, interaction) => {

        if (!interaction.guild) {
            await Embeds.error(interaction, "You are not in a guild!");
            return;
        }

        if (!user.voice.channel) {
            await Embeds.error(interaction, "You are not in a voice channel!");
            return;
        }

        let search = interaction.options.get("search", true);
        let metadata = await YouTubeAPI.search(search.value as string);
        if (!metadata) {
            await Embeds.error(interaction, `Could not find anything associated with \`${search.value}\``);
            return;
        }
        
        const user_id = user.id;
        let connection = VoiceManager.getVoiceFromGuildId(interaction.guild.id);
        if (connection) {
            connection.play(user_id, metadata);
            Embeds.create()
                .setAuthor({ name: "Added to queue" })
                .setTitle(metadata.title)
                .setURL(metadata.url)
                .setDescription(`by ${metadata.author}`)
                .setImage(metadata.thumbnail_url)
                .send(interaction);
            return;
        }

        connection = VoiceManager.initializeVoice(user.voice.channel);
        connection.play(user_id, metadata);

        await Embeds.create()
            .setAuthor({ name: "Now Playing"})
            .setTitle(metadata.title)
            .setURL(metadata.url)
            .setDescription(`by ${metadata.author}`)
            .setImage(metadata.thumbnail_url)
            .send(interaction);
    },
}