
const User = require('../../modelos/server.js');


module.exports = async (client, message) => {
    if (!message.guild || !message.channel || message.author.bot) return;
    if (!message.content.startsWith(process.env.PREFIX)) return;

    const ARGS = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
    const CMD = ARGS.shift().toLowerCase();

    const COMANDO = client.commands.get(CMD) || client.commands.find(c => c.aliases && c.aliases.includes(CMD));

    if (COMANDO) {
        if (COMANDO.ownerOnly && !process.env.OWNER_IDS.split(" ").includes(message.author.id)) {
            return message.reply(`❌ **Solo los dueños de este bot pueden ejecutar este comando!**\n**Dueños del bot:** ${process.env.OWNER_IDS.split(" ").map(OWNER_ID => `<@${OWNER_ID}>`)}`);
        }

        if (COMANDO.botPermissions && !message.guild.members.me.permissions.has(COMANDO.botPermissions)) {
            return message.reply(`❌ **No tengo suficientes permisos para ejecutar este comando!**\nNecesito los siguientes permisos: ${COMANDO.botPermissions.map(permiso => `\`${permiso}\``).join(", ")}`);
        }

        if (COMANDO.userPermissions && !message.member.permissions.has(COMANDO.userPermissions)) {
            return message.reply(`❌ **No tienes suficientes permisos para ejecutar este comando!**\nNecesitas los siguientes permisos: ${COMANDO.userPermissions.map(permiso => `\`${permiso}\``).join(", ")}`);
        }

        try {
                // Ejemplo de uso de la base de datos
                let user = await User.findOne({ userId: message.author.id });
                if (!user) {
                    user = new User({ userId: message.author.id, username: message.author.username });
                    await user.save();
                }
            // Ejecutar el comando
            COMANDO.execute(client, message, ARGS, process.env.PREFIX);
        } catch (e) {
            message.reply(`**Ha ocurrido un error al ejecutar el comando \`${COMANDO.name}\`**\n*Mira la consola para más detalle.*`);
            console.log(e);
            return;
        }
    }
};
