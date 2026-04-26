const express = require('express');
const router = express.Router();
const propiedadController = require('../controllers/propiedadController');
const { upload } = require('../config/cloudinary');

router.get('/', propiedadController.getAll);
router.get('/:id', propiedadController.getById);
router.post('/', upload.array('imagenes_archivos', 10), propiedadController.create);
router.put('/:id', upload.array('imagenes_archivos', 10), propiedadController.update);
router.delete('/:id', propiedadController.remove);

module.exports = router;
