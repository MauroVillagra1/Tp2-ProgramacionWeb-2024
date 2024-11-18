const { Model, DataTypes } = require('sequelize');
const { Op } = require('sequelize'); // Importa Op desde Sequelize

class Administrator extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                username: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    unique: true,
                },
                email: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                    unique: true,
                },
                password: {
                    type: DataTypes.STRING(255), 
                    allowNull: false,
                },
                activo: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: true,
                },
            },
            {
                sequelize,
                modelName: 'admins', 
                timestamps: false, 
            }
        );

        return this;
    }


    static async getAll(search = '') {
        try {
            const result = await this.findAll({
                where: {
                    [Op.or]: [
                        { username: { [Op.substring]: search } },
                        { email: { [Op.substring]: search } },
                    ],
                },
                order: [['fecha_creacion', 'DESC']], 
            });
    
            return result; 
        } catch (error) {
            console.error('Error en getAll de Administrator:', error);
            throw error;
        }
    }

}

module.exports = Administrator;
