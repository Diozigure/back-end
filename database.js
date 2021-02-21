const { Db } = require('mongodb');

const database = {}

database.connect = async () => {
    const mongoose = require('mongoose');
    const url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;

    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, function(error){
        if(error) throw error;
    });
    database.db = mongoose.connection;
}

module.exports = database