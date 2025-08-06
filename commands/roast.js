const { SlashCommandBuilder } = require('discord.js');

const roasts = [
  "You're the reason shampoo has instructions.",
  "You have something on your chin... no, the third one down.",
  "You're as useless as the 'g' in lasagna.",
  "You're proof that even evolution takes a break."
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roast')
    .setDescription('Get roasted brutally'),
  async execute(interaction) {
    const roast = roasts[Math.floor(Math.random() * roasts.length)];
    await interaction.reply(roast);
  }
};
