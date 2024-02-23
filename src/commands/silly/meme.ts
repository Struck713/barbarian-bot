import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import axios from "axios";
import { Embeds } from "../../utils/embeds";

export default <Command>{
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Create a meme with top and bottom text.')
        .addStringOption(option => option.setName("top").setRequired(true).setDescription("The text on the top of the meme."))
        .addAttachmentOption(option => option.setName("image").setRequired(true).setDescription("The image to create a meme out of."))
        .addStringOption(option => option.setName("bottom").setRequired(false).setDescription("The text on the bottom of the meme.")),
    execute: async (client, interaction) => {
        let top = interaction.options.get("top", true);
        let bottom = interaction.options.get("bottom", false);
        let { attachment } = interaction.options.get("image", true);

        if (!attachment) {
            await Embeds.error(interaction, "You must provide an image to generate a meme.");
            return;
        }

        const res = await axios.post("https://api.memegen.link/images/custom", 
            {
                "background": attachment.url,
                "text": bottom ? [ top.value, bottom.value ] : [ top.value ],
                "extension": "png",
                "redirect": false
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        ).catch(_ => null);

        if (!res) {
            await Embeds.error(interaction, "Failed to generate meme. (This probably was the APIs fault, not yours.)");
            return;
        }

        interaction.editReply({ files: [ new AttachmentBuilder(res.data.url) ] });
    },
}