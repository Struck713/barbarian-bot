import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Embeds } from "../../utils/embeds";
import * as VoiceManager from "../../lib/voice";

export default <Command>{
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Disconnect from voice and clear the queue."),
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

        let connection = VoiceManager.getVoiceFromGuildId(interaction.guild.id);
        if (connection) {
            connection.disconnect();
            await Embeds.create()
                .setAuthor({ name: "Disconnected" })
                .setDescription("Disconnected from voice and cleared the queue.")
                .send(interaction);
            return;
        }

        await Embeds.error(interaction, "I am not in a voice channel!");
    },
}