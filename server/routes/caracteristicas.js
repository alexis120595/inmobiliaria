const express = require('express');
const router = express.Router();
const caracteristicaController = require('../controllers/caracteristicaController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', caracteristicaController.getAll);
router.get('/:id', caracteristicaController.getById);
router.post('/', verifyToken, isAdmin, caracteristicaController.create);
router.put('/:id', verifyToken, isAdmin, caracteristicaController.update);
router.delete('/:id', verifyToken, isAdmin, caracteristicaController.remove);

module.exports = router;
