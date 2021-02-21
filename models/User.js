const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: 'String', required: true},
    password: {type: 'String', required: true},
    owner:[{
        boitierId: {type: mongoose.Types.ObjectId, ref: 'Boitier'}
    }]
});

mongoose.model('User', userSchema);

module.exports = mongoose.model('User');