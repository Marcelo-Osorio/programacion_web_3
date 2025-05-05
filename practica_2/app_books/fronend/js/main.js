// URL base de la API
const API_URL = "http://localhost:3000/api/books";

// Elementos de la tabla y modal de actualización
const booksTableBody = document.querySelector("#booksTable tbody");
const updateModal = new bootstrap.Modal(document.getElementById("updateModal"));
const updateForm = document.getElementById("updateForm");
const bookIdField = document.getElementById("bookId");
const titleField = document.getElementById("title");
const authorField = document.getElementById("author");
const yearField = document.getElementById("year");
const genreField = document.getElementById("genre");
const saveChangesBtn = document.getElementById("saveChangesBtn");
// Elementos del modal de creación
const createModal = new bootstrap.Modal(document.getElementById("createModal"));
const createForm = document.getElementById("createForm");
const createTitleField = document.getElementById("createTitle");
const createAuthorField = document.getElementById("createAuthor");
const createYearField = document.getElementById("createYear");
const createGenreField = document.getElementById("createGenre");
const createBookBtn = document.getElementById("createBookBtn");

/* 
   OBTENER LISTA DE LIBROS
    */
async function fetchBooks() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener la lista de libros");
    }
    const books = await response.json();
    console.log(books)
    renderBooks(books.data);
  } catch (error) {
    console.error("fetchBooks:", error);
  }
}

/* 
   RENDERIZAR TABLA DE LIBROS
  */
function renderBooks(books) {
  booksTableBody.innerHTML = "";
  books.forEach((book) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${book.id}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.published_year}</td>
      <td>${book.genre || ""}</td>
      <td>
        <button 
          class="btn btn-sm me-2" 
          onClick="openUpdateModal(${book.id}, '${book.title}', '${
      book.author
    }', ${book.published_year}, '${book.genre || ""}')"
        >
          Actualizar
        </button>
        <button 
          class="btn btn-sm btn-danger"
          onClick="deleteBook(${book.id})"
        >
          Eliminar
        </button>
      </td>
    `;

    booksTableBody.appendChild(row);
  });
}

/* 
   ELIMINAR LIBRO
  */
async function deleteBook(bookId) {
  try {
    const confirmDelete = confirm("¿Estás seguro de eliminar este libro?");
    if (!confirmDelete) return;

    const response = await fetch(`${API_URL}/${bookId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar el libro");
    }
    alert("Libro eliminado correctamente");
    fetchBooks();
  } catch (error) {
    console.error("deleteBook:", error);
    alert("Ocurrió un error al eliminar el libro");
  }
}

/*
   ABRIR MODAL DE ACTUALIZACIÓN
   */
function openUpdateModal(id, title, author, year, genre) {
  bookIdField.value = id;
  titleField.value = title;
  authorField.value = author;
  yearField.value = year;
  genreField.value = genre;

  updateModal.show();
}

/* 
   ACTUALIZAR LIBRO
    */
async function updateBook() {
  try {
    const id = bookIdField.value;
    const title = titleField.value;
    const author = authorField.value;
    const year = parseInt(yearField.value, 10);
    const genre = genreField.value;

    if (!title || !author || !year) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, author, year, genre }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el libro");
    }

    alert("Libro actualizado correctamente");
    updateModal.hide();
    fetchBooks();
  } catch (error) {
    console.error("updateBook:", error);
    alert("Ocurrió un error al actualizar el libro");
  }
}

/* 
   CREAR NUEVO LIBRO (POST)
*/
async function createBook() {
  try {
    const title = createTitleField.value;
    const author = createAuthorField.value;
    const year = parseInt(createYearField.value, 10);
    const genre = createGenreField.value;

    if (!title || !author || !year) {
      alert("Por favor, completa los campos requeridos (Título, Autor, Año).");
      return;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, author, year, genre }),
    });

    if (!response.ok) {
      throw new Error("Error al crear el libro");
    }

    alert("Libro creado correctamente");
    createModal.hide();
    createForm.reset();
    fetchBooks();
  } catch (error) {
    console.error("createBook:", error);
    alert("Error al crear el libro");
  }
}

saveChangesBtn.addEventListener("click", updateBook);
createBookBtn.addEventListener("click", createBook);

// Cuando cargue la página, obtener la lista de libros
addEventListener("DOMContentLoaded", fetchBooks);
