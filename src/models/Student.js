const { Model, DataTypes } = require('sequelize');
const { Op } = require('sequelize'); 

class Students extends Model {
    static init = (sequelize) => {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                sid: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                },
                firstname: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                lastname: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                dni: {
                    type: DataTypes.BIGINT,
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                deleted: {
                    type: DataTypes.TINYINT,
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                modelName: 'students',
                timestamps: true, 
            }
        );

        return this;
    }

    static async getNextSid() {
        const lastStudent = await this.findOne({
            order: [['sid', 'DESC']],
            where: { deleted: 0 },
        });
        return lastStudent ? lastStudent.sid + 1 : 1; 
    }

    static async getAll(search, currentPage, pageSize) {
        const offset = (currentPage - 1) * pageSize;
        return await this.findAndCountAll({
            where: {
                deleted: 0,
                [Op.or]: [
                    { firstname: { [Op.substring]: search } },
                    { lastname: { [Op.substring]: search } },
                ],
            },
            limit: pageSize,
            offset,
        });
    }
}

module.exports = Students;
