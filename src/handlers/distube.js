const {DisTube}  = require ('distube');
const ffmpegPath = require('ffmpeg-static')
const { EmbedBuilder,AttachmentBuilder } = require('discord.js');

const {SpotifyPlugin} = require ('@distube/spotify');
const {SoundCloudPlugin}= require ('@distube/soundcloud');

module.exports = (client, Discord) => {
console.log('📻 modulo de musica iniciado'.green)

    client.distube = new DisTube(client, {

        emitNewSongOnly:false,
        leaveOnEmpty: true,
        leaveOnFinish:true,
        leaveOnStop:true,
        savePreviousSongs:true,
        emitAddSongWhenCreatingQueue: false,
        searchSongs:0,
        nsfw:false,
        emptyCooldown:25,
        ytdlOptions:{
            higWhaterMark:1024 * 1024,
            quality:"highestaudio",
            format:"audioonly",
            liveBuffer: 60000,
            dlChunkSize:1024 * 1024 * 4,

        },

      ffmpegPath: ffmpegPath, // Esta es la línea importante

        plugins: [
          new SpotifyPlugin({
            parallel: true,
            emitEventsAfterFetching: true,
          }) ,
          new SoundCloudPlugin() 
        ]
    });


    const file = new AttachmentBuilder('./src/assets/crane.gif');
    // escuchamos eventos 

    client.distube.on("playSong", (queue, song) => {
      queue.textChannel.send({

        embeds: [new EmbedBuilder()
          .setTitle(`📻 [NowPlaying ]  -ϕϟ⨕ [\`${song.name}\`] - \`${song.formattedDuration}\` ⨀`)
          .setThumbnail(song.thumbnail)
          .setImage('attachment://alien.png')
          .setURL(song.url)
          .setColor("#51ED14")
          .setFooter({text: `Δ ADD 4 ${song.user.tag} nice song! `, iconURL: song.user.displayAvatarURL({dynamic: true})})
        ]

      })
    });

    // escuchamos eventos 

    client.distube.on("addSong", (queue, song) => {
      queue.textChannel.send({

        embeds: [new EmbedBuilder()
          .setTitle(`📀 [ADD]  -ϕϟ⨕ [\`${song.name}\`] - \`${song.formattedDuration}\` ⨀`)
          .setImage('attachment://alien.png')
          .setThumbnail(song.thumbnail)
          .setURL(song.url)
          .setColor("#51ED14")
          .setFooter({text: `Δ ADD 4 ${song.user.tag} nice song! `, iconURL: song.user.displayAvatarURL({dynamic: true})})
        ]

      })
    });
    

    client.distube.on("initQueue", (queue) => {
      queue.autoplay = true
  
    })
    
}