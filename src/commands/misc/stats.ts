import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Embeds } from "../../utils/embeds";
import Time from "../../utils/time";
import { Text } from "../../utils/misc";
import { VoiceTable, db } from "../../lib/database";
import { sql } from "kysely";
import youtube from "../../utils/youtube";

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
            const count = await db.selectFrom("voice")
                .select(({ fn, val, ref }) => [
                    fn.countAll<number>().as("counted")
                ])
                .execute()
                .then(all => all[0].counted)
                .catch(_ => null);

            const recent = await sql<VoiceTable>`SELECT v1.id, v1.video_name, v1.video_url, v1.created
                                                    FROM ${sql.table("voice")} v1 INNER JOIN 
                                                    (
                                                        SELECT MAX(v2.created) as latest, v2.id
                                                            FROM ${sql.table("voice")} v2
                                                            GROUP BY v2.id
                                                    ) derived 
                                                    ON v1.created = derived.latest 
                                                    AND v1.id = derived.id;`
                .execute(db)
                .then(all => all.rows[0])
                .catch(_ => null);

            if (!count || !recent) {
                await Embeds.error(interaction, "Failed to retreive song data!");
                return;
            }

            await Embeds.create()
                .setTitle("Voice Statistics")
                .setAuthor({ name: `${count} songs have been played.` })
                .addFields([
                    { name: "Recent song", value: `${recent.video_name}`, inline: true },
                    { name: "URL", value: `${recent.video_url}`, inline: true }
                ])
                .setImage(youtube.getThumbnailUrl(recent.video_url))
                .send(interaction);
            return;
        }

        await Embeds.error(interaction, `Stats for \`${type}\` are not implemented yet.`);
    },
}