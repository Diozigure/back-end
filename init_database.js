const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).catch((err) => console.log(err.message));

mongoose.connection.on('connected', () => {
    console.log('MongoDB connection is connected');
})

mongoose.connection.on('error', (err) => {
    console.log(err.message);
})

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB connection is disconnected');
})

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
})

const database = {}

/*database.connect = async () => {
    const mongoose = require('mongoose');
    const url = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME;

    mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, function(error){
        if(error) throw error;
    });
    database.db = mongoose.connection;
}

module.exports = database*/