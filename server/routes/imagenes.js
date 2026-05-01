const express = require('express');
const router = express.Router();
const imagenController = require('../controllers/imagenController');
const { upload } = require('../config/cloudinary');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', imagenController.getAll);
router.get('/:id', imagenController.getById);
router.post('/', verifyToken, isAdmin, upload.single('imagen'), imagenController.create);
router.put('/:id', verifyToken, isAdmin, upload.single('imagen'), imagenController.update);
router.delete('/:id', verifyToken, isAdmin, imagenController.remove);

module.exports = router;
