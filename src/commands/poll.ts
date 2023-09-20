import { Events, SlashCommandBuilder } from "discord.js";
import { Command } from "../lib/command";
import { Pair, Text } from "../lib/utils/misc";
import { client, pollManager } from "../app";
import { Embeds } from "../lib/utils/embeds";

export class PollManager {

    private polls: Map<string, Pair<string, number>[]>;

    constructor() {
        this.polls = new Map();

        client.addListener(Events.MessageReactionAdd, async (reaction, user) => {
            console.log(reaction, user);
        });
        client.addListener(Events.MessageReactionRemove, async (reaction, user) => {
            console.log(reaction, user);
        });
    }

    public create = (name: string, options: string[]) => this.polls.set(name, options.map(option => ({ key: option, value: 0 })));
    public get = (name: string) => this.polls.get(name);

}

// weirdly declare subcommands first
export const Poll: Command = {
    data: new SlashCommandBuilder()
        .addSubcommand(subcommand => 
            subcommand.setName('create')
                      .addStringOption(option => option.setName('name').setDescription('The name of the poll.').setRequired(true))
                      .setDescription('Create a poll with up to 4 options.'))
        .addSubcommand(subcommand =>
            subcommand.setName('add')
                      .setDescription('Add an option to a poll.')
                      .addStringOption(option => option.setName('name').setDescription('The name of the poll.').setRequired(true))
                      .addStringOption(option => option.setName('option').setDescription('The option to add.').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand.setName('show')
                    .addStringOption(option => option.setName('name').setDescription('The name of the poll.').setRequired(true))
                    .setDescription('Display the poll in chat.'))
        .setName('poll')
        .setDescription('Manage or display a poll.'),
    execute: async (client, interaction) => {
        let { value: name } = interaction.options.get("name", true);
        let poll = pollManager.get(name as string);
        let subcommand = interaction.options.getSubcommand();

        if (subcommand === "create") {
            if (poll) {
                await Embeds.error(interaction, `A poll with the name \`${name}\` already exists!`);
                return;
            }

            pollManager.create(name as string, []);
            await Embeds.send(interaction, embed => embed
                .setAuthor({ name: "Poll" })
                .setTitle(name as string)
                .setDescription("Poll has been created."));
            return;
        }

        if (subcommand === "add") {
            if (!poll) {
                await Embeds.error(interaction, `The poll named \`${name}\` does not exist!`);
                return;
            }

            if (poll.length >= 4) {
                await Embeds.error(interaction, `You cannot add anymore options to \`${name}\`!`);
                return;
            }

            let { value: option } = interaction.options.get("option", true);
            poll.push({ key: option as string, value: 0 });
            await Embeds.send(interaction, embed => embed
                .setAuthor({ name: "Poll" })
                .setTitle(name as string)
                .setDescription(`Added option, \`${option}\`.`));
            return;
        }

        if (subcommand === "show") {
            if (!poll) {
                await Embeds.error(interaction, `The poll named \`${name}\` does not exist!`);
                return;
            }

            let fields = poll.map((pair, index) => ({ name: `${Text.NUMBERS[index + 1]} ${pair.key}`, value: Text.number(pair.value, "vote") }));
            let message = await Embeds.send(interaction, embed => embed
                .setAuthor({ name: "Poll" })
                .setTitle(name as string)
                .addFields(fields));
            await Promise.all(poll.map((_, index) => message.react(Text.NUMBERS[index + 1])));
            return;
        }

    },
}