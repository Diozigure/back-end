const Boitier = require('../models/Boitier')
const boitierController = {}

boitierController.getAll = async (req, res, next) => {
    try {
        const boitiers = await Boitier.find({})
        res.status(200).json({data: boitiers});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

boitierController.create = async (req, res, next) => {
    try {
        const {hash_name} = req.body;
        const boitier = await Boitier.create({
            hash_name: hash_name,
        });
        res.status(200).json({data: boitier});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

boitierController.find = async (req, res, next) => {
    try {
        const boitier = await Boitier.findById(req.params.boitierId);
        if(!boitier) return res.status(404).json({error: 'Boitier not found.'});

        res.status(200).json({data: boitier});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

boitierController.update = async (req, res, next) => {
    try {
        const boitier = await Boitier.findByIdAndUpdate(req.params.boitierId, req.body);
        res.status(200).json({data: boitier});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

boitierController.delete = async (req, res, next) => {
    try {
        const boitier = await Boitier.findByIdAndRemove(req.params.boitierId);
        res.status(200).json({
            data: null, 
            message: 'Boitier: ' + boitier.hash_name + ' was deleted.'
        });
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

module.exports = boitierController;