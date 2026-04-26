const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { upload } = require('../config/cloudinary');

router.get('/', usuarioController.getAll);
router.get('/:id', usuarioController.getById);
router.post('/', upload.single('foto'), usuarioController.create);
router.put('/:id', upload.single('foto'), usuarioController.update);
router.delete('/:id', usuarioController.remove);

module.exports = router;
