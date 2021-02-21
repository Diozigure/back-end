const database = require('./database')

const router = require('express').Router()
const userController = require('./controllers/UserController')
const boitierController = require('./controllers/BoitierController')
const historiqueController = require('./controllers/HistoriqueController')
const auth = require('./auth');

router.get('/users', auth.verifyToken, auth.adminAccess, userController.getAll);
router.get('/user/:userId', userController.find);
router.put('/user/:userId', userController.update);
router.delete('/user/:userId', userController.delete);

router.post('/register', userController.signup);
router.get('/me', userController.me);
router.post('/login', userController.login);

router.get('/boitiers', boitierController.getAll);
router.get('/boitier/:boitierId', boitierController.find);
router.post('/boitier', boitierController.create);
router.put('/boitier/:boitierId', boitierController.update);
router.delete('/boitier/:boitierId', boitierController.delete);

router.get('/historique/:boitierId', historiqueController.findByBoitier);
router.put('/historique/:boitierId', historiqueController.addHistorique);
router.delete('/historique/:boitierId', historiqueController.delete);

module.exports = router