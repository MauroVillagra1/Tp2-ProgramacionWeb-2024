const express = require('express');
const { loginAdmin, findAllAdmins  } = require('../services/adminService.js');
const Administrator = require('../models/Admin.js');

const router = express.Router();

router.get('/', async (req, res) => {
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
        const admin = await loginAdmin(email, password);
        if (!admin) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        res.status(200).json({ 
            message: 'Login exitoso', 
            admin: { id: admin.id, username: admin.username, email: admin.email } 
        });
    } catch (error) {
        console.error('Error en el login de administrador:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
