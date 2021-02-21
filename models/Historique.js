const mongoose = require('mongoose');

const historiqueSchema = new mongoose.Schema({
    boitierId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Boitier'},
    historique: [{
        userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
        date: {type: Date, required: true},
        message: String
    }]
});

mongoose.model('Historique', historiqueSchema);

module.exports = mongoose.model('Historique');