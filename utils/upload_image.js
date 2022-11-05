const {google} = require('googleapis')
const fs = require('fs')

const auth = new google.auth.GoogleAuth({
    keyFile: './creds.json',
    scopes: ['https://www.googleapis.com/auth/drive']
})

const driveService = google.drive({version: 'v3', auth})

const upload = async({imageName, imagePath}, folder) => {
    const fileMetadata = {'name': imageName, 'parents': [folder]}
    const media = {mimeType: 'image/png', body: fs.createReadStream(imagePath)}
    const response = await driveService.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id'
    })
    return "https://drive.google.com/file/d/" + response.data.id
}

module.exports = upload