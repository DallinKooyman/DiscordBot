const Discord = require('discord.js')
const { Collection, Intents, } = require('discord.js');
const bot = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
//const bot = new Discord.Client();
require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');

const token = process.env.BOT_TOKEN;
const BOT_ID = process.env.BOT_ID;
const TEST_GUILD_ID=process.env.BOT_TESTING_GUILD_ID;
bot.login(token);

const PREFIX = "!GM ";
const commandhandler = require("./commands")

const slashcommands = new Collection() 
const slashcommandsJSON = [];

const slashcommandFiles = fs.readdirSync('./slashcommands/').filter(file => file.endsWith('.js'))
for (const file of slashcommandFiles) {
    const command = require(`./slashcommands/${file}`);
		// set a new item in the Collection
		// with the key as the command name and the value as the exported module
    slashcommands.set(command.data.name, command);
		slashcommandsJSON.push(command.data.toJSON());
}



bot.once('ready', () => {
  console.log('This bot is online!');
  bot.user.setActivity('Aoe2: The Electric Boogaloo')
})

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			//Routes.applicationGuildCommands(BOT_ID, TEST_GUILD_ID),
      Routes.applicationCommands(BOT_ID), //for testing on multiple servers
			{ body: slashcommandsJSON },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

bot.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName: slashcommandName } = interaction;

	if (!slashcommands.has(slashcommandName)) return;
	try {
		await slashcommands.get(slashcommandName).execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

bot.on('messageCreate', commandhandler);

