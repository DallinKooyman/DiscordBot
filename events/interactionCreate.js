const { Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const slashcommands = new Collection() 
const slashcommandsJSON = [];
const BOT_ID = process.env.BOT_ID;
const TEST_GUILD_ID=process.env.BOT_TESTING_GUILD_ID;
const token = process.env.BOT_TOKEN;

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
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(BOT_ID, TEST_GUILD_ID), //for testing on one server
      //Routes.applicationCommands(BOT_ID), //for testing on multiple servers
			{ body: slashcommandsJSON },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
    if (!interaction.isCommand()) return;
  
    const { commandName: slashcommandName } = interaction;

    if (!slashcommands.has(slashcommandName)) return;
    try {
      await slashcommands.get(slashcommandName).execute(interaction);

    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
	},
};