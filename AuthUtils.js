const JWT = require('jsonwebtoken');
const httpError = require('http-errors');
const bcrypt = require('bcrypt');
const Keystore = require('./models/Keystore.model');
const User = require('./models/User.model');

hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

validatePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

getAccessToken = (headers) => {
    if(!headers['authorization']) throw httpError.BadRequest();
    const authorization = headers['authorization'];
    if(!authorization) throw httpError.BadRequest();
    if(!authorization.startsWith('Bearer ')) throw httpError.BadRequest();
    return authorization.split(' ')[1];
}

signAccessToken = async (user) => {
    const payload = {id: user._id};
    const secret = process.env.JWT_ACCESS_SECRET;
    const options = {expiresIn: '15m'}

    try {
        return await JWT.sign(payload, secret, options);
    } catch(err) {
        throw httpError.InternalServerError();
    }
}

verifyAccessToken = async (token) => {
    try {
        const payload = await JWT.verify(token, process.env.JWT_ACCESS_SECRET);
        return payload.id;
    } catch (err) {
        throw httpError.Unauthorized();
    }
}

signRefreshToken = async (user) => {
    const payload = {id: user._id};
    const secret = process.env.JWT_REFRESH_SECRET;
    const expires = 7200; //2h
    const options = {expiresIn: expires}

    try {
        const refreshToken = await JWT.sign(payload, secret, options);
        
        const keystore = await Keystore.findOneAndUpdate({userId: user._id}, {
            userId: user._id,
            refreshToken: refreshToken,
            status: true,
            expiresAt: Date.now() + expires*1000,
            createdAt: Date.now()
        }, {upsert: true, new: true});

        return refreshToken;
    } catch(err) {
        throw httpError.InternalServerError();
    }
}

verifyRefreshToken = async (refreshToken) => {
    const payload = await JWT.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    if(!payload || !payload.id) throw httpError.Unauthorized();
    
    const keystore = await Keystore.findOne({userId: payload.id, refreshToken: refreshToken});
    if(!keystore || !keystore.isActive) throw httpError.Unauthorized();

    return payload.id;
}

authorize = (roles = [])  => {
    if(typeof(roles) === 'string') roles = [roles];

    return async (req, res, next) => {
        try {
            const token = getAccessToken(req.headers);
            const userId = await verifyAccessToken(token);
            if(!userId) throw httpError.Unauthorized();
            
            const user = await User.findById(userId);
            if(!user || (roles.length && !roles.includes(user.role))) throw httpError.Unauthorized();

            req.user = {
                id: userId,
                role: user.role
            };
            next();
        } catch(err) {
            next(err);
        }
    }
}

module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken,
    hashPassword,
    validatePassword,
    authorize
}