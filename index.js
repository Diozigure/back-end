const dotenv = require('dotenv').config()
const express = require('express')
const routes = require('./routes')

const app = express()

app.use(routes)

const port = process.env.PORT || 8080;

app.listen(process.env.PORT, () => {
    console.log(`Application running on port ${port}.`)
})