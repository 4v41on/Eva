const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(client, interaction) {
        return interaction.reply(`PONG!🏓 el ping del bot es de \`${client.ws.ping}ms\``);
    },
};
