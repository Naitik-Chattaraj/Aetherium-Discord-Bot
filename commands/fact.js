const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fact')
    .setDescription('Get a random fact'),
  async execute(interaction) {
    try {
      const res = await axios.get('https://uselessfacts.jsph.pl/random.json?language=en');
      await interaction.reply(res.data.text);
    } catch (err) {
      await interaction.reply('Could not fetch a fact right now.');
    }
  }
};
