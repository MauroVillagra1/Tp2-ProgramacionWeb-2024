const bcrypt = require('bcrypt'); // Para comparar contraseñas cifradas
const Administrator = require('../models/Admin.js');
const { Op } = require('sequelize');
const { sendRecoveryEmail, generateRecoveryToken } = require('../utils/helpers.js');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;
require('dotenv').config();

const loginAdmin = async (email, password) => {
    try {
        const admin = await Administrator.findOne({ where: { email } });

        if (!admin) {
            return null;
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return null;
        }

        const token = jwt.sign({ id: admin.id, email: admin.email }, SECRET_KEY, { expiresIn: '1h' });

        return { admin, token };
    } catch (error) {
        throw new Error('Error al autenticar administrador');
    }
};


const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; 

    if (!authHeader) {
        return res.status(403).json({ message: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(401).json({ message: 'Token inválido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

const findAllAdmins = async (search = '', currentPage = 1, pageSize = 5) => {
    try {
        const admins = await Administrator.getAll(search, currentPage, pageSize);
        return admins; 
    } catch (error) {
        console.error('adminServices: ' + error);
        throw error; 
    }
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});


let verificationCodes = {};


const requestPasswordRecovery = async (email) => {
    const admin = await Administrator.findOne({ where: { email } });
    if (!admin) {
        throw new Error('El correo no está registrado.');
    }

  
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[email] = code; 

   
    await transporter.sendMail({
        from: '"Soporte" <' + process.env.EMAIL_USER + '>',
        to: email,
        subject: 'Código de recuperación de contraseña',
        text: `Tu código de recuperación es: ${code}`,
    });

    return 'Correo de recuperación enviado con el código.';
};


const verifyRecoveryCode = (email, code) => {
    console.log('Email recibido:', verificationCodes[email]);
    console.log('Código recibido:', code);
    if (verificationCodes[email] == code) {
        return 'Código verificado con éxito.';
    } else {
        throw new Error('Código incorrecto.');
    }
};

// Restablecer la contraseña si el código es válido
const resetPassword = async (email, code, newPassword) => {
    const message = verifyRecoveryCode(email, code); // Verificar código

    if (message === 'Código verificado con éxito.') {
        const admin = await Administrator.findOne({ where: { email } });
        if (!admin) {
            throw new Error('Administrador no encontrado.');
        }

        // Actualizar la contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        admin.password = hashedPassword;
        await admin.save();

        // Limpiar el código de verificación
        delete verificationCodes[email];

        return 'Contraseña actualizada con éxito.';
    }

    return message;
};
module.exports = { 
    loginAdmin,
    verifyToken,
    findAllAdmins,
    requestPasswordRecovery,
    resetPassword,
    verifyRecoveryCode
};
