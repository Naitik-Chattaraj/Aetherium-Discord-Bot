const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('joke')
    .setDescription('Get a random joke'),
  async execute(interaction) {
    try {
      const res = await axios.get('https://official-joke-api.appspot.com/random_joke');
      const joke = `${res.data.setup}\n${res.data.punchline}`;
      await interaction.reply(joke);
    } catch (err) {
      await interaction.reply('Could not fetch a joke right now.');
    }
  }
};
