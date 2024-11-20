const express = require('express');
const { requestPasswordRecovery, resetPassword, verifyRecoveryCode, verifyToken } = require('../services/adminService.js');
const Administrator = require('../models/Admin.js');
const { loginAdmin, findAllAdmins } = require('../services/adminService.js');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    const { search = '' } = req.query; 
    try {
        const admins = await findAllAdmins(search); 
        res.json(admins); 
    } catch (error) {
        console.error('Error al obtener administradores:', error);
        res.status(500).json({ message: 'Error al obtener administradores' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
    }

    try {
        const result = await loginAdmin(email, password);
        if (!result) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        res.status(200).json({ 
            message: 'Login exitoso',
            token: result.token,
            admin: { id: result.admin.id, username: result.admin.username, email: result.admin.email }
        });
    } catch (error) {
        console.error('Error en el login de administrador:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.post('/recovery-password', async (req, res) => {
    try {
        const { email } = req.body;
        console.log('Email recibido:', email);

        const message = await requestPasswordRecovery(email);
        console.log('Mensaje de recuperación:', message);

        res.status(200).json({ message });
    } catch (error) {
        console.error('Error en la recuperación de contraseña:', error);  
        res.status(400).json({ error: error.message });
    }
});


router.post('/verify-code', (req, res) => {
    const { email, code } = req.body;
    try {
        const message = verifyRecoveryCode(email, code);
        res.status(200).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


router.post('/reset-password', async (req, res) => {
    try {
        const { email, code, newPassword } = req.body;
        const message = await resetPassword(email, code, newPassword);
        res.status(200).json({ message });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
module.exports = router;
