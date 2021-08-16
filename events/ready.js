module.exports = {
	name: 'ready',
	once: true,
	execute(bot) {
		console.log('This bot is online!');
		bot.user.setActivity('Aoe2: The Electric Boogaloo')
	},
};