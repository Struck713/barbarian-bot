// import { REST, Routes, SlashCommandBuilder } from "discord.js";
// import { Command } from "../../lib/command";
// import { Embeds } from "../../utils/embeds";
// import commands from "..";

// import { token, development } from '../../../config.json';
// import { Role } from "../../lib/roles";

// const MY_SNOWFLAKE = "140520164629151744";

// export default <Command>{
//     metadata: new SlashCommandBuilder()
//         .setName('deploy')
//         .setDescription('Deploys slash commands for the bot.'),
//     role: Role.ADMINISTRATOR,
//     execute: async (_, user, interaction) => {

//         let response = JSON.stringify(await deploy(), null, 2);
//         if (response.length > 2000) response = response.substring(0, 2000) + "...";

//         await Embeds.create()
//             .setTitle("Deployed commands")
//             .setAuthor({ name: `${commands.length} commands have been deployed.` })
//             .setDescription(`
//                 \`\`\`JSON
//                 ${response}
//                 \`\`\`
//             `)
//             .send(interaction);
//     },
// }