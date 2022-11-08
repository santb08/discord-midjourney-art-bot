const { google } = require('googleapis');
const axios = require('axios');
const { DRIVE_FOLDER_ID } = require('./variables');

const auth = new google.auth.GoogleAuth({
  keyFile: 'creds.json',
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const driveService = google.drive({
  auth,
  version: 'v3',
});

const upload = async (imageName, imageUrl) => {
  const { data: image } = await axios.get(imageUrl, { responseType: 'stream' });
  const media = { mimeType: 'image/png', body: image };
  const response = await driveService.files.create({
    resource: {
      name: imageName,
      parents: [DRIVE_FOLDER_ID]
    },
    media: media,
    fields: 'id',
  });

  return 'https://drive.google.com/file/d/' + response.data.id;
};

module.exports = upload;
