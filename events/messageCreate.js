const commandhandler = require("../commandHandler")

module.exports = {
	name: 'messageCreate',
	async execute(msg) {
    commandhandler(msg);
	},
};