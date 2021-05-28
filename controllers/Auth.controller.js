const httpError = require('http-errors');
const AuthUtils = require('../AuthUtils');
const User = require('../models/User.model');
const Keystore = require('../models/Keystore.model');

signup = async (req, res, next) => {
    try {
        const {password, username} = req.body;
        if(!password || !username) throw httpError.BadRequest();
        
        const userExist = await User.findOne({username: username});
        if(userExist) throw httpError.Conflict(`${username} is already been register`);

        const hashedPwd = await AuthUtils.hashPassword(password);

        const user = await User.create({
            username: username,
            password: hashedPwd
        });

        const accessToken = await AuthUtils.signAccessToken(user);
        const refreshToken = await AuthUtils.signRefreshToken(user);

        return res.status(200).json({
            access_token: accessToken,
            refresh_token: refreshToken,
            data: user,
            message: 'User succefully created.'
        });
    } catch(err) {
        next(err);
    }
}

login = async (req, res, next) => {
    try {
        const {password, username} = req.body;
        if(!password || !username) throw httpError.BadRequest();

        const user = await User.findOne({username: username});
        if(!user) throw httpError.NotFound('User not registered');

        const validPassword = await AuthUtils.validatePassword(password, user.password)
        if(!validPassword) throw httpError.Unauthorized('Username or password not valid');

        const accessToken = await AuthUtils.signAccessToken(user);
        const refreshToken = await AuthUtils.signRefreshToken(user);

        return res.status(200).json({
            access_token: accessToken,
            refresh_token: refreshToken
        });
    } catch(err) {
        next(err);
    }
}

refreshToken = async (req, res, next) => {
    try {
        
        const {refreshToken} = req.body;
        console.log(refreshToken);
        if(!refreshToken) throw httpError.BadRequest();
        const userId = await AuthUtils.verifyRefreshToken(refreshToken);
        if(!userId) throw httpError.Unauthorized();
        
        const user = await User.findOne({_id: userId});
        if(!userId) throw httpError.InternalServerError();

        const accessToken = await AuthUtils.signAccessToken(user);
        const newRefreshToken = await AuthUtils.signRefreshToken(user);

        return res.status(200).json({
            access_token: accessToken,
            refresh_token: newRefreshToken
        });
    } catch(err) {
        next(err);
    }
}

logout = async (req, res, next) => {
    try {
        const {refreshToken} = req.body;
        if(!refreshToken) throw httpError.BadRequest();

        const userId = await AuthUtils.verifyRefreshToken(refreshToken);

        if(!userId) throw httpError.Unauthorized();

        await Keystore.findOneAndUpdate({userId: userId}, {
            refreshToken: null,
            status: false,
            expiresAt: Date.now()
        });

        return res.status(200).json({
            data: null,
            message: 'User succefully disconnected.'
        });
    } catch(err) {
        next(err);
    }
}

module.exports = {
    signup,
    login, 
    refreshToken,
    logout
}