const { Client, Collection, Intents, Discord } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });
//const bot = new Discord.Client();
require('dotenv').config();

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const token = process.env.BOT_TOKEN;
const BOT_ID = process.env.BOT_ID;
const TEST_GUILD_ID=process.env.BOT_TESTING_GUILD_ID;
bot.login(token);

const PREFIX = "!GM ";
const commandhandler = require("./commands")

const commands = new Collection() //Extends JS Map
const fs = require('fs');

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
		// set a new item in the Collection
		// with the key as the command name and the value as the exported module
    commands.set(command.data.name, command);
}

bot.once('ready', () => {
  console.log('This bot is online!');
  bot.user.setActivity('Aoe2: The Electric Boogaloo')
})

// bot.on('message', msg => {
//   if (msg.author.bot){
//     return;
//   }
//   commandhandler(msg);
// });



const rest = new REST({ version: '9' }).setToken(token);

// (async () => {
// 	try {
// 		console.log('Started refreshing application (/) commands.');

// 		await rest.put(
// 			//Routes.applicationGuildCommands(BOT_ID, TEST_GUILD_ID),
//       Routes.applicationCommands(BOT_ID), //for testing on multiple servers
// 			{ body: commands.toJSON() },
// 		);

// 		console.log('Successfully reloaded application (/) commands.');
// 	} catch (error) {
// 		console.error(error);
// 	}
// })();

bot.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (!commands.has(commandName)) return;
	try {
		await commands.get(commandName).execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

//TODO:
// Figure out how to use applications commands (line 50ish), something is weird