const Students = require('../models/Student.js');

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
        // Verificar que no existe un estudiante con el mismo dni o email
        const existingStudent = await Students.findOne({
            where: {
                [Op.or]: [
                    { dni: student.dni, deleted: 0 },
                    { email: student.email, deleted: 0 },
                ],
            },
        });

        if (existingStudent) {
            throw new Error('Student with the same DNI or email already exists.');
        }

        const newSid = await Students.getNextSid();
        const newStudent = await Students.create({
            ...student,
            sid: newSid,
        });

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
