const Sequelize = require('sequelize');

class Unit extends Sequelize.Model {
    static initiate(sequelize) {
        Unit.init({
            unitId: {
                type: Sequelize.BIGINT,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: Sequelize.BIGINT,
                allowNull: false,
            },
            nickname: {
                type: Sequelize.STRING(20),
                defaultValue: "warrior",
                unique: false,
            },
            gold: {
                type: Sequelize.BIGINT,
                defaultValue: 0,
                allowNull: false,
            },
            statPoint: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0,
            },
            level: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            }, 
            attack: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 10,
            },
            attackLevel: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            defense: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            defenseLevel: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            speed: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 5.0,
            },
            speedLevel: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            critical: {
                type: Sequelize.FLOAT,
                allowNull: false,
                defaultValue: 10,
            },
            criticalLevel: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            balance: {
                type: Sequelize.INTEGER,
                allowNull: false, 
                defaultValue: 0,
            },
            balanceLevel: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            maxHp: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 100,
            },
            maxMp: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 100,
            },
            experience: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Unit',
            tableName: 'Unit',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) { 
        db.Unit.belongsTo(db.User, {
            foreignKey: 'userId',
            targetKey: 'userId',
            onDelete: 'CASCADE',
        });
        db.Unit.hasMany(db.InventoryItem, {
            foreignKey: 'unitId',
            onDelete: 'CASCADE',
        });
        db.Unit.hasMany(db.Skill, {
            foreignKey: 'unitId',
            onDelete: 'CASCADE',
        });
        db.Unit.hasMany(db.SkillSlot, {
            foreignKey: 'unitId',
            onDelete: 'CASCADE',
        });
    }
}

module.exports = Unit;