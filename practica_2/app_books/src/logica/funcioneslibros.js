
import mysql from 'mysql2';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'marcelo',
  password: 'root',
  database: 'library',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

console.log('Pool de conexiones a MySQL creado.');                


const getAllBooks = (req, res) => {
  const query = 'SELECT * FROM books';

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error al obtener libros:', error);
      return res.status(500).json({ message: 'Error al obtener los libros' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontraron libros' });
    }

    return res.status(200).json({ message: 'Libros obtenidos correctamente', data: results });
  });
};

const getBookById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM books WHERE id = ?';

  pool.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error al encontrar libro:', error);
      return res.status(500).json({ message: 'Error al encontrar el libro' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    return res.status(200).json({ message: 'Libro encontrado correctamente', data: results[0] });
  });
};

const createBook = (req, res) => {
  const { title, author, year, genre } = req.body;
  const query = 'INSERT INTO books (title, author, published_year, genre) VALUES (?, ?, ?, ?)';

  pool.query(query, [title, author, year, genre], (error, results) => {
    if (error) {
      console.error('Error al insertar libro:', error);
      return res.status(500).json({ message: 'Error al insertar el libro' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    return res.status(200).json({ message: 'Libro insertado correctamente' });
  });
};

const updateBook = (req, res) => {
  const { id } = req.params;
  const { title, author, year, genre } = req.body;
  const query = 'UPDATE books SET title = ?, author = ?, published_year = ?, genre = ? WHERE id = ?';

  pool.query(query, [title, author, year, genre, id], (error, results) => {
    if (error) {
      console.error('Error al actualizar libro:', error);
      return res.status(500).json({ message: 'Error al actualizar el libro' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    return res.status(200).json({ message: 'Libro actualizado correctamente' });
  });
};

const deleteBook = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM books WHERE id = ?';

  pool.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error al eliminar libro:', error);
      return res.status(500).json({ message: 'Error al eliminar el libro' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    return res.status(200).json({ message: 'Libro eliminado correctamente' });
  });
};


export {deleteBook,getAllBooks,getBookById,updateBook,createBook}