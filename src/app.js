require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productoRoutes = require('./routes/producto.routes');

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://logintesttriodenos.web.app',
  'https://frontendupbtest-valcarce.web.app',
  'https://*.web.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.some((o) => {
        if (o === origin) return true;
        if (o === 'https://*.web.app') return origin.endsWith('.web.app');
        return false;
      })) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: false,
  })
);
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API backendUpb funcionando');
});

app.use('/api/productos', productoRoutes);

// Ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejador de errores: HttpError usa su status, cualquier otro error es 500
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ error: 'JSON inválido' });
    }
    if (err.status) {
        return res.status(err.status).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
