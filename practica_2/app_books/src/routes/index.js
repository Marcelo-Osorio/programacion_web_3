const express = require('express');
const router = express.Router();
const {getAllBooks,getBookById,createBook,updateBook,deleteBook} = require('../logica/funcioneslibros');

router.get('/books/', getAllBooks);

router.get('/books/:id', getBookById);

router.post('/books/', createBook);

router.put('/books/:id', updateBook);

router.delete('/books/:id', deleteBook);

module.exports = router;
