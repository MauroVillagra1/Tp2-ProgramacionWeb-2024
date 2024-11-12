const express = require('express');
const { findAll, create } = require('../services/studentService.js');
const { Op } = require('sequelize');  // Importa Op desde Sequelize

const router = express.Router();


//traer la tabla
router.get('/', async (req, res) => {

    const { search = '', currentPage = 1, pageSize = 5 } = req.query;

    try {
        const result = await findAll(search, Number(currentPage), Number(pageSize));
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving students' });
    }
});


//Creacion de nuevo estudiante
router.post('/', async (req, res) => {
    try {
        const newStudent = await create(req.body);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
