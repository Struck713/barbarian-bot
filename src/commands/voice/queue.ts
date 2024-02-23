import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import * as VoiceManager from "../../lib/voice";
import { Command } from "../../lib/command";
import { Embeds } from "../../lib/utils/embeds";
import { Text } from "../../lib/utils/misc";
import Time from "../../lib/utils/time";

export const Queue: Command = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("View the current song queue."),
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
        if (!connection) {
            await Embeds.error(interaction, "I am not in a voice channel!");
            return;
        }

        let { playing, queue } = connection;
        if (playing) {

            let bar = Time.progress(15, connection.resource?.playbackDuration, playing.getDuration() * 1000);
            let embed = Embeds.create()
                .setAuthor({ name: 'Now Playing' })
                .setTitle(playing.getTitle())
                .setURL(playing.getUrl())
                .setDescription(`
                    by ${playing.getAuthor()} \n
                    ${bar} ${Time.format(connection.resource?.playbackDuration)}/${Time.format(playing.getDuration(), "seconds")}
                `)
                .setThumbnail(playing.getThumbnailUrl())
                .addFields({ name: '\u200B', value: `Next in the queue (${Text.number(queue.length, "song")}):` })
            
            if (queue.length > 0) embed.addFields(queue.slice(0, Math.min(9, queue.length)).map((metadata, index) => ({ name: `${index + 2}.  ${metadata.getTitle()}`, value: `by ${metadata.getAuthor()}` })));
            else embed.addFields({ name: 'There is nothing next in the queue.', value: '\u200B' })
            
            await embed.send(interaction);
            return;
        }

        await Embeds.error(interaction, "There is nothing currently in the queue.");
    },
}
