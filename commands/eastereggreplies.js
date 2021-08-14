const { SlashCommandBuilder } = require('@discordjs/builders');

// module.exports = {
//   data: new SlashCommandBuilder()
// 		.setName('eastereggreplies')
// 		.setDescription('Replies with Pong!'),
// 	async execute(interaction) {
//     if (interaction.content.toLowerCase() === "hello there") {
//       await interaction.channel.send('General Kenobi!\nYou are a bold one!');
//     }
//     else if (interaction.content === "ping") {
//       await interaction.channel.send('pong');
//     }
//     else if (interaction.content === "PING") {
//       await interaction.channel.send('PONG');
//     }
//     else if (interaction.content.toLowerCase() === "ping") {
//       await interaction.channel.send("pOnG")
//     }
// 	},
// }
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};