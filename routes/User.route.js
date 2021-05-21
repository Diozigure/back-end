const router = require('express').Router();
const UserController = require('../controllers/User.controller');
const {authorize} = require('../AuthUtils');
const Roles = require('../roles');

router.get('/', authorize(Roles.Admin), UserController.getAll);
router.get('/:username', authorize(), UserController.find);
router.delete('/:username', authorize(Roles.Admin), UserController.remove);
router.put('/:username', authorize(Roles.Admin), UserController.update);
router.get('/:username/owner', authorize(), UserController.getBoitier)
router.post('/:username/owner', authorize(), UserController.addBoitier);
router.delete('/:username/owner', authorize(), UserController.removeBoitier);

module.exports = router;