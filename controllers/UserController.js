const User = require('../models/User');
const auth = require('../auth');
const jwt = require('jsonwebtoken');
const userController = {}

userController.getAll = async (req, res, next) => {
    try {
        const users = await User.find({})
        res.status(200).json({
            data: users
        });
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

userController.signup = async (req, res, next) => {
    try {
        const {password, name} = req.body;
        //TODO verif name
        const hashedPwd = await auth.hashPassword(password);

        const user = await User.create({
            name: name,
            password: hashedPwd
        });
        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: 7200});
        return res.status(200).json({
            token: token,
            data: user,
            message: 'User succefully created.'
        });
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

userController.login = async (req, res, next) => {
    try {
        const {password, name} = req.body;

        const user = await User.findOne({name: name});
        if(!user) return res.status(404).json({error: 'User not found.'});

        const validPassword = await auth.validatePassword(password, user.password)
        if(!validPassword) return res.status(400).json({error: 'Password is not correct.'});

        const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: 2});
        return res.status(200).json({token: token});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

userController.me = async (req, res, next) => {
    const token = req.headers['x-access-token'];

    if(!token) return res.status(403).json({error: 'No token provided.'});
    
    try {
        const encoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({data: encoded});
    } catch (err) {
        res.status(401).json({error: err.message});
    }
}

userController.find = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId);
        if(!user) return res.status(404).json({error: 'User not found.'});

        return res.status(200).json({data: user});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

userController.delete = async (req, res, next) => {
    try {
        const user = await User.findByIdAndRemove(req.params.userId);
        return res.status(200).json({
            data: null, 
            message: 'User: ' + user.name + ' was deleted.'
        });
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

userController.update = async (req, res, next) => {
    try {
        const {name, owner} = req.body;
        const user = await User.findByIdAndUpdate(req.params.userId, {name, owner}, {new: true});
        return res.status(200).json({data: user});
    } catch(err) {
        res.status(500).json({error: err.message});
    }
}

module.exports = userController