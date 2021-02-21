const Boitier = require('../models/Boitier')
const boitierController = {}

boitierController.getAll = async (req, res, next) => {
    try {
        const boitiers = await Boitier.find({})
        res.status(200).json({
            data: boitiers
        });
    } catch(err) {
        next(err);
    }
}

boitierController.create = async (req, res, next) => {
    try {
        const boitier = await Boitier.create({
            hash_name: req.body.hash_name,
        });
        res.status(200).json({
            data: boitier
        });
    } catch(err) {
        next(err);
    }
}

boitierController.find = async (req, res, next) => {
    try {
        const boitier = await Boitier.findById(req.params.boitierId);
        if(!boitier) return res.status(404).json({
            error: {
                code: 404,
                message:'Boitier not found.'
            }
        });

        res.status(200).json({
            data: boitier
        });
    } catch(err) {
        next(err);
    }
}

boitierController.update = async (req, res, next) => {
    try {
        const boitier = await Boitier.findByIdAndUpdate(req.params.boitierId, req.body);
        res.status(200).json({
            data: boitier
        });
    } catch(err) {
        next(err);
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
        next(err);
    }
}

module.exports = boitierController;