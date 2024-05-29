module.exports = {

    aliases: ["lag"],
    desc: "Sirve para ver ping",
    execute(client, message, args, prefix, GUILD_DATA){
        return message.reply(`PONG!🏓 \`${client.ws.ping}ms\``);
    }
}