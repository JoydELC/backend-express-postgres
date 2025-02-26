const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // Añadir protección de seguridad
const compression = require('compression'); // Añadir compresión para mejorar rendimiento
const routerApi = require('./routes');
const { logErrors, errorHandler, boomErrorHandler, ormErrorHandler } = require('./middlewares/error.handler');
const { config } = require('./config/config');

const app = express();
const port = config.port;

// Middlewares
app.use(express.json());
app.use(helmet()); // Añade cabeceras HTTP seguras
app.use(compression()); // Comprime respuestas

// CORS configuración
const whitelist = [
  'http://localhost:3000', 
  'http://localhost:8080',
  'http://127.0.0.1:3001', 
  'https://myapp.co'
];

const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin || config.isProd) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
};

app.use(cors(options));

// Health check para proveedores cloud
app.get('/health', (req, res) => {
  res.status(200).send('API funcionando correctamente');
});

// Rutas principales
app.get('/', (req, res) => {
  res.send('Bienvenido a mi API Express con PostgreSQL');
});

app.get('/nueva-ruta', (req, res) => {
  res.send('Hola, soy una nueva ruta');
});

// Configurar rutas de la API
routerApi(app);

// Middlewares de error (mantener este orden)
app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en puerto ${port}`);
  console.log(`📌 Entorno: ${config.env}`);
});