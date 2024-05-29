const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  aliases: ["stp", "pause", "s"],

  async execute(client, message, args, prefix) {

     const queue = client.distube.getQueue(message);
     if(!queue) return message.reply('❌ ** No hay canciones reproduciendose**')

    if (!message.member.voice?.channel) return message.reply('❌ ** tienes que estar en un canal de voz pete **');
    if (message.guild.members.me.voice?.channel && message.member.voice?.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('❌ ** tienes que estar en el mismo canal de voz que __YO__ ! pete **');
    client.distube.stop(message)
    message.reply('💤 **DESCONECTADO**')

  
  }
};
