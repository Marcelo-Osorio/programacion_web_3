const pool = require('../config/db');

const Movil = {
  getAll: (limit, offset, callback) => {
    let sql = 'SELECT * FROM moviles';
    const params = [];
    
    // Add LIMIT and OFFSET if provided
    if (limit !== null) {
      sql += ' LIMIT ?';
      params.push(limit);
      
      if (offset !== null) {
        sql += ' OFFSET ?';
        params.push(offset);
      }
    }
    
    pool.query(sql, params, callback);
  },

  getById: (id, callback) => {
    pool.query('SELECT * FROM moviles WHERE id = ?', [id], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO moviles (nombre, marca, mobile_os, precio, stock, fecha_ingreso)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.nombre,
      data.marca,
      data.mobile_os,
      data.precio,
      data.stock,
      data.fecha_ingreso
    ];
    pool.query(sql, values, callback);
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE moviles
      SET nombre = ?, marca = ?, mobile_os = ?, precio = ?, stock = ?, fecha_ingreso = ?
      WHERE id = ?
    `;
    const values = [
      data.nombre,
      data.marca,
      data.mobile_os,
      data.precio,
      data.stock,
      data.fecha_ingreso,
      id
    ];
    pool.query(sql, values, callback);
  },

  delete: (id, callback) => {
    pool.query('DELETE FROM moviles WHERE id = ?', [id], callback);
  }
};

module.exports = Movil;
