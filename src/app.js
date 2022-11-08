require('dotenv').config();
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const indexRouter = require('./routes/index')
const tasksRouter = require('./routes/tasks')
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(indexRouter)
app.use(tasksRouter)

module.exports = app;
