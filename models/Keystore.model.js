const mongoose = require('mongoose');

const keystoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    refreshToken: {
        type: String,
        require: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
},
{
    versionKey: false
});

keystoreSchema.virtual('isExpired').get(function() {
    return Date.now() >= this.expiresAt;
});

keystoreSchema.virtual('isActive').get(function() {
    return this.status && !this.isExpired;
});

keystoreSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    }

})
mongoose.model('Keystore', keystoreSchema);

module.exports = mongoose.model('Keystore');