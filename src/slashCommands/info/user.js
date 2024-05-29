const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    CMD: new SlashCommandBuilder()
        .setName('user')
        .setDescription('see user!'),
    async execute(client, interaction) {
   

        return interaction.reply(`Wake up, ${interaction.member.displayName}, The matrix has you... Follow th white rabbit. Knock,Knock,🐇 `);
    },
};
