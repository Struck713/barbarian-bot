import { EmbedBuilder } from "@discordjs/builders";
import { CacheType, Colors, CommandInteraction, Interaction } from "discord.js";

export namespace Embeds {

    export const DEFAULT = Colors.Yellow;
    export const ERROR = Colors.Red;

    export const create = () => {
        return new EmbedBuilder()
                .setColor(DEFAULT)
                .setTimestamp()
                .setFooter({ text: 'Barbarian v2', iconURL: 'https://cdn.discordapp.com/avatars/937850544255545394/5953a93c37c8de47f42058649c45e6ec?size=1024' });
    }

    export const send = async (interaction: CommandInteraction<CacheType>, callback: (embed: EmbedBuilder) => EmbedBuilder) => { 
        return await interaction.followUp({ embeds: [ callback(Embeds.create()) ] });
    }

    export const error = async (interaction: CommandInteraction<CacheType>, message: string, subtitle?: string) => { 
        return Embeds.send(interaction, embed => embed.setColor(ERROR).setAuthor({ name: `Error${subtitle ? ` - ${subtitle}` : ""}`}).setDescription(message));
    }
}