const Sequelize = require('sequelize');

class InventoryItem extends Sequelize.Model {
    static initiate(sequelize) {
        InventoryItem.init({
            inventoryItemId: {
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            itemDataId: {
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
            amount: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            enhanceLevel: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            isEquipped: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            quickSlotIndex: {
                type: Sequelize.INTEGER,
                allowNull : true,
                defaultValue : null,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'InventoryItem',
            tableName: 'InventoryItem',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.InventoryItem.belongsTo(db.Unit, {
            foreignKey: 'unitId',
            targetKey: 'unitId',
            onDelete: 'CASCADE',
        });
    }
}

module.exports = InventoryItem; 