const express = require('express');
const app = express();
const cors = require('cors');

// Middlewares esto nos ayuda al control de errores, validacion de datos entre otros
app.use(cors());
app.use(express.json());

// Rutas
const routes = require('./src/routes');
// a las rutas le anidamos "/api"
app.use('/api', routes);

// Con ello corremos el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


