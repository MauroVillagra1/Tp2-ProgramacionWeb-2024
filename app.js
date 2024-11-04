require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { getSeqInstance } = require('./src/config/setupDB.js'); 
const setupModels = require('./src/config/setupModel'); // Nueva línea para configurar modelos
const studentsRoutes = require('./src/routes/studentRoutes.js');
const errorHandler = require('./src/middleware/errorHandler'); // Middleware de manejo de errores

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/students', studentsRoutes);

// Configuración de modelos y conexión a la base de datos
setupModels().then(() => {
    console.log('Models are set up successfully');
    return getSeqInstance();
}).then(() => {
    console.log('Database connected successfully');
}).catch(error => {
    console.error('Unable to connect to the database:', error);
});

// Usar el middleware de manejo de errores al final
app.use(errorHandler);

module.exports = app;
