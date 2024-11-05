//Para no tener que escribir 80 lineas de lo mismo 

const generateResponse = (status, message, data = null) => {
    return {
        status,
        message,
        data,
    };
};
// Aqui compruebo si es valido el mail xd
const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

module.exports = {
    generateResponse,
    isValidEmail,
};
