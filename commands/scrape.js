const { SlashCommandBuilder } = require('discord.js');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

module.exports = {
  data: new SlashCommandBuilder()
    .setName('scrape')
    .setDescription('Get latest global news headlines'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
        const res = await newsapi.v2.topHeadlines({
        sources: 'the-times-of-india,the-hindu,news18',
        pageSize: 5,
        language: 'en'
        });
      if (!res.articles || res.articles.length === 0) {
        return interaction.editReply('🫠 No news found. Try again later.');
      }

      const msg = res.articles
        .map(article => `**${article.title}**\n${article.description || '*No description*'}\n🔗 ${article.url}`)
        .join('\n\n');

      await interaction.editReply(msg);
    } catch (err) {
      console.error('NewsAPI Error:', err);
      await interaction.editReply('⚠️ News fetching failed. Something went wrong.');
    }
  }
};
