const express = require('express');
const router = express.Router();
const propiedadController = require('../controllers/propiedadController');

router.get('/', propiedadController.getAll);
router.get('/:id', propiedadController.getById);
router.post('/', propiedadController.create);
router.put('/:id', propiedadController.update);
router.delete('/:id', propiedadController.remove);

module.exports = router;
