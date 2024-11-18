const express = require('express');
const { findAll, create } = require('../services/studentService.js');
const { Op } = require('sequelize');  // Importa Op desde Sequelize
const Students = require('../models/Student.js');

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

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Students.findByPk(id);
        if (!student) {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        student.deleted = 1;
        await student.save();

        res.status(200).json({ message: 'Estudiante borrado lógicamente' });
    } catch (error) {
        console.error('Error al borrar estudiante:', error);
        res.status(500).json({ message: 'Error al borrar estudiante' });
    }
});

module.exports = router;
