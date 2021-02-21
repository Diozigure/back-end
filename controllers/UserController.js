const User = require('../models/User')
const userController = {}

userController.getAll = async (req, res, next) => {
    try {
        const users = await User.find({})
        res.status(200).json({
            data: users
        });
    } catch(err) {
        next(err);
    }
}

userController.create = async (req, res, next) => {
    try {
        const user = await User.create({
            name: req.body.name,
            password: req.body.password
        });
        res.status(200).json({
            data: user
        });
    } catch(err) {
        next(err);
    }
}

userController.find = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if(!user) return res.status(404).json({
            error: {
                code: 404,
                message:'User not found.'
            }
        });

        res.status(200).json({
            data: user
        });
    } catch(err) {
        next(err);
    }
}

userController.delete = async (req, res, next) => {
    try {
        const user = await User.findByIdAndRemove(req.params.userId);
        res.status(200).json({
            data: null, 
            message: 'User: ' + user.name + ' was deleted.'
        });
    } catch(err) {
        next(err);
    }
}

userController.update = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, {new: true});
        res.status(200).json({
            data: user
        });
    } catch(err) {
        next(err);
    }
}
module.exports = userController