const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require('https')
const PATH = '/api/nightbot/rank?';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Gets the rank of player using their name or steam id')
    .addSubcommand(playername =>
      playername.setName('playername')
        .setDescription('The name of the player whose rank you want. (Note: Gets highest rank player with that name)')
        .addStringOption(option =>
          option.setName("player_name")
            .setDescription('The name of the player')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option.setName('leaderboard')
            .setDescription('Specify the match type, defaults to 1v1 random match type')
            .setRequired(false)
            .addChoice('1v1', 3)
            .addChoice('Team Random', 4)
            .addChoice('1v1 DeathMatch', 1)
            .addChoice('Team Deathmatch', 2)
            .addChoice('1v1 Empire Wars', 13)
            .addChoice('Team Empire Wars', 14)
        )
        .addBooleanOption(option => 
          option.setName('flag')
            .setDescription('Choose whether to display the players flag or not, default is Yes')
            .setRequired(false)
        )
    )
    //STEAM ID SUBCOMMAND
    .addSubcommand(steamid =>
      steamid.setName('steam_lookup')
        .setDescription('This allows you to use a steam id to get a specific player regardless of rank')
        .addStringOption(option =>
          option.setName("steam_id")
            .setDescription('The id of the player whose rank you want')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option.setName('leaderboard')
            .setDescription('Specify the match type, defaults to 1v1 random match type')
            .setRequired(false)
            .addChoice('1v1', 3)
            .addChoice('Team Random', 4)
            .addChoice('1v1 DeathMatch', 1)
            .addChoice('Team Deathmatch', 2)
            .addChoice('1v1 Empire Wars', 13)
            .addChoice('Team Empire Wars', 14)
        )
        .addBooleanOption(option => 
          option.setName('flag')
            .setDescription('Choose whether to display the players flag or not, default is True')
            .setRequired(false)
        ),
    ),
	async execute(interaction) {
    var leaderboard = 3;
    var flag = true;
    var options = {};
    var playeridentifer = ''; //could be steam id or player name

    if (interaction.options.getInteger('leaderboard') != null){
      leaderboard = interaction.options.getInteger('leaderboard');
    }

    var leaderboardAsString = 'leaderboard_id=' + leaderboard.toString();

    if (interaction.options.getBoolean('flag') != null){
      flag = interaction.options.getBoolean('flag');
    }
    var flagAsString = 'flag=' + flag.toString();

    if (interaction.options.getSubcommand() == 'playername'){
      playeridentifer = 'search=' + interaction.options.getString('player_name')
      options = {
        hostname: 'aoe2.net',
        port: 443,
        path: PATH + leaderboardAsString + '&' + playeridentifer + '&' + flagAsString,
        method: 'GET'
      }
    }
    else if (interaction.options.getSubcommand() == 'steam_lookup'){
      playeridentifer = 'steam_id=' + interaction.options.getString('steam_id')
      if (interaction.options.getString('steam_id').length != 17){
        interaction.reply("That is not a valid steam id")
        return;
      }
      options = {
        hostname: 'aoe2.net',
        port: 443,
        path: PATH + leaderboardAsString + '&' + playeridentifer + '&' + flagAsString,
        method: 'GET'
      }
    }

    var reply = '';

    console.log(options.path);
    const req = https.request(options, res => {
      //console.log(`statusCode: ${res.statusCode}`)
      res.on('data', chunk => {
        reply += chunk;
      })
      res.on('end', () => {
        console.log(reply);
        if (reply === "Player not found"){
          interaction.reply(reply + '\nPlayer must have played a match in that match type recently')
        }
        else {
          interaction.reply(reply);
        }
      });
    })
    
    req.on('error', error => {
      console.error(error)
    })
    
    req.end()
	},
};


// (Unranked=0, 1v1 Deathmatch=1, Team Deathmatch=2, 1v1 Random Map=3, Team Random Map=4, 1v1 Empire Wars=13, Team Empire Wars=14)