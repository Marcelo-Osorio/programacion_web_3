import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import axios from 'axios';
import './App.css';

function App() {
  const [authors, setAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [showBooksModal, setShowBooksModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: '',
    nacionalidad: '',
    fecha_nacimiento: '',
    biografia: ''
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/autores');
      setAuthors(response.data);
    } catch (error) {
      console.error('Error fetching authors:', error);
      alert('Error fetching authors');
    }
  };

  const fetchAuthorBooks = async (authorId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/autores/${authorId}/libros`);
      setSelectedAuthor(response.data.autor);
      setAuthorBooks(response.data.libros);
      setShowBooksModal(true);
    } catch (error) {
      console.error('Error fetching author books:', error);
      alert('Error fetching author books');
    }
  };

  const handleEditAuthor = (author) => {
    setSelectedAuthor(author);
    setEditForm({
      nombre: author.nombre,
      nacionalidad: author.nacionalidad || '',
      fecha_nacimiento: author.fecha_nacimiento ? author.fecha_nacimiento.split('T')[0] : '',
      biografia: author.biografia || ''
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

  const saveAuthor = async () => {
    try {
      await axios.put(`http://localhost:3000/api/autores/${selectedAuthor.id_autor}`, editForm);
      setShowEditModal(false);
      fetchAuthors(); 
    } catch (error) {
      console.error('Error updating author:', error);
      alert('Error updating author');
    }
  };

  const deleteAuthor = async (authorId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/autores/${authorId}/libros`);
      const authorBooks = response.data.libros;
      
      if (authorBooks.length > 0) {
        alert('No se puede eliminar por que hay libros.');
        return;
      }
      
      if (window.confirm('estas seguro ?')) {
        await axios.delete(`http://localhost:3000/api/autores/${authorId}`);
        fetchAuthors(); 
      }
    } catch (error) {
      console.error('Error deleting author:', error);
      alert('Error deleting author');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Authors Management</h1>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Nationality</th>
            <th>Birth Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((author) => (
            <tr key={author.id_autor}>
              <td>{author.id_autor}</td>
              <td>{author.nombre}</td>
              <td>{author.nacionalidad || 'N/A'}</td>
              <td>
                {author.fecha_nacimiento 
                  ? new Date(author.fecha_nacimiento).toLocaleDateString() 
                  : 'N/A'}
              </td>
              <td>
                <Button 
                  variant="info" 
                  size="sm" 
                  className="me-2"
                  onClick={() => fetchAuthorBooks(author.id_autor)}
                >
                  View Books
                </Button>
                <Button 
                  variant="warning" 
                  size="sm" 
                  className="me-2"
                  onClick={() => handleEditAuthor(author)}
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => deleteAuthor(author.id_autor)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showBooksModal} onHide={() => setShowBooksModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedAuthor ? `Books by ${selectedAuthor.nombre}` : 'Author Books'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {authorBooks.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Genre</th>
                </tr>
              </thead>
              <tbody>
                {authorBooks.map((book) => (
                  <tr key={book.id_libro}>
                    <td>{book.id_libro}</td>
                    <td>{book.titulo}</td>
                    <td>{book.anio_publicacion || 'N/A'}</td>
                    <td>{book.genero || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p className="text-center">This author has no books.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBooksModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Author</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                name="nombre" 
                value={editForm.nombre} 
                onChange={handleInputChange} 
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nationality</Form.Label>
              <Form.Control 
                type="text" 
                name="nacionalidad" 
                value={editForm.nacionalidad} 
                onChange={handleInputChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Birth Date</Form.Label>
              <Form.Control 
                type="date" 
                name="fecha_nacimiento" 
                value={editForm.fecha_nacimiento} 
                onChange={handleInputChange} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Biography</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                name="biografia" 
                value={editForm.biografia} 
                onChange={handleInputChange} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveAuthor}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
