const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

async function hashPassword(password) {
    return await bcrypt.hash(password, 8);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];

    if(!token) return res.status(403).json({error: 'No token provided.'});

    try {
        const {userId, role, exp} = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = userId;
        req.role = role;

        next();
    } catch (err) {
        res.status(401).json({error: err.message});
    }
}

function adminAccess(req, res, next) {
    if(!req.role) return res.status(401).json({error: 'Your need to be logged in.'});
    if('ADMIN' !== req.role) return res.status(403).json({error: 'You don\'t have enough permission to perform this action'});
    next();
}

module.exports = {
    hashPassword,
    validatePassword,
    verifyToken,
    adminAccess
}