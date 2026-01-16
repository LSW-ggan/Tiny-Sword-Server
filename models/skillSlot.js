const Sequelize = require('sequelize');

class SkillSlot extends Sequelize.Model {
    static initiate(sequelize) {
        SkillSlot.init({
            skillSlotId: {
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
            slotIndex: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'SkillSlot',
            tableName: 'SkillSlot',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.SkillSlot.belongsTo(db.Unit, {
            foreignKey: 'unitId',
            targetKey: 'unitId',
            onDelete: 'CASCADE',
        });
    }
}

module.exports = SkillSlot; 