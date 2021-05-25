const httpError = require('http-errors');
const Boitier = require('../models/Boitier.model');
const User = require('../models/User.model');
const Roles = require('../roles');
const ObjectId = require('mongoose').Types.ObjectId;

getAll = async (req, res, next) => {
    try {
        const boitiers = await Boitier.find({})
        
        return res.status(200).json({
            data: boitiers
        });
    } catch(err) {
        next(err);
    }
}

create = async (req, res, next) => {
    try {
        const {code} = req.body;
        if(!code || (!req.user && !req.user.id)) throw httpError.BadRequest();
        const owner = req.user.id;

        const boitierExist = await Boitier.findOne({code: code});
        if(boitierExist) throw httpError.Conflict(`Boitier ${code} is already been register`);

        const user = await User.findById(owner);
        if(!user) throw httpError.NotFound('User not found');

        const boitier = await Boitier.create({
            code: code,
            authorization: [{
                userId: owner
            }]
        });
        
        user.owner.push({boitierId: boitier._id});
        await user.save();

        return res.status(200).json({
            data: boitier,
            message: 'Boitier succefully created. '
        });
    } catch(err) {
        next(err);
    }
}

find = async (req, res, next) => {
    try {
        if(!req.params || !req.params.code) throw httpError.BadRequest();
        const code = req.params.code;

        if(!req.user || !req.user.id) throw httpError.BadRequest();
        const connectedUserId = req.user.id;
        
        const boitier = await Boitier.findOne({code: code});
        if(!boitier) throw httpError.NotFound('Boitier not found');

        const connectedUser = await User.findById(connectedUserId);
        if(!connectedUser || (connectedUser.role != Roles.Admin && !connectedUser.owner.some(e => boitier._id.equals(e.boitierId)))) throw httpError.Unauthorized();
        
        return res.status(200).json({
            data: boitier
        });
    } catch(err) {
        next(err);
    }
}

update = async (req, res, next) => {
    try {
        const {authorization} = req.body;
        if(!req.params || !req.params.code || !authorization) throw httpError.BadRequest();
        const code = req.params.code;
        
        const boitier = await Boitier.findOneAndUpdate({code: code}, {authorization: authorization}, {new: true});
        if(!boitier) throw httpError.NotFound('Boitier not found');

        return res.status(200).json({
            data: boitier
        });
    } catch(err) {
        next(err);
    }
}

remove = async (req, res, next) => {
    try {

        if(!req.params || !req.params.code) throw httpError.BadRequest();
        const code = req.params.code;
        
        const boitier = await Boitier.findOneAndRemove({code: code});
        if(!boitier) throw httpError.NotFound('Boitier not found');

        await User.updateMany({owner: {$elemMatch: {boitierId: new ObjectId(boitier._id)}}}, {$pull: {owner: {boitierId: new ObjectId(boitier._id)}}}, {safe: true, new: true});
        
        return res.status(200).json({
            data: null, 
            message: 'Boitier successfully deleted'
        });
    } catch(err) {
        next(err);
    }
}

getUser = async (req, res, next) => {
    try {
        if(!req.params || !req.params.code) throw httpError.BadRequest();
        const code = req.params.code;

        if(!req.user || !req.user.id) throw httpError.BadRequest();
        const connectedUserId = req.user.id;
        
        const boitier = await Boitier.findOne({code: code});
        if(!boitier) throw httpError.NotFound('Boitier not found');

        const connectedUser = await User.findOne({_id: connectedUserId, "owner.boitierId" : boitier._id});
        if(!connectedUser) throw httpError.Unauthorized();

        return res.status(200).json({
            data: boitier.authorization,
        });
    } catch(err) {
        next(err);
    }
}

addUser = async (req, res, next) => {
    try {
        const {username} = req.body;

        if(!username || !req.params || !req.params.code) throw httpError.BadRequest();
        const code = req.params.code;

        if(!req.user || !req.user.id) throw httpError.BadRequest();
        const connectedUserId = req.user.id;
        
        const boitier = await Boitier.findOne({code: code});
        if(!boitier) throw httpError.NotFound('Boitier not found');

        const connectedUser = await User.findOne({_id: connectedUserId, "owner.boitierId" : boitier._id});
        if(!connectedUser) throw httpError.Unauthorized();

        const user = await User.findOne({username:username});
        if(!user) throw httpError.NotFound('User not found');
        
        const authorizationExist = await Boitier.findOne({code: code, authorization: {$elemMatch: {userId: new ObjectId(user._id)}}});
        if(authorizationExist) throw httpError.Conflict('User already has the right of this boitier');

        const boitierModified = await Boitier.findOneAndUpdate({code: code}, {$addToSet: {authorization: {userId: user._id}}}, {new: true});
        if(!boitierModified) throw httpError.NotFound('Boitier not found');
        
        return res.status(200).json({
            data: boitierModified
        });
    } catch(err) {
        next(err);
    }
}

removeUser = async (req, res, next) => {
    try {
        const {username} = req.body;

        if(!username || !req.params || !req.params.code) throw httpError.BadRequest();
        const code = req.params.code;

        if(!req.user || !req.user.id) throw httpError.BadRequest();
        const connectedUserId = req.user.id;
        
        const boitier = await Boitier.findOne({code: code});
        if(!boitier) throw httpError.NotFound('Boitier not found');

        const connectedUser = await User.findOne({_id: connectedUserId, "owner.boitierId" : boitier._id});
        if(!connectedUser) throw httpError.Unauthorized();

        const user = await User.findOne({username: username});
        if(!user) throw httpError.NotFound('User not found');

        if(user.owner.some(e => boitier._id.equals(e.boitierId))) throw httpError.NotAcceptable('You can not remove a owner');
        
        const boitierModified = await Boitier.findOneAndUpdate({code: code}, {$pull: {authorization: {userId: new ObjectId(user._id)}}}, {safe: true, new: true});
        if(!boitierModified) throw httpError.NotFound('Boitier not found');

        return res.status(200).json({
            data: null,
            message: 'Right successfully removed for the User'
        });
    } catch(err) {
        next(err);
    }
}

openAuth = async (req, res, next) => {
    try {
        if(!req.params || !req.params.code) throw httpError.BadRequest();
        const code = req.params.code;

        if(!req.user || !req.user.id) throw httpError.BadRequest();
        const connectedUserId = req.user.id;
        
        const boitier = await Boitier.findOne({code: code});
        if(!boitier) throw httpError.NotFound('Boitier not found');

        if(!boitier.authorization.some(e => connectedUserId ==e.userId)) throw httpError.Unauthorized();
        
        return res.status(200).json({
            data: null,
            message: 'Authorisation successful'
        });
    } catch(err) {
        next(err);
    }
}

module.exports = {
    getAll,
    create,
    find,
    update,
    remove,
    getUser,
    addUser,
    removeUser,
    openAuth
};