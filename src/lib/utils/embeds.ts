import { EmbedBuilder } from "@discordjs/builders";
import { CacheType, Colors, CommandInteraction, Interaction } from "discord.js";
import { Style } from "./style";

export namespace Embeds {

    export const DEFAULT = Colors.Yellow;
    export const ERROR = Colors.Red;

    export const create = () => {
        return new EmbedBuilder()
                .setColor(DEFAULT)
                .setTimestamp()
                .setFooter({ text: Style.ENGINE_VERSION, iconURL: Style.PROFILE_URL });
    }

    export const send = async (interaction: CommandInteraction<CacheType>, callback: (embed: EmbedBuilder) => EmbedBuilder) => { 
        return await interaction.followUp({ embeds: [ callback(Embeds.create()) ] });
    }

    export const error = async (interaction: CommandInteraction<CacheType>, message: string, subtitle?: string) => { 
        return Embeds.send(interaction, embed => embed.setColor(ERROR).setAuthor({ name: `Error${subtitle ? ` - ${subtitle}` : ""}`}).setDescription(message));
    }
}