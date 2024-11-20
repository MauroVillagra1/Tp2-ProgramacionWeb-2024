require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { getSeqInstance } = require('./src/config/setupDB.js'); 
const setupModels = require('./src/config/setupModel'); 
const studentsRoutes = require('./src/routes/studentRoutes.js');
const errorHandler = require('./src/middleware/errorHandler'); 
const adminRoutes = require('./src/routes/adminRoutes.js')

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/students', studentsRoutes);
app.use('/api/admins', adminRoutes);


setupModels().then(() => {
    console.log('Models are set up successfully');
    return getSeqInstance();
}).then(() => {
    console.log('Database connected successfully');
}).catch(error => {
    console.error('Unable to connect to the database:', error);
});


app.use(errorHandler);

module.exports = app;
