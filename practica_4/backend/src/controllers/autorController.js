const pool = require('../config/db');

const autorController = {
  getAll: async (req, res) => {
    try {
      const [rows] = await pool.promise().query('SELECT * FROM autor');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching authors:', error);
      res.status(500).json({ error: 'Error fetching authors' });
    }
  },

  getById: async (req, res) => {
    try {
      const [rows] = await pool.promise().query('SELECT * FROM autor WHERE id_autor = ?', [req.params.id]);
      
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Author not found' });
      }
      
      res.json(rows[0]);
    } catch (error) {
      console.error('Error fetching author:', error);
      res.status(500).json({ error: 'Error fetching author' });
    }
  },

  getLibrosByAutor: async (req, res) => {
    try {
      const [autor] = await pool.promise().query('SELECT * FROM autor WHERE id_autor = ?', [req.params.id]);
      
      if (autor.length === 0) {
        return res.status(404).json({ error: 'Author not found' });
      }
      
      const [libros] = await pool.promise().query(`
        SELECT l.*, a.nombre as autor_nombre 
        FROM libro l
        JOIN autor a ON l.id_autor = a.id_autor
        WHERE l.id_autor = ?
      `, [req.params.id]);
      
      res.json({
        autor: autor[0],
        libros: libros
      });
    } catch (error) {
      console.error('Error fetching books by author:', error);
      res.status(500).json({ error: 'Error fetching books by author' });
    }
  },

  create: async (req, res) => {
    const { nombre, nacionalidad, fecha_nacimiento, biografia } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ error: 'Author name is required' });
    }
    
    try {
      const [result] = await pool.promise().query(
        'INSERT INTO autor (nombre, nacionalidad, fecha_nacimiento, biografia) VALUES (?, ?, ?, ?)',
        [nombre, nacionalidad, fecha_nacimiento, biografia]
      );
      
      res.status(201).json({ 
        id_autor: result.insertId,
        nombre,
        nacionalidad,
        fecha_nacimiento,
        biografia
      });
    } catch (error) {
      console.error('Error creating author:', error);
      res.status(500).json({ error: 'Error creating author' });
    }
  },

  update: async (req, res) => {
    const { nombre, nacionalidad, fecha_nacimiento, biografia } = req.body;
    const id = req.params.id;
    
    if (!nombre) {
      return res.status(400).json({ error: 'Author name is required' });
    }
    
    try {
      const [result] = await pool.promise().query(
        'UPDATE autor SET nombre = ?, nacionalidad = ?, fecha_nacimiento = ?, biografia = ? WHERE id_autor = ?',
        [nombre, nacionalidad, fecha_nacimiento, biografia, id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Author not found' });
      }
      
      res.json({ 
        id_autor: id,
        nombre,
        nacionalidad,
        fecha_nacimiento,
        biografia
      });
    } catch (error) {
      console.error('Error updating author:', error);
      res.status(500).json({ error: 'Error updating author' });
    }
  },

  delete: async (req, res) => {
    try {
      const [result] = await pool.promise().query('DELETE FROM autor WHERE id_autor = ?', [req.params.id]);
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Author not found' });
      }
      
      res.json({ message: 'Author deleted successfully' });
    } catch (error) {
      console.error('Error deleting author:', error);
      res.status(500).json({ error: 'Error deleting author' });
    }
  }
};

module.exports = autorController;