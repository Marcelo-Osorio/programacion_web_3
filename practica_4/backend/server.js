const express = require('express');
const cors = require('cors');
const autorRoutes  = require('./src/routes/autorRoutes');
const libroRoutes  = require('./src/routes/libroRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', autorRoutes);
app.use('/api', libroRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

