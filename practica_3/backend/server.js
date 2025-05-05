const express = require('express');
const cors = require('cors');
const movilRoutes  = require('./src/routes/movilRoutes');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use('/api', movilRoutes);
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});