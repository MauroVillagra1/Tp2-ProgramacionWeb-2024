const generateResponse = (status, message, data = null) => {
    return {
        status,
        message,
        data,
    };
};

const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

module.exports = {
    generateResponse,
    isValidEmail,
};
