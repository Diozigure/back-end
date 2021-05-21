const Boitier = require('../models/Boitier.model');
const User = require('../models/User.model');
const httpError = require('http-errors');
const ObjectId = require('mongoose').Types.ObjectId;
const Roles = require('../roles');
const AuthUtils = require('../AuthUtils');

getAll = async (req, res, next) => {
    try {
        const users = await User.find({});

        res.status(200).json({
            data: users
        });
    } catch(err) {
        next(err);
    }
}

find = async (req, res, next) => {
    try {
        const username = req.params.username;
        if(!username || (!req.user && !req.user.id)) throw httpError.BadRequest();

        const connectedUserId = req.user.id;
        const connectedUser = await User.findById(connectedUserId);

        if(!connectedUser || (connectedUser.role != Roles.Admin && connectedUser.username != username)) throw httpError.Unauthorized();

        const user = await User.findOne({username: username});
        if(!user) throw httpError.NotFound('User not found');

        return res.status(200).json({
            data: user
        });
    } catch(err) {
        next(err);
    }
}

update = async (req, res, next) => {
    try {
        const username = req.params.username;
        if(!username && !req.body) throw httpError.BadRequest();
        
        const user = await User.findOne({username: username});
        if(!user) throw httpError.NotFound('User not found');
        
        const {password, role, owner} = req.body;
        if(password) user.password = await AuthUtils.hashPassword(password);
        if(role && Object.values(Roles).includes(role)) user.role = role;
        if(owner) user.owner = owner;

        await user.save();

        return res.status(200).json({
            data: user,
            massage: 'User successfully updated'
        });
    } catch(err) {
        next(err);
    }
}

remove = async (req, res, next) => {
    try {
        const username = req.params.username;
        if(!username) throw httpError.BadRequest();

        const user = await User.findOneAndRemove({username: username});

        if(!user) throw httpError.NotFound('User not found');

        return res.status(200).json({
            data: null, 
            message: 'User successfully deleted'
        });
    } catch(err) {
        next(err);
    }
}

getBoitier = async (req, res, next) => {
    try {
        const username = req.params.username;
        if(!username || !req.user || !req.user.id) throw httpError.BadRequest();

        const connectedUserId = req.user.id;
        const connectedUser = await User.findById(connectedUserId);

        if(!connectedUser || (connectedUser.role != Roles.Admin && connectedUser.username != username)) throw httpError.Unauthorized();

        const user = await User.findOne({username: username});
        if(!user) throw httpError.NotFound('User not found');

        return res.status(200).json({
            data: user.owner
        });
    } catch(err) {
        next(err);
    }
}

addBoitier = async (req, res, next) => {
    try {
        const username = req.params.username;
        const {code} = req.body;
        if(!username || !code || !req.user || !req.user.id) throw httpError.BadRequest();
        
        const boitier = await Boitier.findOne({code: code});
        if(!boitier) throw httpError.NotFound('Boitier not found');

        const connectedUserId = req.user.id;
        const connectedUser = await User.findOne({_id: new ObjectId(connectedUserId), owner: {$elemMatch: {boitierId: new ObjectId(boitier._id)}}});

        if(!connectedUser) throw httpError.Unauthorized();

        const userExist = await User.findOne({username: username, owner: {$elemMatch: {boitierId: new ObjectId(boitier._id)}}});
        if(userExist) throw httpError.Conflict('User is already owner of this boitier');

        const user = await User.findOneAndUpdate({username: username}, {$addToSet: {owner: {boitierId: boitier._id}}}, {new: true});
        if(!user) throw httpError.NotFound('User not found');
        
        if(!boitier.authorization.some(e => user._id.equals(e.userId))) {
            boitier.authorization.push({userId: user._id});
            await boitier.save();
        }
        return res.status(200).json({
            data: null,
            message: `Boitier ${code} successfully owned by ${username}`
        });
    } catch(err) {
        next(err);
    }
}

removeBoitier = async (req, res, next) => {
    try {
        const username = req.params.username;
        const {code} = req.body;
        if(!username || !code || !req.user || !req.user.id) throw httpError.BadRequest();
        
        const boitier = await Boitier.findOne({code: code});
        if(!boitier) throw httpError.NotFound('Boitier not found');

        const connectedUserId = req.user.id;

        const connectedUser = await User.findOne({_id: new ObjectId(connectedUserId), owner: {$elemMatch: {boitierId: new ObjectId(boitier._id)}}});
        if(!connectedUser) throw httpError.Unauthorized();
        
        if(connectedUser.username == username) throw httpError.NotAcceptable('You can not remove yourself')
        
        const user = await User.findOneAndUpdate({username: username, owner: {$elemMatch: {boitierId: new ObjectId(boitier._id)}}}, {$pull: {owner: {boitierId: new ObjectId(boitier._id)}}}, {safe:true, new: true});
        if(!user) throw httpError.NotFound('User not found');

        return res.status(200).json({
            data: null,
            message: `Boitier ${code} is no longer owned by ${username}`
        });
    } catch(err) {
        next(err);
    }
}

module.exports = {
    getAll,
    find,
    update,
    remove,
    getBoitier,
    addBoitier,
    removeBoitier
}