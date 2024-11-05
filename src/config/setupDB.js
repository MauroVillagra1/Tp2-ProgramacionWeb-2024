const { Sequelize } = require('sequelize');
let seqInstance = null;

const createInstance = async () => {
    const instance = new Sequelize(
        process.env.DB_NAME, // nombre de base de datos
        process.env.DB_USER, // usuario
        process.env.DB_PASSWORD, // contraseña
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT, // Agrega el puerto aquí
            dialect: 'mysql',
            pool: {
                max: 3
            }
        }
    );

    try {
        await instance.authenticate();
        console.log('Connection has been established successfully.');
        return instance;
    } catch (error) {
        throw new Error('Unable to connect to the database: ' + error.message);
    }
};

const getSeqInstance = async () => {
    if (!seqInstance) {
        seqInstance = await createInstance();
    }
    return seqInstance;
};

module.exports = {
    getSeqInstance
};
