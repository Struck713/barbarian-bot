import { SlashCommandBuilder } from "discord.js";
import { Command } from "../../lib/command";
import { Embeds } from "../../utils/embeds";
import * as Style from "../../utils/style";
import Time from "../../utils/time";
import { Stats, statsManager } from "../../lib/stats";
import { Text } from "../../utils/misc";

export default <Command>{
    metadata: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Shows the voice stats'),
    execute: async (_, user, interaction) => {

        const timePlayed = statsManager.get(Stats.SECONDS_PLAYED);
        const songsPlayed = statsManager.get(Stats.SONGS_PLAYED);

        await Embeds.create()
            .setTitle("Stats")
            .setDescription("Here are some voice statistics:")
            .addFields(
                { name: "Total songs played", value: Text.number(songsPlayed, "song") },
                { name: "Total time played", value: Time.format(timePlayed, "seconds") }
            )
            .send(interaction);
    },
}