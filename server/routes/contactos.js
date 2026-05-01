const express = require('express');
const router = express.Router();
const contactoController = require('../controllers/contactoController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, isAdmin, contactoController.getAll);
router.get('/:id', verifyToken, isAdmin, contactoController.getById);
router.post('/', contactoController.create);
router.put('/:id', verifyToken, isAdmin, contactoController.update);
router.delete('/:id', verifyToken, isAdmin, contactoController.remove);

module.exports = router;
