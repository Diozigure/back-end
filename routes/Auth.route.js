const router = require('express').Router();
const AuthController = require('../controllers/Auth.controller');

router.post('/register', AuthController.signup);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.delete('/logout', AuthController.logout);

module.exports = router;