const mongoose = require('mongoose');

const boitierSchema = new mongoose.Schema({
    hash_name: {type: 'String', required: true},
    authorisation:[{
        userId: {type: mongoose.Types.ObjectId, ref: 'User'}
    }]
});

mongoose.model('Boitier', boitierSchema);

module.exports = mongoose.model('Boitier');