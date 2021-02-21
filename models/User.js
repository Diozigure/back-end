const mongoose = require('mongoose');
const roles = require('../roles');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: 'USER', enum: roles},
    owner:[{
        boitierId: {type: mongoose.Types.ObjectId, ref: 'Boitier'}
    }]
});

mongoose.model('User', userSchema);

module.exports = mongoose.model('User');