import { SlashCommandBuilder } from "discord.js";
import { Command } from "../lib/command";
import { Embeds } from "../lib/utils/embeds";

export const Minecraft: Command = {
    data: new SlashCommandBuilder()
        .setName('minecraft')
        .setDescription('Gets the status of a Minecraft server')
        .addStringOption(option => option.setName("address").setRequired(true).setDescription("The address of the server"))
        .addIntegerOption(option => option.setName("port").setDescription("The port of the server")),
    execute: async (client, interaction) => {
        let address = interaction.options.getString("address", true);
        let port = interaction.options.getNumber("port", false) ?? 25565;

        let status = await MinecraftServer.ping(address, port).catch(_ => null);
        if (status) {
            let embed = Embeds.create()
                .setAuthor({ name: 'Minecraft Server Status' })
                .setTitle(`${address}${port == 25565 ? "" : `:${port}`}`)
                .setDescription(status.description.text)
                .addFields({ name: 'Players', value: `${status.players.online}/${status.players.max}` });
            if (status.favicon) embed.setThumbnail(status.favicon);
            await Embeds.send(interaction, () => embed);
            return;
        }

        await Embeds.send(interaction, embed => embed
            .setTitle(`${address}${port == 25565 ? "" : `:${port}`}`)
            .setDescription(`Server did not respond to ping. :sad:`));
            // let embed = Embeds.create()
            //     .setAuthor({ name: 'Now Playing' })
            //     .setTitle(playing.getTitle())
            //     .setURL(playing.getUrl())
            //     .setDescription(`
            //         by ${playing.getAuthor()} \n
            //         ${bar} ${Time.format(connection.resource?.playbackDuration)}/${Time.format(playing.getDuration(), "seconds")}
            //     `)
            //     .setThumbnail(playing.getThumbnailUrl())
            //     .addFields({ name: '\u200B', value: `Next in the queue (${Text.number(queue.length, "song")}):` })
    },
}