const pool = require('../config/db');

const libroController = {
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.promise().query(`
        SELECT l.*, a.nombre as autor_nombre 
        FROM libro l
        LEFT JOIN autor a ON l.id_autor = a.id_autor
      `);
      res.json(rows);
    } catch (error) {
      console.error('Error fetching books:', error);
      res.status(500).json({ error: 'Error fetching books' });
    }
  },

  getById: async (req, res) => {
    try {
      const [rows] = await pool.promise().query(`
        SELECT l.*, a.nombre as autor_nombre 
        FROM libro l
        LEFT JOIN autor a ON l.id_autor = a.id_autor
        WHERE l.id_libro = ?
      `, [req.params.id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
      
      res.json(rows[0]);
    } catch (error) {
      console.error('Error fetching book:', error);
      res.status(500).json({ error: 'Error fetching book' });
    }
  },

  getByAutor: async (req, res) => {
    try {
      const [rows] = await pool.promise().query(`
        SELECT l.*, a.nombre as autor_nombre 
        FROM libro l
        LEFT JOIN autor a ON l.id_autor = a.id_autor
        WHERE l.id_autor = ?
      `, [req.params.id]);
      
      res.json(rows);
    } catch (error) {
      console.error('Error fetching books by author:', error);
      res.status(500).json({ error: 'Error fetching books by author' });
    }
  },

  create: async (req, res) => {
    const { titulo, anio_publicacion, genero, resumen, id_autor } = req.body;
    
    if (!titulo) {
      return res.status(400).json({ error: 'Book title is required' });
    }
    
    try {
      if (id_autor) {
        const [authors] = await pool.promise().query('SELECT * FROM autor WHERE id_autor = ?', [id_autor]);
        if (authors.length === 0) {
          return res.status(400).json({ error: 'Author not found' });
        }
      }
      
      const [result] = await pool.promise().query(
        'INSERT INTO libro (titulo, anio_publicacion, genero, resumen, id_autor) VALUES (?, ?, ?, ?, ?)',
        [titulo, anio_publicacion, genero, resumen, id_autor]
      );
      
      res.status(201).json({ 
        id_libro: result.insertId,
        titulo,
        anio_publicacion,
        genero,
        resumen,
        id_autor
      });
    } catch (error) {
      console.error('Error creating book:', error);
      res.status(500).json({ error: 'Error creating book' });
    }
  },

  update: async (req, res) => {
    const { titulo, anio_publicacion, genero, resumen, id_autor } = req.body;
    const id = req.params.id;
    
    if (!titulo) {
      return res.status(400).json({ error: 'Book title is required' });
    }
    
    try {
      if (id_autor) {
        const [authors] = await pool.promise().query('SELECT * FROM autor WHERE id_autor = ?', [id_autor]);
        if (authors.length === 0) {
          return res.status(400).json({ error: 'Author not found' });
        }
      }
      
      const [result] = await pool.promise().query(
        'UPDATE libro SET titulo = ?, anio_publicacion = ?, genero = ?, resumen = ?, id_autor = ? WHERE id_libro = ?',
        [titulo, anio_publicacion, genero, resumen, id_autor, id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
      
      res.json({ 
        id_libro: id,
        titulo,
        anio_publicacion,
        genero,
        resumen,
        id_autor
      });
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ error: 'Error updating book' });
    }
  },

  delete: async (req, res) => {
    try {
      const [result] = await pool.promise().query('DELETE FROM libro WHERE id_libro = ?', [req.params.id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Book not found' });
      }
      
      res.json({ message: 'Book deleted successfully' });
    } catch (error) {
      console.error('Error deleting book:', error);
      res.status(500).json({ error: 'Error deleting book' });
    }
  }
};

module.exports = libroController;