import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { voiceManager } from "../../app";
import { Command } from "../../lib/command";
import { Embeds } from "../../lib/utils/embeds";
import { Time } from "../../lib/utils/misc";

export const Queue: Command = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("View the current song queue."),
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
                .addFields({ name: '\u200B', value: 'Next in the queue:' })
            
            if (queue.length > 0) embed.addFields(queue.slice(0, Math.min(8, queue.length)).map((metadata, index) => ({ name: `${index + 2}.  ${metadata.getTitle()}`, value: `by ${metadata.getAuthor()}` })));
            else embed.addFields({ name: 'There is nothing next in the queue.', value: '\u200B' })
            
            await Embeds.send(interaction, () => embed);
            return;
        }

        await Embeds.error(interaction, "There is nothing currently in the queue.");
    },
}