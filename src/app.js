require('dotenv').config();
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const indexRouter = require('./routes/index')
const tasksRouter = require('./routes/tasks')
const imageRouter = require('./routes/image');
const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(indexRouter)
app.use(tasksRouter)
app.use('/image', imageRouter);

module.exports = app;
