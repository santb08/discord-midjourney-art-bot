#Project setup
1. Install node js from https://nodejs.org/en/download/ for your platform
2. Unzip project folder. Open terminal/console. Run ‘npm install’ command.

#Discord part
1. Assign your user token to CLIENT_TOKEN variable from /utils/variables.js file. (https://www.androidauthority.com/get-discord-token-3149920/)
2. Assign channel id with the bot (it can be DM or channel on your own server) to BOT_CHANNEL variable from /utils/variables.js file. (The last part of any web link, like https://discord.com/channels/@me/101463260890005xxxx). 101463260890005xxxx - channel id.

#Google Drive part
1. Create Google API project.
2. Add Google Drive and Google Spreadsheets API.
3. Create Service account, grant owner permission and generate JSON key.
4. Download the key and place it into the root folder with creds.json name.
5. Add new values to the Variables file.
6. Add service account as to the folder.

#Runtime
1. Run 'npm start' command to start the server.