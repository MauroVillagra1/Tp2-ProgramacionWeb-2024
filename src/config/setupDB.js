const { Sequelize } = require('sequelize');
let seqInstance = null;

const createInstance = async () => {
    const instance = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER, 
        process.env.DB_PASSWORD, 
        {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT, 
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
