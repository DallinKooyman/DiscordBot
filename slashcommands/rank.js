const { SlashCommandBuilder } = require('@discordjs/builders');
const https = require('https')
const PATH = '/api/nightbot/rank?';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rank')
		.setDescription('Gets the rank of player using their name or steam id')
    .addStringOption(option =>
      option.setName("player_name")
        .setDescription('The name of the player whose rank you want. (Note: Gets highest rank player with that name)')
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
    ),
	async execute(interaction) {
    var leaderboard = 3; //Techinlly not needed as the api assumes its 3
    if (interaction.options.getInteger('leaderboard') != null){
      leaderboard = interaction.options.getInteger('leaderboard');
    }
    let leaderboardAsString = 'leaderboard_id=' + leaderboard.toString();
    let playername = 'search=' + interaction.options.getString('player_name')
    let flag = 'flag=' + interaction.options.getBoolean('flag');

    const options = {
      hostname: 'aoe2.net',
      port: 443,
      path: PATH + leaderboardAsString + '&' + playername + '&' + flag,
      method: 'GET'
    }

    var reply = '';

    const req = https.request(options, res => {
      //console.log(`statusCode: ${res.statusCode}`)
      res.on('data', chunk => {
        reply += chunk;
      })
      res.on('end', () => {
        console.log(reply);
        interaction.reply(reply);
      });
    })
    
    req.on('error', error => {
      console.error(error)
    })
    
    req.end()
	},
};


// (Unranked=0, 1v1 Deathmatch=1, Team Deathmatch=2, 1v1 Random Map=3, Team Random Map=4, 1v1 Empire Wars=13, Team Empire Wars=14)