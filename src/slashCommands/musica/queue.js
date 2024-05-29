const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  CMD: new SlashCommandBuilder()
    .setName('list')
    .setDescription('queue songs'),
  name: "list",
  description: "queue song",

  async execute(client, message, args, prefix) {
    const queue = client.distube.getQueue(message);
    if (!queue) return message.reply('❌ ** No hay canciones reproduciéndose**');

    if (!message.member.voice?.channel) return message.reply('❌ ** Tienes que estar en un canal de voz **');
    if (message.guild.members.me.voice?.channel && message.member.voice?.channel.id !== message.guild.members.me.voice.channel.id) return message.reply('❌ ** Tienes que estar en el mismo canal de voz que yo **');

    // Lista de reproducción
    let playlist = [];
    var maxSongs = 10;

    // Mapeamos las canciones y las introducimos en el array
    for (let i = 0; i < queue.songs.length; i += maxSongs) {
      let songs = queue.songs.slice(i, i + maxSongs);
      playlist.push(songs.map((song, index) => `**\`${index + 1}\`** - [\`${song.name}\`](${song.url})`).join("\n"));
    }

    var limite = playlist.length;
    var embeds = [];

    // Hacemos un loop entre todas las canciones hasta el límite
    for (let i = 0; i < limite; i++) {
      let desc = String(playlist[i]).substring(0, 2048);
      let embed = new EmbedBuilder()
        .setTitle(`૱ **PLAYLIST** [ ${message.guild.name} ] - \` [ ${queue.songs.length} ${queue.songs.length > 1 ? "*SONGS*" : "canción" }] \``)
        .setColor("#51ED14")
        .setDescription(desc);

      if (queue.songs.length > 1) embed.addFields({ name: '[💿] - **NOW PLAYING**', value: `**[\`${queue.songs[0].name}\`](${queue.songs[0].url})**` });

      embeds.push(embed);
    }

    return paginacion();

    async function paginacion() {
      let pagAct = 0;

      if (embeds.length === 1) return message.channel.send({ embeds: [embeds[0]] }).catch(() => { });

      let boton_back = new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setCustomId('Atras')
        .setEmoji('🔚')
        .setLabel('Atras');

      let boton_inicio = new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId('Inicio')
        .setEmoji('૱')
        .setLabel('Inicio');

      let boton_avanzar = new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setCustomId('Avanzar')
        .setEmoji('⏭')
        .setLabel('Avanzar');

      let embedepages = await message.channel.send({
        content: `Puedes navegar aquí 🚀`,
        embeds: [embeds[0].setFooter({ text: `Pagina ${pagAct + 1} / ${embeds.length}` })],
        components: [new ActionRowBuilder().addComponents(boton_back, boton_inicio, boton_avanzar)]
      });

      const collector = embedepages.createMessageComponentCollector({ filter: i => i.isButton() && i.user.id == message.author.id && i.message.author.id == client.user.id, time: 180e3 });

      collector.on("collect", async b => {
        if (b.user.id !== message.author.id) return b.reply({ content: `❌ **Solo la persona que ha escrito \`${prefix}queue\` puede usar los botones o cambiar de páginas!**`, ephemeral: true });

        switch (b.customId) {
          case "Atras": {
            collector.resetTimer();
            if (pagAct !== 0) {
              pagAct -= 1;
              await embedepages.edit({ embeds: [embeds[pagAct].setFooter({ text: `Pagina ${pagAct + 1} / ${embeds.length}` })], components: [embedepages.components[0]] }).catch(() => { });
              await b.deferUpdate();
            } else {
              pagAct = embeds.length - 1;
              await embedepages.edit({ embeds: [embeds[pagAct].setFooter({ text: `Pagina ${pagAct + 1} / ${embeds.length}` })], components: [embedepages.components[0]] }).catch(() => { });
              await b.deferUpdate();
            }
            break;
          }
          case "Inicio": {
            collector.resetTimer();
            pagAct = 0;
            await embedepages.edit({ embeds: [embeds[pagAct].setFooter({ text: `Pagina ${pagAct + 1} / ${embeds.length}` })], components: [embedepages.components[0]] }).catch(() => { });
            await b.deferUpdate();
            break;
          }
          case "Avanzar": {
            collector.resetTimer();
            if (pagAct < embeds.length - 1) {
              pagAct++;
              await embedepages.edit({ embeds: [embeds[pagAct].setFooter({ text: `Pagina ${pagAct + 1} / ${embeds.length}` })], components: [embedepages.components[0]] }).catch(() => { });
              await b.deferUpdate();
            } else {
              pagAct = 0;
              await embedepages.edit({ embeds: [embeds[pagAct].setFooter({ text: `Pagina ${pagAct + 1} / ${embeds.length}` })], components: [embedepages.components[0]] }).catch(() => { });
              await b.deferUpdate();
            }
            break;
          }
          default:
            break;
        }
      });

      collector.on("end", () => {
        embedepages.components[0].components.map(boton => boton.setDisabled(true));
        embedepages.edit({
          content: `El tiempo ha expirado, escribe un nuevo ${prefix}queue para volver a ver la cola de reproducción.`,
          embeds: [embeds[pagAct].setFooter({ text: `Pagina ${pagAct + 1} / ${embeds.length}` })],
          components: [embedepages.components[0]]
        }).catch(() => { });
      });



    }
  }
};
