# Requirements
- Node v16.15.x
- Discord Selfbot Credentials
- Google API Service Account Credentials

# Project setup
1. Install node js from https://nodejs.org/en/download/ for your platform
2. Unzip project folder. Open terminal/console. Run ‘npm install’ command.

# Project configuration
Create a `.env` file in the project root, here we'll add all our credentials needed for our bot to work

```sh
CLIENT_TOKEN = '<DISCORD BOT TOKEN>' # //user auth token for the self bot
BOT_CHANNEL = '<DISCORD CHANNEL ID>' # // channel to send the messages

# PLEASE DON'T TOUCH
BOT_COMMAND = 'imagine' # imagine command for the bot
BOT_ID = '936929561302675456' # // unique id of Midjourney Bot

# GOOGLE API SETUP
DRIVE_FOLDER_ID = '<DRIVE FOLDER ID>' # // id of the folder, service account should be editor
```

# Discord part
1. Assign your user token to CLIENT_TOKEN variable from /utils/variables.js file. (https://www.androidauthority.com/get-discord-token-3149920/)
2. Assign channel id with the bot (it can be DM or channel on your own server) to BOT_CHANNEL variable from /utils/variables.js file. (The last part of any web link, like https://discord.com/channels/@me/101463260890005xxxx). 101463260890005xxxx - channel id.

# Google Drive part
1. Create Google API project.
2. Add Google Drive and Google Spreadsheets API.
3. Create Service account, grant owner permission and generate JSON key.
4. Download the key and place it into the root folder with `creds.json` name.
5. Add new values to the Variables file.
6. Add service account as to the folder.

# Runtime
1. Run `npm start` command to start the server.

# Deploy with Docker
1. Build Docker Image using the following command:

```sh
docker build -t mj-self-bot .
```

2. Run Docker Image Container with:
```sh
docker run -it -p 8000:3000 mj-self-bot
```

This can be useful in a future for deployments in different environments:)

# Collaborators
[Santb](https://github.com/tortutales) Any issue or any support needed feel free to contact me on any channel.