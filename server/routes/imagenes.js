const express = require('express');
const router = express.Router();
const imagenController = require('../controllers/imagenController');

router.get('/', imagenController.getAll);
router.get('/:id', imagenController.getById);
router.post('/', imagenController.create);
router.put('/:id', imagenController.update);
router.delete('/:id', imagenController.remove);

module.exports = router;
