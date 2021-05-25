const router = require('express').Router();
const BoitierController = require('../controllers/Boitier.controller');
const {authorize} = require('../AuthUtils');
const Roles = require('../roles');

router.get('/', authorize(Roles.Admin), BoitierController.getAll);
router.post('/', authorize(), BoitierController.create);
router.get('/:code', authorize(), BoitierController.find);
router.put('/:code', authorize(Roles.Admin), BoitierController.update);
router.delete('/:code', authorize(Roles.Admin), BoitierController.remove);
router.get('/:code/right', authorize(), BoitierController.getUser);
router.post('/:code/right', authorize(), BoitierController.addUser);
router.delete('/:code/right', authorize(), BoitierController.removeUser);
router.get('/:code/open', authorize(), BoitierController.openAuth);

module.exports = router;