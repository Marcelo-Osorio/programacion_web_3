const express = require('express');
const router = express.Router();
const autorController = require('../controllers/autorController');

router.get('/autores', autorController.getAll);
router.get('/autores/:id', autorController.getById);
router.get('/autores/:id/libros', autorController.getLibrosByAutor); 
router.post('/autores', autorController.create);
router.put('/autores/:id', autorController.update);
router.delete('/autores/:id', autorController.delete);

module.exports = router;