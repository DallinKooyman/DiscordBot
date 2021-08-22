const { Collection, Discord } = require('discord.js');
const fs = require('fs');
const PREFIX = "!GM ";

const commands = new Collection() //Extends JS Map
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  commands.set(command.name, command);
}
module.exports = function (msg) {
  if (msg.content.includes(PREFIX)) {
    let args = msg.content.slice(PREFIX.length).split(' ');
    commands.get(args[0].toLowerCase()).execute(msg, args);
  }
  else {
    commands.get("eastereggreplies").execute(msg);
  }
}