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
        next(err);
    }
}

historiqueController.addHistorique = async (req, res, next) => {
    try {
        const historique = await Historique.findOneAndUpdate({boitierId: req.params.boitierId}, { $push: {historique: req.body}}, {new: true, upsert: true});
        res.status(200).json({
            data: historique
        });
    } catch(err) {
        next(err);
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
        next(err);
    }
}

module.exports = historiqueController;