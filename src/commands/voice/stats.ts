import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Embeds } from "../../utils/embeds";
import Time from "../../utils/time";
import { Text } from "../../utils/misc";
import { db } from "../../lib/database";

export default <Command>{
    metadata: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Shows the stats for a specific type')
        .addStringOption(option => option.setName('type')
            .addChoices(...[ { name: "voice", value: "voice" }, { name: "meme", value: "meme" } ])
            .setRequired(true)
            .setDescription('The type of stats to show')),
    execute: async (_, user, interaction) => {

        const type = interaction.options.getString("type", true);

        if (type === "voice") {
            const all = await db.selectFrom("voice")
                .selectAll()
                .execute();

            await Embeds.create()
                .setTitle("Voice Statistics")
                .setAuthor({ name: `${all.length} songs have been played.` })
                .setDescription(`
                    \`\`\`JSON
                    ${JSON.stringify(all, null, 2)}
                    \`\`\`
                `.trim())
                .send(interaction);
            return;
        }

        await Embeds.error(interaction, `Stats for \`${type}\` are not implemented yet.`);
    },
}