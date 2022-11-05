const stream = require('stream')
const { promisify } = require('util')
const fs = require('fs')
const got = require('got')

const pipeline = promisify(stream.pipeline)

const formImageName = (input, prefix, suffix) => {
    return prefix + '_' + input + '_' + suffix + '_' + Date.now()
}

const download = async (url, input, prefix, suffix) => {
    const imageName = formImageName(input, prefix, suffix) + '.png'
    const imagePath = './images/' + imageName
    await pipeline(
      got.stream(url),
      fs.createWriteStream(imagePath)
    )
    return {imageName, imagePath}
  }

module.exports = download