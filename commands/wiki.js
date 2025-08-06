const { SlashCommandBuilder } = require('discord.js');
const wikipedia = require('wikipedia');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('wiki')
    .setDescription('Search Wikipedia')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Search term')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('query');
    try {
      const page = await wikipedia.page(query); // make sure this is a string
      const summary = await page.summary();

      await interaction.reply({
        content: `${summary.extract.slice(0, 1900)}\n\n[Learn More](${summary.content_urls.desktop.page})`
      });
    } catch (error) {
      console.error('Wiki error:', error);
      await interaction.reply('No results found or an error occurred. Try refining your query!');
    }
  }
};
