const Students = require('../models/Student.js');
const { Op } = require('sequelize');
const { isValidEmail, isValidName, isValidDni, sendWelcomeEmail } = require('../utils/helpers.js');
require('dotenv').config(); 



const findAll = async (search, currentPage = 1, pageSize = 5) => {
    try {
        const students = await Students.getAll(search, currentPage, pageSize);
        return students;
    } catch (error) {
        console.error('studentsServices: ' + error);
        throw error;
    }
};

const create = async (student) => {
    try {
        if (!isValidName(student.firstname) || !isValidName(student.lastname)) {
            throw new Error('El nombre y apellido deben contener solo letras y tener máximo 100 caracteres.');
        }


        if (!isValidDni(student.dni)) {
            throw new Error('El DNI debe ser un número de 7 u 8 dígitos.');
        }

        if (!isValidEmail(student.email)) {
            throw new Error('Formato de correo electrónico no válido.');
        }


        const existingDni = await Students.findOne({
            where: {
                dni: student.dni,
                deleted: 0,
            },
        });

        if (existingDni) {
            throw new Error('Ya existe un estudiante con el mismo DNI.');
        }


        const existingEmail = await Students.findOne({
            where: {
                email: student.email,
                deleted: 0,
            },
        });

        if (existingEmail) {
            throw new Error('Ya existe un estudiante con el mismo correo electrónico.');
        }


        const newSid = await Students.getNextSid();
        const newStudent = await Students.create({
            ...student,
            sid: newSid,
        });

   
        await sendWelcomeEmail(student);

        return newStudent;
    } catch (error) {
        console.error('studentsServices: ' + error);
        throw error;
    }
};


module.exports = {
    findAll,
    create,
};
