const dotenv = require('dotenv').config()
const express = require('express')
const routes = require('./routes')
const database = require('./database')
require('./models/User')
database.connect()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(routes)

const SERVER_PORT = process.env.SERVER_PORT || 8080;

app.listen(SERVER_PORT, () => {
    console.log(`Application running on port ${SERVER_PORT}.`)
})