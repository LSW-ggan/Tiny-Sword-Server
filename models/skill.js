const Sequelize = require('sequelize');

class Skill extends Sequelize.Model {
    static initiate(sequelize) {
        Skill.init({
            skillId: {
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            skillDataId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            unitId: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            skillLevel: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Skill',
            tableName: 'Skill',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Skill.belongsTo(db.Unit, {
            foreignKey: 'unitId',
            targetKey: 'unitId',
            onDelete: 'CASCADE',
        });
    }
}

module.exports = Skill; 