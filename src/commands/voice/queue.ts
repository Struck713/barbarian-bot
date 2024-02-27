import { Colors, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import * as VoiceManager from "../../lib/voice";
import { Command } from "../../lib/command";
import { Embeds } from "../../utils/embeds";
import { Text } from "../../utils/misc";
import Time from "../../utils/time";

export default <Command>{
    metadata: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("View the current song queue."),
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
        if (!connection) {
            await Embeds.error(interaction, "I am not in a voice channel!");
            return;
        }

        let { playing, queue } = connection;
        if (playing) {

            let bar = Time.progress(15, connection.resource?.playbackDuration, playing.duration * 1000);
            let embed = Embeds.create()
                .setAuthor({ name: 'Now Playing' })
                .setTitle(playing.title)
                .setURL(playing.url)
                .setDescription(`
                    by ${playing.author} \n
                    ${bar} ${Time.format(connection.resource?.playbackDuration)}/${Time.format(playing.duration, "seconds")}
                `)
                .setThumbnail(playing.thumbnail_url)
                .addFields({ name: '\u200B', value: `Next in the queue (${Text.number(queue.length, "song")}):` })
            
            if (queue.length > 0) 
                embed.addFields(queue.slice(0, Math.min(9, queue.length))
                     .map((metadata, index) => ({ 
                        name: `${index + 2}.  ${metadata.title}`, 
                        value: `by ${metadata.author}` 
                     })));
            else embed.addFields({ name: 'There is nothing next in the queue.', value: '\u200B' })
            
            await embed.send(interaction);
            return;
        }

        await Embeds.error(interaction, "There is nothing currently in the queue.");
    },
}
