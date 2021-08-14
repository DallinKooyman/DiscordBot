const Discord = require('discord.js');
const bot = new Discord.Client();
require('dotenv').config();

const token = process.env.BOT_TOKEN;
bot.login(token);

const PREFIX = "!GM ";
const commandhandler = require("./commands")

bot.on('message', msg => {
  if (msg.author.bot){
    return;
  }
  commandhandler(msg);
});

bot.once('ready', () => {
  console.log('This bot is online!');
  bot.user.setActivity('Aoe2: The Electric Boogaloo')
})