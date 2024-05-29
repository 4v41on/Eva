const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  CMD: new SlashCommandBuilder()
    .setName('play')
    .setDescription('darle play al bott'),
  name: "play",
  description: "Mira el ping del bot",

  async execute(client, message, args, prefix) {
    if (!args.length) return message.reply('❌ ** tienes que especificar el nombre de una cancion pete **');
    if (!message.member.voice?.channel) return message.reply('❌ ** tienes que estar en un canal de voz pete **');
    if (message.guild.members.me.voice?.channel && message.member.voice?.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('❌ ** tienes que estar en el mismo canal de voz que __YO__ ! pete **');

    client.distube.play(message.member.voice?.channel, args.join(' '), {
      member: message.member,
      textChannel: message.channel,
      message
    });

    message.reply(`[ 🔍 ] ** Buscando \`${args.join(" ")}\` ... **`);
  }
};
