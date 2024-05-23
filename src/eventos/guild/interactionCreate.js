module.exports = async (client, interaction) => {
    if (!interaction.guild || !interaction.channel) return;

    const COMANDO = client.slashCommands.get(interaction?.commandName);



    if (COMANDO) {
        if (COMANDO.OWNER) {

            const DUEÑOS = process.env.OWNER_IDS.split(' ');
            if (COMANDO.OWNER) {
                if (!DUEÑOS.includes(interaction.user.id)) {
                    return interaction.reply({
                        content: `❌ **Solo los dueños del bot pueden ejecutar este comando**\nDUEÑOS del bot: ${DUEÑOS.map(DUEÑO => `<@${DUEÑO}>`).join(", ")}`,
                        ephemeral: true
                    });
                }
            }
            
        }

        if (COMANDO.BOT_PERMISSIONS) {
            if (!interaction.guild.members.me.permissions.has(COMANDO.BOT_PERMISSIONS)) {
                return interaction.reply({ content: `❌ **No tengo suficientes permisos para ejecutar este comando!**\nNecesito los siguientes permisos: ${COMANDO.BOT_PERMISSIONS.map(PERMISO => `<@${PERMISO}>`) .join(", ")}`, ephemeral: true });
            }
        }

        if (COMANDO.PERMISSIONS) {
            if (!interaction.member.permissions.has(COMANDO.PERMISSIONS)) {
                return interaction.reply({ content: `❌ **No tienes suficientes permisos para ejecutar este comando!**\nNecesitas los siguientes permisos: ${COMANDO.PERMISSIONS.map(PERMISO => `<@${PERMISO}>`) .join(", ")}`, ephemeral: true });
            }
        }

        try {
            // Ejecutar el comando
            COMANDO.execute(client, interaction);
        } catch (e) {
            interaction.reply({ content: `**Ha ocurrido un error al ejecutar el comando \`${COMANDO.NAME}\`**\n*Mira la consola para más detalle.*`, ephemeral: true });
            console.log(e);

            return
        }
    }
};
