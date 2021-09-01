var logger = require("../Logs/Log")
module.exports = {
	name: 'ready',
	once: true,
	execute(bot) {
		logger.log('This bot is online!');
		bot.user.setActivity('Aoe2: The Electric Boogaloo')
	},
};