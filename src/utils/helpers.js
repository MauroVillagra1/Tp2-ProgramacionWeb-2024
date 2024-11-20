const nodemailer = require('nodemailer');
require('dotenv').config(); // Cargar variables de entorno desde .env
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const isValidName = (name) => {
const re = /^(?!\s)([A-Za-z]+(\s[A-Za-z]+)*)(?=\s*$)/;
    return re.test(name) && name.length <= 100;
};

const isValidDni = (dni) => {
    const re = /^\d{6,9}$/; // Solo números y entre 7-8 dígitos
    return re.test(String(dni));
};

const transporter = nodemailer.createTransport({
    service: 'gmail', // o tu servicio de correo (Gmail, Outlook, etc.)
    auth: {
        user: process.env.EMAIL_USER, // tu correo
        pass: process.env.EMAIL_PASSWORD, // contraseña de aplicación o API key
    },
});

// Verifica si el transportador está configurado correctamente
transporter.verify((error, success) => {
    if (error) {
        console.error('Error al configurar nodemailer:', error);
    } else {
        console.log('Nodemailer está listo para enviar correos:', success);
    }
});



// Función para enviar correos
const sendWelcomeEmail = async (student) => {
    const mailOptions = {
        from: '"Gestión de Estudiantes" <noreply@example.com>', // Remitente
        to: student.email, // Destinatario
        subject: '¡Bienvenido a nuestro sistema de gestión de estudiantes!',
        html: `
            <h1 style="text-align: center; color: #4CAF50;">¡Hola, ${student.firstname}!</h1>
            <p style="font-size: 16px;">Nos alegra que te hayas unido a nuestro sistema de gestión de estudiantes.</p>
            <p style="font-size: 16px;">Aquí tienes algunos de tus datos registrados:</p>
            <ul style="font-size: 16px;">
                <li><strong>Nombre:</strong> ${student.firstname} ${student.lastname}</li>
                <li><strong>DNI:</strong> ${student.dni}</li>
                <li><strong>Correo:</strong> ${student.email}</li>
            </ul>
            <p style="font-size: 16px;">Si tienes alguna duda o necesitas soporte, no dudes en contactarnos.</p>
            <p style="text-align: center; font-size: 14px; color: #888;">Este mensaje es generado automáticamente. Por favor, no respondas a este correo.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${student.email}`);
    } catch (error) {
        console.error('Error al enviar correo:', error);
    }
};
const sendRecoveryEmail = async (email, token) => {
    const recoveryLink = `${process.env.FRONTEND_URL}/recovery-password/${token}`;
    const mailOptions = {
        from: '"Sistema de Gestión" <noreply@example.com>',
        to: email,
        subject: 'Recuperación de Contraseña',
        html: `
            <h1>Recuperación de Contraseña</h1>
            <p>Hemos recibido una solicitud para recuperar tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
            <a href="${recoveryLink}" style="color: blue;">Recuperar contraseña</a>
            <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Correo de recuperación enviado a ${email}`);
    } catch (error) {
        console.error('Error al enviar correo de recuperación:', error);
        throw new Error('Error al enviar correo de recuperación');
    }
};

// Genera un token seguro para la recuperación
const generateRecoveryToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

module.exports = {
    isValidEmail,
    isValidName,
    isValidDni,
    sendWelcomeEmail,
    sendRecoveryEmail,
    generateRecoveryToken
};
