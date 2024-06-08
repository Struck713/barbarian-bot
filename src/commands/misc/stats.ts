import { SlashCommandBuilder } from "discord.js";
import { sql } from "kysely";
import moment from "moment";
import { Command } from "../../lib/command";
import { db } from "../../lib/database";
import { Embeds } from "../../utils/embeds";
import { Text } from "../../utils/misc";

interface VoiceTrendData {
    count: number;
    date: string;
}

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
            const recent = await db.selectFrom("voice")
                .selectAll()
                .orderBy("created desc")
                .limit(1)
                .execute()
                .then(rows => rows[0])
                .catch(_ => null);

            const data = await db.selectFrom("voice")
                .select(({ fn }) => [
                    fn.countAll().as("count"),
                    sql<string>`DATE(created)`.as("date")
                ])
                .groupBy("date")
                .orderBy("date desc")
                .limit(15)
                .execute()
                .then(data => data.map((row: any) => 
                    <VoiceTrendData>{ 
                        count: row.count, 
                        date: moment(row.date).format(Text.DATE_FORMAT_NO_YEAR)
                    }))
                .catch(_ => null);

            if (!data || !recent) {
                await Embeds.error(interaction, "Failed to voice statistic data!");
                return;
            }

            const labels = data.map(row => row.date);
            const counts = data.map(row => row.count);
            const chart = JSON.stringify({
                type: 'line',
                data: {
                  labels,
                  datasets: [
                    {
                      label: 'Recent songs played',
                      data: counts,
                    },
                  ],
                },
            });

            const peak = data.reduce((prev, curr) => prev.count >= curr.count ? prev : curr);
            const playedRecently = counts.reduce((prev, curr) => prev + curr);
            const playedToday = counts[0];

            await Embeds.create()
                .setTitle("Voice Statistics")
                .setAuthor({ name: `${Text.number(playedRecently, "song")} have been played recently.` })
                .addFields([
                    { name: "Most recent song", value: recent.video_name, inline: false },
                    { name: "Songs played today", value: Text.number(playedToday, "song"), inline: true },
                    { name: "Songs played at peak", value: `${Text.number(peak.count, "song")} on **${peak.date}**`, inline: true },
                ])
                .setImage(`https://quickchart.io/chart?c=${encodeURIComponent(chart)}&backgroundColor=white`)
                .send(interaction);
            return;
        }

        await Embeds.error(interaction, `Stats for \`${type}\` are not implemented yet.`);
    },
}