const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require('https')
const PATH = '/api/player/matches?game=aoe2de&';
var logger = require("../Logs/Log")

module.exports = {
  data: new SlashCommandBuilder()
    .setName('match_history')
    .setDescription('Gets the match historu of player using their name or steam id')
    .addStringOption(option =>
      option.setName('steam_id')
          .setDescription('The id of the player whose match history you want')
          .setRequired(true)
      )
    .addIntegerOption(option =>
      option.setName('total_matches')
        .setDescription('The number of matches to get, max 100')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('start_match')
        .setDescription('How many matches ago should history start, i.e. 0 is most recent, 5 is 5 matches ago, default is 0')
        .setRequired(false)
    ),
  async execute(interaction) {
    var startMatch = 0;
    var options = {};


    if (interaction.options.getString('steam_id').length != 17) {
      interaction.reply("That is not a valid steam id");
      logger.log("Invalid steam id:" + interaction.options.getString('steam_id'));
      return;
    }
    var idAsString = "steam_id=" + interaction.options.getString('steam_id');

    if (interaction.options.getInteger('start_match') != null) {
      startMatch = interaction.options.getInteger('start_match');
    }

    var startMatchAsString = "start=" + startMatch.toString();

    var totalMatchesAsString = "count=" + interaction.options.getInteger('total_matches').toString();

    options = {
      hostname: 'aoe2.net',
      port: 443,
      path: PATH + idAsString + '&' + startMatchAsString + '&' + totalMatchesAsString,
      method: 'GET'
    }

    logger.log(options.path);

    var reply = '';

    const req = https.request(options, res => {
      res.on('data', chunk => {
        reply += chunk;
      })
      res.on('end', () => {
        if (reply === "Player not found") {
          logger.log("Player wasn't found with path: " + options.path);
        }
        else {
          logger.log("Path: " + options.path);
          interaction.reply(reply);
        }
      });
    })

    req.on('error', error => {
      logger.error("Error in matchHistor.js during request. Error is:");
      logger.error(error);
      logger.error("Path: " + options.path);
    })

    req.end()
  },
};


// (Unranked=0, 1v1 Deathmatch=1, Team Deathmatch=2, 1v1 Random Map=3, Team Random Map=4, 1v1 Empire Wars=13, Team Empire Wars=14)