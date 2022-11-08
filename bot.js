// @packages
const { Client } = require("discord.js-selfbot-v13");

const upload = require("./utils/upload_image");
const {
  BOT_ID,
  BOT_COMMAND,
  BOT_CHANNEL,
  CLIENT_TOKEN,
} = require("./utils/variables");
const { updateTask, updateCommand } = require("./core/tasks");
const client = new Client({ checkUpdate: false });

const extractKey = async (extractor) => {
  for (const key of extractor) {
    return key;
  }
};

const waitForMessage = async (channel) => {
  console.log('[Waiting For Message]');

  const messageFilter = (message) => {
    const isBotAuthor = message.author.id === '936929561302675456';

    console.log(
      '[Message Author]',
      message.author.id,
      isBotAuthor,
    );

    return isBotAuthor;
  };

  return (
    await channel.awaitMessages({
      filter: messageFilter,
      max: 1,
      time: 1000 * 60 * 3,
    })
  ).first();
};

const getMessageButtons = (message) => {
  return message.components;
};

const getUpscalingButtons = (message) => {
  const [upscalingOptions] = getMessageButtons(message);
  const options = upscalingOptions.components;
  options.pop(); // Last option is "Retry"
  return options;
};

const botFullFlow = async (task, option, res) => {
  let lastMessage;
  const channel = client.channels.cache.get(BOT_CHANNEL);
  console.log("[Commands]", task.commands);
  console.log("[Option]", option);

  for (command of task.commands) {
    const selfMessage = await channel.sendSlash(BOT_ID, BOT_COMMAND, command.command);
    console.log('[Interaction Started With]', selfMessage);

    // Wait for first Prompt
    await waitForMessage(channel);
    // Wait for message with options
    const message = await waitForMessage(channel);

    console.log("[Bot Message]", message, getMessageButtons(message));
    lastMessage = message;

    if (option === "random" || option === "random_max") {
      const options = getUpscalingButtons(message);
      const randomOption = Math.floor(Math.random() * options.length);
      const selectedOption = options[randomOption];
      console.log("[Random Image Option]", selectedOption);
      await lastMessage.clickButton(selectedOption.customId);
    }

    if (option === "third") {
      const options = getUpscalingButtons(message);
      const selectedOption = options[2];
      await lastMessage.clickButton(selectedOption.customId);
    }

    await waitForMessage(channel); // Wait for first prompt
    const messageWithImage = await waitForMessage(channel);
    lastMessage = await channel.messages.fetch(channel.lastMessageId);

    console.log(
      "[Last Message With Image]",
      messageWithImage,
      messageWithImage.attachments
    );

    if (option === "random_max") {
      const selectedOption = getMessageButtons(lastMessage);
      await lastMessage.clickButton(selectedOption.customId);
      await waitForMessage(channel);
      lastMessage = await channel.messages.fetch(channel.lastMessageId);
    }

    const attachmentKey = await extractKey(lastMessage.attachments.keys());
    const imageName = command.id;

    const newFile = await upload(imageName, lastMessage.attachments.get(attachmentKey).url);
    console.log('[New File]', newFile);

    command.selectedImage = newFile;

    updateCommand(task.id, command.id, {
      selectedImage: newFile
    });
  }
};

const botSelectedImage = async (task) => {
  const channel = client.channels.cache.get(BOT_CHANNEL);

  for (command of task.commands) {
    console.log('[Imagine]', command);
    await channel.sendSlash(BOT_ID, BOT_COMMAND, command.command);
    await waitForMessage(channel); // Wait for first prompt
    const messageWithImage = await waitForMessage(channel);
    const lastMessage = messageWithImage;

    console.log('[Message]', lastMessage);

    const attachmentKey = await extractKey(lastMessage.attachments.keys());
    const url = lastMessage.attachments.get(attachmentKey).url;
    command.pendingImage = {
      url,
      // command,
      // suffix: task.suffix,
      messageId: channel.lastMessageId,
    };
  }

  console.log('[Updating Commands]', task.commands);

  updateTask(task.id, {
    commands: task.commands
  });
};

const botSelectImage = async (messageId, selectedOption) => {
  console.log('[Selecting Image]', messageId, selectedOption);
  const channel = client.channels.cache.get(BOT_CHANNEL);

  const message = await channel.messages.fetch(messageId);
  const options = getUpscalingButtons(message);
  const button = options[selectedOption];

  console.log('[Message]', message);
  console.log('[Message Options]', options);

  await message.clickButton(button.customId);

  await waitForMessage(channel); // Wait for first prompt
  const lastMessage = await waitForMessage(channel);
  const attachmentKey = await extractKey(lastMessage.attachments.keys());

  return {
    messageId: lastMessage.id,
    url: lastMessage.attachments.get(attachmentKey).url
  };
}

const botDownloadImage = async (image, res) => {
  const channel = client.channels.cache.get(BOT_CHANNEL);

  const imageMessage = await channel.messages.fetch(image.messageId);
  const options = getUpscalingButtons(imageMessage);
  const selectedOption = options[1];

  await imageMessage.clickButton(selectedOption.customId);

  await waitForMessage(channel); // Wait for first prompt
  const lastMessage = await waitForMessage(channel);

  const attachmentKey = await extractKey(lastMessage.attachments.keys());
  const url = lastMessage.attachments.get(attachmentKey).url;
  console.log('[Uploading]', url);

  const imageName = image.commandId;
  const imageUrl = await upload(imageName, lastMessage.attachments.get(attachmentKey).url);

  await updateCommand(image.taskId, image.commandId, {
    pendingImage: null,
    pendingUpscale: null,
    selectedImage: imageUrl,
  });
};

client.login(CLIENT_TOKEN);
client.on("ready", async () => {
  console.log('[Logged In]')
});

module.exports = {
  botFullFlow,
  botSelectedImage,
  botDownloadImage,
  botSelectImage,
};
