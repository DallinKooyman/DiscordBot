const { Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const fs = require('fs');

const slashcommands = new Collection()
const slashcommandsJSON = [];
const BOT_ID = process.env.BOT_ID;
const TEST_GUILD_ID = process.env.BOT_TESTING_GUILD_ID;
const token = process.env.BOT_TOKEN;

var logger = require("../Logs/Log")

const slashcommandFiles = fs.readdirSync('slashcommands/').filter(file => file.endsWith('.js'))
for (const file of slashcommandFiles) {
	const command = require(`../slashcommands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	slashcommands.set(command.data.name, command);
	slashcommandsJSON.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
	logger.log('Started refreshing application (/) commands.');

		await rest.put(
			//Routes.applicationGuildCommands(BOT_ID, TEST_GUILD_ID), //for testing on one server
			Routes.applicationCommands(BOT_ID), //for testing on multiple servers
			{ body: slashcommandsJSON },
		);

		logger.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		logger.error(error);
	}
})();

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		if (!interaction.isCommand()) return;
		const { commandName: slashcommandName } = interaction;
		if (!slashcommands.has(slashcommandName)) return;
		var logMsg = "";
		if (interaction.inGuild()){
			let guildInfo = "(Guild ID: " + interaction.guildId + ") " + interaction.guild.name + "'s "
			let playerInfo = interaction.member.nickname + " (ID: " + (interaction.member.id) + ") called ";
			logMsg = guildInfo + playerInfo;
		}
		else {
			logMsg = interaction.user.username + " (ID " + interaction.user.id + ") called ";
		}
		
		logger.log(logMsg + slashcommandName);
		try {
			await slashcommands.get(slashcommandName).execute(interaction);
		} catch (error) {
			logger.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	},
};