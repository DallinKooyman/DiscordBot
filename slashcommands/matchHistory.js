const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require('https')
const PATH = '/api/player/matches?game=aoe2de&';
var logger = require("../Logs/Log")
const Player = require("../Classes/Player")

function parseMatchData(matchInfo){
  var currentIndex = matchInfo.indexOf("match_id");
  var nextIndex = matchInfo.indexOf("match_id", currentIndex + 1);

  while (nextIndex != -1){
    currentIndex -= 1; //Gets the quotes by match_id
    nextIndex -= 4; // goes back past quotes and braces

    logger.log("Current index: " + currentIndex)
    logger.log("next index: " + nextIndex)

    var currentMatch = matchInfo.substring(currentIndex, nextIndex);

    logger.log("current match: " + currentIndex)


    let playerString = "[" + currentMatch.split("[")[1];

    logger.log("player string: " + playerString);

    //var players = JSON.parse(playerString)



    currentIndex = matchInfo.indexOf("match_id");
    nextIndex = matchInfo.indexOf("match_id", currentIndex + 1);
  }


}

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
  execute(interaction) {
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
          
          //logger.log(response)
          interaction.reply("logged");
        }
      });
    })

    req.on('error', error => {
      logger.error("Error in matchHistor.js during request. Error is:");
      logger.error(error);
      logger.error("Path: " + options.path);
    })

    req.end()
    reply = '[{"match_id":"113396234","lobby_id":null,"match_uuid":"30803d02-42d2-2c41-9148-6af5b4a39f9c","version":"51737","name":"AUTOMATCH","num_players":4,"num_slots":4,"average_rating":null,"cheats":false,"full_tech_tree":false,"ending_age":5,"expansion":null,"game_type":0,"has_custom_content":null,"has_password":true,"lock_speed":true,"lock_teams":true,"map_size":2,"map_type":9,"pop":200,"ranked":true,"leaderboard_id":4,"rating_type":4,"resources":1,"rms":null,"scenario":null,"server":"eastus","shared_exploration":false,"speed":2,"starting_age":2,"team_together":true,"team_positions":true,"treaty_length":0,"turbo":false,"victory":1,"victory_time":0,"visibility":0,"opened":1629946985,"started":1629946985,"finished":1629948179,"players":[{"profile_id":6092365,"steam_id":"76561199188130042","name":"WololoWhale","clan":null,"country":"US","slot":1,"slot_type":1,"rating":1616,"rating_change":17,"games":null,"wins":null,"streak":null,"drops":null,"color":2,"team":1,"civ":26,"civ_alpha":24,"won":true},{"profile_id":3213802,"steam_id":"76561199080335502","name":"[LAPM]Pulpo Cool","clan":null,"country":"PE","slot":2,"slot_type":1,"rating":1527,"rating_change":-17,"games":null,"wins":null,"streak":null,"drops":null,"color":3,"team":2,"civ":35,"civ_alpha":21,"won":false},{"profile_id":4876024,"steam_id":"76561199132731792","name":"Yogi_aoe","clan":null,"country":"US","slot":3,"slot_type":1,"rating":1569,"rating_change":17,"games":null,"wins":null,"streak":null,"drops":null,"color":6,"team":1,"civ":18,"civ_alpha":20,"won":true},{"profile_id":2919065,"steam_id":"76561198158323378","name":"LAPM: Sr. Roque","clan":null,"country":"PE","slot":4,"slot_type":1,"rating":1729,"rating_change":-17,"games":null,"wins":null,"streak":null,"drops":null,"color":1,"team":2,"civ":22,"civ_alpha":22,"won":false}]}]'
    let here = parseMatchData(reply);
  },
};


// (Unranked=0, 1v1 Deathmatch=1, Team Deathmatch=2, 1v1 Random Map=3, Team Random Map=4, 1v1 Empire Wars=13, Team Empire Wars=14)