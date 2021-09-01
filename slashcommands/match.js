const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require('https')
const PATH = '/api/nightbot/match?';
var logger = require("../Logs/Log")

async function secondRequest(options, interaction) {
  options.path += '&leaderboard_id=4';
  var reply = "";
  const secondreq = https.request(options, res => {
    //console.log(`statusCode: ${res.statusCode}`)
    res.on('data', chunk => {
      reply += chunk;
    })
    res.on('end', () => {
      logger.log(reply);
      if (reply === "Player not found") {
        interaction.followUp(reply + '\nPlayer must be ranked recently')
        logger.log("Wasn't able to find player after checking different leaderboards");
      }
      else {
        interaction.followUp(reply);
      }
      logger.log("Path: " + options.path);
    });
  })

  secondreq.on('error', error => {
    logger.error("Error in match.js in second request Error is:");
    logger.error(error);
  })

  secondreq.end()
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('match')
    .setDescription('Gets the current or most recent match of the player')
    .addSubcommand(playername =>
      playername.setName('playername')
        .setDescription('The name of the player whose match you want. (Note: Gets highest rank player with that name)')
        .addStringOption(option =>
          option.setName("player_name")
            .setDescription('The name of the player')
            .setRequired(true)
        )
        .addBooleanOption(option =>
          option.setName('flag')
            .setDescription('Choose whether to display the players\' flag or not, default is True')
            .setRequired(false)
        )
        .addBooleanOption(option =>
          option.setName('color')
            .setDescription('Choose whether to display the players\' color or not, default is True')
            .setRequired(false)
        )
    )
    //STEAM ID SUBCOMMAND
    .addSubcommand(steamid =>
      steamid.setName('steam_lookup')
        .setDescription('This allows you to use a steam id to get a specific player regardless of rank')
        .addStringOption(option =>
          option.setName("steam_id")
            .setDescription('The id of the player whose match you want')
            .setRequired(true)
        )
        .addBooleanOption(option =>
          option.setName('flag')
            .setDescription('Choose whether to display the players\' flag or not, default is True')
            .setRequired(false)
        )
        .addBooleanOption(option =>
          option.setName('color')
            .setDescription('Choose whether to display the players\' color or not, default is True')
            .setRequired(false)
        ),
    ),
  async execute(interaction) {
    var flag = false;
    var color = true;
    var options = {};
    var playeridentifer = ''; //could be steam id or player name

    if (interaction.options.getBoolean('flag') != null) {
      flag = interaction.options.getBoolean('flag');
    }
    var flagAsString = 'flag=' + flag.toString();

    if (interaction.options.getBoolean('color') != null) {
      color = interaction.options.getBoolean('color');
    }
    var colorAsString = 'color=' + color.toString();

    if (interaction.options.getSubcommand() == 'playername') {
      if (interaction.options.getString('player_name').toLowerCase() === "yogi_aoe") {
        playeridentifer = 'steam_id=' + "76561199132731792";
      }
      else {
        playeridentifer = 'search=' + interaction.options.getString('player_name')
      }
    }
    else if (interaction.options.getSubcommand() == 'steam_lookup') {
      playeridentifer = 'steam_id=' + interaction.options.getString('steam_id')
      if (interaction.options.getString('steam_id').length != 17) {
        interaction.reply("That is not a valid steam id")
        return;
      }
    }

    options = {
      hostname: 'aoe2.net',
      port: 443,
      path: PATH + playeridentifer + '&' + flagAsString + '&' + colorAsString,
      method: 'GET'
    }

    var reply = '';

    const req = https.request(options, res => {
      res.on('data', chunk => {
        reply += chunk;
      })
      res.on('end', () => {
        if (reply === "Player not found") {
          interaction.reply(reply + '\nChecking other leaderboards')
          secondRequest(options, interaction)
        }
        else {
          logger.log("Path: " + options.path);
          interaction.reply(reply);
        }
      });
    })

    req.on('error', error => {
      logger.error("Error in match.js during first request. Error is:");
      logger.error(error);
      logger.error("Path: " + options.path);
    })

    req.end()
  },
};
