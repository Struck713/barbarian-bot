import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Embeds } from "../../utils/embeds";
import * as VoiceManager from "../../lib/voice";

export default <Command>{
    metadata: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip to the next song in the queue."),
    execute: async (_, user, interaction) => {
        if (!interaction.guild) {
            await Embeds.error(interaction, "You are not in a guild!");
            return;
        }

        if (!user.voice.channel) {
            await Embeds.error(interaction, "You are not in a voice channel!");
            return;
        }

        let connection = VoiceManager.getVoiceFromGuildId(interaction.guild.id);
        if (!connection || connection.queue.length === 0) {
            await Embeds.error(interaction, "There are no queued songs.");
            return;
        }

        let metadata = connection.skip();
        await Embeds.create()
            .setAuthor({ name: "Skipped - Now Playing"})
            .setTitle(metadata.getTitle())
            .setURL(metadata.getUrl())
            .setDescription(`by ${metadata.getAuthor()}`)
            .setImage(metadata.getThumbnailUrl())
            .send(interaction);
    },
}