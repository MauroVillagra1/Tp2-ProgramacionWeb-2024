const bcrypt = require('bcrypt'); // Para comparar contraseñas cifradas
const Administrator = require('../models/Admin.js');
const { Op } = require('sequelize');


const findAllAdmins = async (search = '', currentPage = 1, pageSize = 5) => {
    try {
        const admins = await Administrator.getAll(search, currentPage, pageSize);
        return admins; 
    } catch (error) {
        console.error('adminServices: ' + error);
        throw error; 
    }
};

const loginAdmin = async (email, password) =>{
    try {
        const admin = await Administrator.findOne({ where: { email } });

        if (!admin) {
            return null; 
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return null; 
        }

        return admin; 
    } catch (error) {
        throw new Error('Error al autenticar administrador');
    }
}

module.exports = { loginAdmin, findAllAdmins };
