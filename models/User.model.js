const mongoose = require('mongoose');
const roles = require('../roles');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'USER',
        enum: [roles.User, roles.Admin]
    },
    owner:[{
        boitierId: {
            type: mongoose.Types.ObjectId,
            ref: 'Boitier'
        }
    }]
});

userSchema.set('toJSON', {
    vituals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret.password;
        delete ret._id;
        ret.owner.forEach(e => delete e._id);
    }
})

mongoose.model('User', userSchema);

module.exports = mongoose.model('User');