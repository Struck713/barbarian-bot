import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import axios from "axios";
import { Embeds } from "../../utils/embeds";
import { db } from "../../lib/database";

const assortValues = (top: string | null, bottom: string | null) => {
    if (top && bottom) return [top, bottom];
    if (bottom) return [bottom];
    if (top) return [top];
    return [];
}


export default <Command>{
    metadata: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Create a meme with top and bottom text.')
        .addAttachmentOption(option => option.setName("image").setRequired(true).setDescription("The image to create a meme out of."))
        .addStringOption(option => option.setName("top").setRequired(false).setDescription("The text on the top of the meme."))
        .addStringOption(option => option.setName("bottom").setRequired(false).setDescription("The text on the bottom of the meme.")),
    execute: async (_, user, interaction) => {

        if (!interaction.guild) {
            await Embeds.error(interaction, "You are not in a guild!");
            return;
        }

        let top = interaction.options.getString("top", false);
        let bottom = interaction.options.getString("bottom", false);
        let { attachment } = interaction.options.get("image", true);

        if (!attachment) {
            await Embeds.error(interaction, "You must provide an image to generate a meme.");
            return;
        }

        const list = assortValues(top, bottom);
        if (!list) {
            await Embeds.error(interaction, "You must provide at least one of the top or bottom text.");
            return;
        }

        // generate meme 
        const res = await axios.post("https://api.memegen.link/images/custom",
            {
                "background": attachment.url,
                "text": list,
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
        
        // get the returned URL
        const url = res.data.url;
        await db.insertInto("memes")
            .values({
                user_id: user.id,
                guild_id: interaction.guild.id,
                top: top ?? "",
                bottom: bottom ?? "",
                image_url: url
            }).execute();
        
        // get the actual image 
        const meme = await axios.get(url, { responseType: "arraybuffer" }).then(res => Buffer.from(res.data, 'binary'))
        interaction.editReply({ files: [ new AttachmentBuilder(meme) ] });
    },
}