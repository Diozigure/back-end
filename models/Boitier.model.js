const mongoose = require('mongoose');

const boitierSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    authorization:[{
        userId: {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    }]
});

boitierSchema.set('toJSON', {
    vituals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        ret.authorization.forEach(e => delete e._id);
    }
});

mongoose.model('Boitier', boitierSchema);

module.exports = mongoose.model('Boitier');