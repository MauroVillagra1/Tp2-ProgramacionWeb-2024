const { getSeqInstance } = require('./setupDB.js');
const Students = require('../models/Student.js');

const setupModels = async () => {
    const sequelize = await getSeqInstance();
    Students.init(sequelize);
    await sequelize.sync(); // Sincroniza el modelo con la base de datos
};

module.exports = setupModels;
