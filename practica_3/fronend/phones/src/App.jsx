import React, { useEffect, useState } from 'react';
import './App.css'

function App() {
  const [moviles, setMoviles] = useState([]);
  const [form, setForm] = useState({ nombre: '', marca: '', mobile_os: '', precio: '', stock: '', fecha_ingreso: '' });
  const [editId, setEditId] = useState(null);

  const fetchMoviles = async () => {
    const res = await fetch('http://localhost:3000/api/moviles');
    const data = await res.json();
    setMoviles(data);
  };

  useEffect(() => {
    fetchMoviles();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (editId) {
      await fetch(`http://localhost:3000/api/moviles/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      setEditId(null);
    } else {
      await fetch('http://localhost:3000/api/moviles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
    }
    setForm({ nombre: '', marca: '', mobile_os: '', precio: '', stock: '', fecha_ingreso: '' });
    fetchMoviles();
  };

  const handleEdit = (movil) => {
    setForm(movil);
    setEditId(movil.id);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3000/api/moviles/${id}`, { method: 'DELETE' });
    fetchMoviles();
  };

  return (
    <div className="App">
      <h1>Gestión de Móviles</h1>
      <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
      <input name="marca" value={form.marca} onChange={handleChange} placeholder="Marca" />
      <input name="mobile_os" value={form.mobile_os} onChange={handleChange} placeholder="Sistema Operativo" />
      <input name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" />
      <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" />
      <input name="fecha_ingreso" value={form.fecha_ingreso} onChange={handleChange} placeholder="Fecha Ingreso (YYYY-MM-DD)" />
      <button onClick={handleSubmit}>{editId ? 'Actualizar' : 'Agregar'}</button>

      <ul>
        {moviles.map((m) => (
          <li key={m.id}>
            {m.nombre} - {m.marca} - {m.mobile_os} - ${m.precio} - Stock: {m.stock}
            <button onClick={() => handleEdit(m)}>Editar</button>
            <button onClick={() => handleDelete(m.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App
