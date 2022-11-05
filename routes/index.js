const express = require('express')
const fs = require('fs')
const router = express.Router()

router.get('/', (req, res) => {
    let tasks, pending_images, pending_upscales
    try {
        fs.readFile('tasks.json', (err, data) => {
            tasks = JSON.parse(data)
            fs.readFile('pending_images.json', (err, data) => {
                pending_images = JSON.parse(data)
                fs.readFile('pending_upscales.json', (err, data) => {
                    pending_upscales = JSON.parse(data)
                    res.render('index', {tasks, pending_images, pending_upscales})
                })
            })
        })
    } catch (error) {
        res.render('error', {error})
    }
})

module.exports = router