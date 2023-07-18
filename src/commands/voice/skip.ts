import { SlashCommandBuilder } from "discord.js";
import { voiceManager } from "../../app";
import { Command } from "../../lib/command";

export const Skip: Command = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip to the next song in the queue."),
    execute: async (client, interaction) => {
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
        if (!connection || connection.queue.length === 0) {
            await interaction.followUp({ content: "There are no queued songs." });
            return;
        }

        let metadata = connection.skip();
        await interaction.followUp({ content: `**Skipped last song - Now playing:** ${metadata.getTitle()} - ${metadata.getAuthor()}` });
    },
}