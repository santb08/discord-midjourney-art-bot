const express = require('express')
const fs = require('fs')
const {botFullFlow, botSelectedImage, botDownloadImage} = require('../bot')
const {getRows} = require('../utils/process_google')
const router = express.Router()

const processAndRedirect = async (type, task, res) => {
    fs.readFile('tasks.json', async (err, data) => {
        const tasks = JSON.parse(data)
        if (type === 'create') {
            const link = task.link_id ? task.link_id : task.link_id_auto
            const docRows = await getRows(link)
            const new_task = {
                "type": task.type,
                "prefixes": [],
                "suffixes": [],
                "commands": []
            }
            docRows.forEach((element, i) => {
                new_task.commands[i] = element.command ? {"command": element.command} : {"command": '-'}
                new_task.prefixes[i] = element.id ? {"prefix": element.id} : {"prefix": '-'}
                new_task.suffixes[i] = element.tag ? {"suffix": element.tag} : {"suffix": '-'}
            })
            tasks.unshift(new_task)
            fs.writeFile("tasks.json", JSON.stringify(tasks), function(err){
                if (err) throw err
                res.redirect('/')
              })
        }
        if (type === 'delete') {
            tasks.splice(task, 1)
            fs.writeFile("tasks.json", JSON.stringify(tasks), function(err){
                if (err) throw err
                res.redirect('/')
              })
        }
        if (type === 'edit') {
            tasks[task.id].type = task.type
            tasks[task.id].commands = []
            task.command.forEach((element, i) => {
                tasks[task.id].commands[i] = {"command": element}
            })
            fs.writeFile("tasks.json", JSON.stringify(tasks), function(err){
                if (err) throw err
                res.redirect('/')
              })
        }
        if (type === 'open') {
            const element = tasks[task]
            const id = task
            res.render('edit', {element, id})
        }
        if (type === 'run') {
            if (tasks[task].type === 'Random Upscaled image') botFullFlow(tasks[task].commands, tasks[task].prefixes, tasks[task].suffixes, 'random', res)
            if (tasks[task].type === 'The third image') botFullFlow(tasks[task].commands, tasks[task].prefixes, tasks[task].suffixes, 'third', res)
            if (tasks[task].type === 'Random Max Upscaled image') botFullFlow(tasks[task].commands, tasks[task].prefixes, tasks[task].suffixes, 'random_max', res)
            if (tasks[task].type === 'Selected image') botSelectedImage(tasks[task], res)
        }
    })
}

router.post('/task/create', (req, res) => {
    try {
        processAndRedirect('create', req.body, res)
    } catch (error) {
        res.render('error', {error})
    }

})

router.get('/task/delete', (req, res) => {
    try {
        processAndRedirect('delete', req.query.id, res)
    } catch (error) {
        res.render('error', {error})
    }
})

router.get('/task/open', (req, res) => {
    try {
        processAndRedirect('open', req.query.id, res)
    } catch (error) {
        res.render('error', {error})
    }
})

router.post('/task/edit', (req, res) => {
    try {
        processAndRedirect('edit', req.body, res)
    } catch (error) {
        res.render('error', {error})
    }
})

router.get('/task/run', (req, res) => {
    try {
        processAndRedirect('run', req.query.id, res)
    }
    catch (error) {
        res.render('error', {error})
    }

})

router.get('/task/image/upscale', (req, res) => {
    try {
        fs.readFile('pending_upscales.json', async (err, data) => {
            const images = JSON.parse(data)
            if (images) {
                botDownloadImage(images, res)
            }
        })
    } catch (error) {
        res.render('error', {error})
    }
})

router.get('/task/images/review', async (req, res) => {
    try {
        fs.readFile('pending_images.json', async (err, data) => {
            const images = JSON.parse(data)
            res.render('select_image', {images})
        })
    } catch (error) {
        res.render('error', {error})
    }

})

router.get('/task/image/select', async (req, res) => {
    let upscale_image
    try {
        fs.readFile('pending_images.json', async (err, data) => {
            const images = JSON.parse(data)
            images[req.query.id].selection = req.query.image
            upscale_image = images[req.query.id]
            images.splice(req.query.id, 1)
            fs.writeFile("pending_images.json", JSON.stringify(images), function(err){
                if (err) throw err
                fs.readFile('pending_upscales.json', async (err, data) => {
                    const images = JSON.parse(data)
                    images.push(upscale_image)
                    fs.writeFile("pending_upscales.json", JSON.stringify(images), function(err){
                        if (err) throw err
                        res.redirect('/task/images/review')
                    })
                })
            })
        })
    } catch (error) {
        res.render('error', {error})
    }
})

module.exports = router