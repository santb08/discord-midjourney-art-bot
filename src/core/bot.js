const { Client, User } = require('discord.js-selfbot-v13');
const {
  DISCORD_CHANNEL_ID,
  BOT_COMMAND,
  BOT_ID,
  DISCORD_TOKEN,
} = require('../utils/variables');

class Bot {
  instance = null;

  constructor() {
    if (this.instance) {
      return this;
    }

    const client = new Client({ checkUpdate: false });

    client.login(DISCORD_TOKEN);
    client.on("ready", async () => {
      console.log('[Logged In]', (await client.user.fetch()).emailAddress);
    });

    this.client = client;
    this.instance = this;
  }

  get channel() {
    const channel = this.client.channels.cache.get(DISCORD_CHANNEL_ID);
    return channel;
  }

  async sendMessage(query) {
    const channel = await this.client.channels.fetch(DISCORD_CHANNEL_ID);

    const message = await channel.sendSlash(
      BOT_ID,
      BOT_COMMAND,
      query,
    );

    return message;
  }
}

module.exports = new Bot();