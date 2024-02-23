import { EmbedBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction, Message } from "discord.js";
import { Style } from "./style";

type SendEmbed = { send: (interaction: CommandInteraction<CacheType>) => Promise<Message<boolean>> };
type EmbedBuilderWithSend = EmbedBuilder & SendEmbed;

export namespace Embeds {

    export const create = (): EmbedBuilderWithSend => {
        let embed = new EmbedBuilder()
            .setColor(Style.Color.DEFAULT)
            .setTimestamp()
            .setFooter({ text: Style.ENGINE_VERSION, iconURL: Style.PROFILE_URL });
        return Object.assign(embed, { send: (interaction: CommandInteraction<CacheType>) => { return interaction.followUp({ embeds: [embed] }); } });
    }

    export const error = async (interaction: CommandInteraction<CacheType>, message: string, subtitle?: string) => {
        return Embeds.create().setColor(Style.Color.ERROR).setAuthor({ name: `Error${subtitle ? ` - ${subtitle}` : ""}` }).setDescription(message).send(interaction);
    }
}