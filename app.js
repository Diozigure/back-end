require('dotenv').config();
require('./init_database');
const express = require('express');

const authRoute = require('./routes/Auth.route');
const userRoute = require('./routes/User.route');
const boitierRoute = require('./routes/Boitier.route');

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/boitier', boitierRoute);

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});

const SERVER_PORT = process.env.SERVER_PORT || 8080;

app.listen(SERVER_PORT, () => {
    console.log(`Application running on port ${SERVER_PORT}.`)
});