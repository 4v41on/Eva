const { AttachmentBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    aliases: ["reload"],
    desc: "Sirve para recargar comandos, eventos y handlers",
    owner: true,

    async execute(client, message, args, prefix) {
        let opcion = "Comandos, Eventos y Handlers";
        const file = new AttachmentBuilder('./src/assets/crane.gif');

        try {
            switch (args[0]?.toLowerCase()) {
                case "commands":
                case "comandos":
                    opcion = "Comandos";
                    await client.loadCommands();
                    break;

                case "slashcommands":
                case "slash":
                    opcion = "Comandos Diagonales";
                    await client.loadSlashCommands();
                    break;

                case "handlers":
                    opcion = "Handlers";
                    await client.loadHandlers();
                    break;

                case "events":
                case "eventos":
                    opcion = "Eventos";
                    await client.loadEvents();
                    break;

                default:
                    await client.loadHandlers();
                    await client.loadEvents();
                    await client.loadSlashCommands();
                    await client.loadCommands();
                    break;
            }

            const embed = new EmbedBuilder()
                .setTitle('⨏ RELOAD SSSUCCES')
                .addFields({ name: `${opcion} *Recargados¨*`, value: ` *OK!*` })
                .setColor(process.env.COLOR || '#00FF00')
                .setImage('attachment://alien.png');

            message.reply({ embeds: [embed], files: [file] });

        } catch (e) {
            message.reply({ content: `**Ha ocurrido un error al recargar los archivos**\n*Mira la consola para más detalle*` });
            console.log(e);
        }
    },
};
