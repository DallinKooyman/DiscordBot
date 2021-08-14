const Discord = require('discord.js');
const allCommands = new Discord.Collection(); //Extends JS Map
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))
for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    allCommands.set(file, command);
}

module.exports = async function (msg) {
  allCommands.get("eastereggreplies.js")(msg);
}