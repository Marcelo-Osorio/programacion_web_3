const Movil = require('../model/MovilModel');

exports.getAll = (req, res) => {
  // Extract limit and offset from query parameters
  const limit = req.query.limit ? parseInt(req.query.limit) : null;
  const offset = req.query.offset ? parseInt(req.query.offset) : 0;
  
  Movil.getAll(limit, offset, (err, results) => {
    if (err) return res.status(500).send('Error al obtener moviles');
    res.json(results);
  });
};

exports.getById = (req, res) => {
  const { id } = req.params;
  Movil.getById(id, (err, results) => {
    if (err) return res.status(500).send('Error al obtener el móvil');
    if (results.length === 0) return res.status(404).send('Móvil no encontrado');
    res.json(results[0]);
  });
};

exports.create = (req, res) => {
  Movil.create(req.body, (err, result) => {
    if (err) return res.status(500).send('Error al crear un nuevo móvil');
    res.json({ id: result.insertId, ...req.body });
  });
};

exports.update = (req, res) => {
  const { id } = req.params;
  Movil.update(id, req.body, (err, result) => {
    if (err) return res.status(500).send('Error al actualizar el móvil');
    if (result.affectedRows === 0) return res.status(404).send('Móvil no encontrado');
    res.send('Móvil actualizado correctamente');
  });
};

exports.delete = (req, res) => {
  const { id } = req.params;
  Movil.delete(id, (err, result) => {
    if (err) return res.status(500).send('Error al eliminar el móvil');
    if (result.affectedRows === 0) return res.status(404).send('Móvil no encontrado');
    res.send('Móvil eliminado correctamente');
  });
};
