const express = require('express');
const router = express.Router();
const propiedadController = require('../controllers/propiedadController');
const { upload } = require('../config/cloudinary');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', propiedadController.getAll);
router.get('/:id', propiedadController.getById);
router.post('/', verifyToken, isAdmin, upload.array('imagenes_archivos', 10), propiedadController.create);
router.put('/:id', verifyToken, isAdmin, upload.array('imagenes_archivos', 10), propiedadController.update);
router.delete('/:id', verifyToken, isAdmin, propiedadController.remove);

module.exports = router;
