require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

// Load all slash commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

// Slash command registration + bot ready logic
client.once('ready', async () => {
  const CLIENT_ID = client.user.id;
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log('📦 Registering slash commands...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('✅ Commands registered!');
  } catch (err) {
    console.error('❌ Failed to register commands:', err);
  }

  console.log(`🟢 ${client.user.tag} is online`);

  // -------- 📰 Automatic News Posting Logic --------
  const newsChannelId = '1400196004606906491'; // #news

  const postNews = async () => {
    try {
      const channel = await client.channels.fetch(newsChannelId);
      if (!channel) return console.error('❌ News channel not found');
      const res = await axios.get(`https://newsapi.org/v2/everything`, {
        params: {
          q: 'india', // or anything generic like 'news'
          sortBy: 'publishedAt',
          pageSize: 1,
          language: 'en',
          apiKey: process.env.NEWS_API_KEY,
        },
      });

      const article = res.data.articles[0];
      if (!article) return console.log('🕵️ No news found.');

      await channel.send(
        `🗞️ **${article.title}**\n${article.description || 'No description available.'}\n [Read More](${article.url})`
      );
    } catch (err) {
      console.error('❌ Failed to fetch/post news:', err.message);
    }
  };

  // Post immediately on startup
  await postNews();

  // Post every 10 minutes
  setInterval(postNews, 10 * 60 * 1000);
  // -------- 📰 End News Logic --------
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error('⚠️ Command execution error:', err);
    await interaction.reply({
      content: '❌ Something went wrong while executing the command.',
      ephemeral: true,
    });
  }
});

client.login(process.env.TOKEN);
