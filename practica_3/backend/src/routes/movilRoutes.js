const express = require('express');
const router = express.Router();
const movilController = require('../controller/MovilController');

router.get('/moviles', movilController.getAll);
router.get('/moviles/:id', movilController.getById);
router.post('/moviles', movilController.create);
router.put('/moviles/:id', movilController.update);
router.delete('/moviles/:id', movilController.delete);

module.exports = router;
