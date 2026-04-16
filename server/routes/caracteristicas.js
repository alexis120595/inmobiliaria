const express = require('express');
const router = express.Router();
const caracteristicaController = require('../controllers/caracteristicaController');

router.get('/', caracteristicaController.getAll);
router.get('/:id', caracteristicaController.getById);
router.post('/', caracteristicaController.create);
router.put('/:id', caracteristicaController.update);
router.delete('/:id', caracteristicaController.remove);

module.exports = router;
