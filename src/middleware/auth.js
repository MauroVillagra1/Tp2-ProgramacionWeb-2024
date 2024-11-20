const Admin = require('../models/Admin.js');
const { sendRecoveryEmail, generateRecoveryToken } = require('../utils/helpers.js');
const bcrypt = require('bcrypt');


const jwt = require('jsonwebtoken');



const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.sendStatus(401); 

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); 
        req.user = user;
        next();
    });
};

const requestPasswordRecovery = async (email) => {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
        throw new Error('El correo no está registrado.');
    }

   
    const token = generateRecoveryToken();
    admin.recoveryToken = token;
    admin.tokenExpiration = new Date(Date.now() + 3600000); 
    await admin.save();

  
    await sendRecoveryEmail(email, token);
    return 'Correo de recuperación enviado.';
};

const resetPassword = async (token, newPassword) => {
    const admin = await Admin.findOne({
        where: {
            recoveryToken: token,
            tokenExpiration: { [Op.gt]: new Date() },
        },
    });

    if (!admin) {
        throw new Error('Token inválido o expirado.');
    }


    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.recoveryToken = null;
    admin.tokenExpiration = null;
    await admin.save();

    return 'Contraseña actualizada con éxito.';
};


module.exports = {
    authenticateToken,
    requestPasswordRecovery,
    resetPassword
};
