const { Console } = require('console');
const { Client, Intents } = require('discord.js');
const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const output = "./Logs/output.log";
const erorrOutput = "./Logs/error.log"

const logger = new Console({ stdout: output, stderr: errorOutput });

require('dotenv').config();

const fs = require('fs');

const token = process.env.BOT_TOKEN;

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args, bot));
	} else {
		bot.on(event.name, (...args) => event.execute(...args, bot));
	}
}

bot.login(token);
