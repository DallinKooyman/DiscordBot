const Discord = require('discord.js');
const bot = new Discord.Client();
require('dotenv').config();

const token = process.env.BOT_TOKEN;
bot.login(token);
const PREFIX = "!GM ";
const fs = require('fs');

bot.once('ready', () => {
  console.log('This bot is online!');
  bot.user.setActivity('Aoe2: The Electric Boogaloo')
})

bot.on('message', msg => {
  if (msg.content.toLowerCase() === "ping")
      if (msg.content === "ping") {
          msg.channel.send('pong');
      }
      else if (msg.content === "PING") {
          msg.channel.send('PONG');
      }
      else {
          msg.channel.send("pOnG")
      }
})

bot.on('message', msg => {
  if (msg.content.toLowerCase() === "hello there") {
      msg.channel.send('General Kenobi!\nYou are a bold one!');
  }
})