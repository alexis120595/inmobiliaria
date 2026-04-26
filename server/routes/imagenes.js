const express = require('express');
const router = express.Router();
const imagenController = require('../controllers/imagenController');
const { upload } = require('../config/cloudinary');

router.get('/', imagenController.getAll);
router.get('/:id', imagenController.getById);
router.post('/', upload.single('imagen'), imagenController.create);
router.put('/:id', upload.single('imagen'), imagenController.update);
router.delete('/:id', imagenController.remove);

module.exports = router;
