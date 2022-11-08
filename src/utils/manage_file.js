const fs = require('fs')

const readAndWrite = async (filename, content) => {
    fs.readFile(filename, async (err, data) => {
        const parsedFile = JSON.parse(data)
        parsedFile.unshift(content)
        fs.writeFile(filename, JSON.stringify(parsedFile), function(err){
            if (err) throw err
        })
    })
}

const readAndRemove = async (filename, command) => {
    fs.readFile(filename, async (err, data) => {
        const parsedFile = JSON.parse(data)
        const index = parsedFile.findIndex(object => {
            return object.command === command
          })
        parsedFile.splice(index, 1)
        fs.writeFile(filename, JSON.stringify(parsedFile), function(err){
            if (err) throw err
        })
    })
}

module.exports = {readAndWrite, readAndRemove}