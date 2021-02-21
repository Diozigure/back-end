const Historique = require('../models/Historique')
const historiqueController = {}

historiqueController.findByBoitier = async (req, res, next) => {
    try {
        const historique = await Historique.find({boitierId: req.params.boitierId});
        if(!historique) return res.status(404).json({
            error: {
                code: 404,
                message:'Historique not found.'
            }
        });

        res.status(200).json({
            data: historique
        });
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

historiqueController.addHistorique = async (req, res, next) => {
    try {
        const {userId, date, message} = req.body;
        const query = {boitierId: req.params.boitierId};
        const update = {$push: {historique: {userId, date, message}}};
        const options = {new: true, upsert: true};

        const historique = await Historique.findOneAndUpdate(query, update, options);

        res.status(200).json({data: historique});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

historiqueController.delete = async (req, res, next) => {
    try {
        const historique = await Historique.findOneAndDelete({boitierId: req.params.boitierId});
        if(!historique) return res.status(404).json({
            error: {
                code: 404,
                message:'Historique not found.'
            }
        });
        res.status(200).json({
            data: null, 
            message: 'Historique: ' + historique._id + ' was deleted.'
        });
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

module.exports = historiqueController;