module.exports = {
  name: 'eastereggreplies',
	description: 'These are the special replies to messages',
	execute (msg) {
    if (msg.content.toLowerCase() === "hello there") {
      msg.channel.send('General Kenobi!\nYou are a bold one!');
    }
    else if (msg.content === "ping") {
      msg.channel.send('pong');
    }
    else if (msg.content === "PING") {
      msg.channel.send('PONG');
    }
    else if (msg.content.toLowerCase() === "ping") {
      msg.channel.send("pOnG")
    }
	},
}
