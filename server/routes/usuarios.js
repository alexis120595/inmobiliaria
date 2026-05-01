const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { upload } = require('../config/cloudinary');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, isAdmin, usuarioController.getAll);
router.get('/:id', verifyToken, isAdmin, usuarioController.getById);
router.post('/', verifyToken, isAdmin, upload.single('foto'), usuarioController.create);
router.put('/:id', verifyToken, isAdmin, upload.single('foto'), usuarioController.update);
router.delete('/:id', verifyToken, isAdmin, usuarioController.remove);

module.exports = router;
