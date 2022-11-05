const {Client} = require('discord.js-selfbot-v13')
const download = require('./utils/download_image')
const upload = require('./utils/upload_image')
const setRandomTime = require('./utils/randomize_sleep_time')
const {readAndWrite, readAndRemove} = require('./utils/manage_file')
const {BOT_ID, BOT_COMMAND, BOT_CHANNEL, BUTTON_OPTION, MAX_UPSCALE_BUTTON, CLIENT_TOKEN, SLEEP_TIME_MIN, SLEEP_TIME_MAX, DRIVE_FOLDER_ID} = require('./utils/variables')
const client = new Client({checkUpdate: false})

const extractKey = async (extractor) => {
    for (const key of extractor) {
      	return key
    }
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

const botFullFlow = async (commands, prefixes, suffixes, option, res) => {
	const runBot = async () => {
		let lastMessage
		const channel = client.channels.cache.get(BOT_CHANNEL)
		for (i = 0; i < commands.length; i++) {
			try {
				await channel.sendSlash(BOT_ID, BOT_COMMAND, commands[i].command)
				await sleep (setRandomTime(SLEEP_TIME_MIN, SLEEP_TIME_MAX))
				lastMessage = await channel.messages.fetch(channel.lastMessageId)
				if (option === 'random' || option === 'random_max') await lastMessage.clickButton("MJ::JOB::upsample::" + Math.floor(Math.random() * 4 + 1))
				if (option === 'third') await lastMessage.clickButton(BUTTON_OPTION)
				await sleep (setRandomTime(SLEEP_TIME_MIN, SLEEP_TIME_MAX))
				lastMessage = await channel.messages.fetch(channel.lastMessageId)
				if (option === 'random_max') {
					await lastMessage.clickButton(MAX_UPSCALE_BUTTON)
					await sleep (setRandomTime(SLEEP_TIME_MIN, SLEEP_TIME_MAX))
					lastMessage = await channel.messages.fetch(channel.lastMessageId)
				}
				const attachmentKey = await extractKey(lastMessage.attachments.keys())
				const image = await download(lastMessage.attachments.get(attachmentKey).url, commands[i].command, prefixes[i].prefix, suffixes[i].suffix)
				await upload(image, DRIVE_FOLDER_ID)
			} catch (error) {
				console.log(error)
			}
		}
		res.render('success')
	}
	client.on('ready', async () => {
		runBot()
	})
	if (!client.session_id) { client.login(CLIENT_TOKEN) }
	else { runBot() }

}

const botSelectedImage = async (task, res) => {
	const runBot = async () => {
		const channel = client.channels.cache.get(BOT_CHANNEL)
		try {
			for (i = 0; i < task.commands.length; i++) {
				await channel.sendSlash(BOT_ID, BOT_COMMAND, task.commands[i].command)
				await sleep (setRandomTime(SLEEP_TIME_MIN, SLEEP_TIME_MAX))
				const lastMessage = await channel.messages.fetch(channel.lastMessageId)
				const attachmentKey = await extractKey(lastMessage.attachments.keys())
				const url = lastMessage.attachments.get(attachmentKey).url
				const command = task.commands[i].command
				const line = {
					url,
					command,
					suffix: task.suffix,
					messageId: channel.lastMessageId
				}
				readAndWrite('pending_images.json', line)
			}
		} catch (error) {
			console.log(error)
		}
		res.render('success')
	}
	client.on('ready', async () => {
		runBot()
	})
	if (!client.session_id) { client.login(CLIENT_TOKEN) }
	else { runBot() }
}

const botDownloadImage = async (images, res) => {
	const runBot = async () => {
		let lastMessage
		const channel = client.channels.cache.get(BOT_CHANNEL)
		try {
			for (i = 0; i < images.length; i++) {
				lastMessage = await channel.messages.fetch(images[i].messageId)
				await lastMessage.clickButton('MJ::JOB::upsample::' + images[i].selection)
				await sleep (setRandomTime(SLEEP_TIME_MIN, SLEEP_TIME_MAX))
				lastMessage = await channel.messages.fetch(channel.lastMessageId)
				const attachmentKey = await extractKey(lastMessage.attachments.keys())
				const image = await download(lastMessage.attachments.get(attachmentKey).url, images[i].command, images[i].suffix)
				await upload(image, DRIVE_FOLDER_ID)
				readAndRemove('pending_upscales.json', images[i].command)
			}
		} catch (error) {
			console.log(error)
		}
		res.render('success')
	}
	client.on('ready', async () => {
		runBot()
	})
	if (!client.session_id) { client.login(CLIENT_TOKEN) }
	else { runBot() }
}

module.exports = {botFullFlow, botSelectedImage, botDownloadImage}