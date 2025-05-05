const express = require('express');
const router = express.Router();
const libroController = require('../controllers/libroController');

router.get('/libros', libroController.getAll);
router.get('/libros/:id', libroController.getById);
router.get('/autores/:id/libros', libroController.getByAutor);
router.post('/libros', libroController.create);
router.put('/libros/:id', libroController.update);
router.delete('/libros/:id', libroController.delete);

module.exports = router;