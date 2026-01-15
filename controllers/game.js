const { UnitNotFoundError, DataFormatError } = require('../errors/index');
const { sequelize } = require('../models');
const { Unit, InventoryItem, Skill, SkillSlot } = require('../models/index');

// 게임 시작 시 호출
async function enterGame(req, res, next) {
    let transaction;
    try {
        // 트랜잭션 시작
        transaction = await sequelize.transaction();

        const user = req.user;
        const userId = user.userId;

        // 유저의 유닛 목록 조회
        let units = await Unit.findAll({ 
          where: { userId }, 
          transaction,
          lock: transaction.LOCK.UPDATE
        });

        let unit;

        // 유닛이 하나도 없으면 기본 유닛 생성
        if (units.length === 0) {
            unit = await Unit.create({
                    userId,
                },
                { transaction }
            );
            // 첫 유닛이면 자동 선택
            user.currentUnitId = unit.unitId;
            await user.save({ transaction });
        } 
        else {
            // 임시 로직 - 유저가 여러 유닛을 가질 수 있도록 개선한다면 나중에 인덱스를 조절하여 접속
            unit = units[0];
            user.currentUnitId = unit.unitId;
            await user.save({ transaction });
        }

        // 트랜잭션 커밋
        await transaction.commit();
        // 플레이어 데이터 리턴
        return res.status(200).json({
            level: unit.level,
            experience: unit.experience,
            gold: unit.gold,
            statPoint: unit.statPoint,
            levels: {
                attack : unit.attackLevel,
                defense : unit.defenseLevel,
                speed : unit.speedLevel,
                critical : unit.criticalLevel,
                balance: unit.balanceLevel,
            },
            stats: {
                attack: unit.attack,
                defense: unit.defense,
                speed: unit.speed,
                critical : unit.critical,
                balance : unit.balance,
                maxHp: unit.maxHp,
                maxMp: unit.maxMp,
            }
        });
    } catch(err) {
        // 에러 발생 시 rollback
        if(transaction) await transaction.rollback();

        console.log(err);
        return next(err);
    }
}

// 유닛 정보 저장
async function saveUnitData(req, res, next) {
    let transaction;
    try {
        // 트랜잭션 시작
        transaction = await sequelize.transaction();

        const user = req.user;
        const unitId = user.currentUnitId;

        // 존재하는 유닛인지 확인
        if (!unitId) {
            throw new UnitNotFoundError();
        }

        const { level, experience, statPoint, gold, levels, stats } = req.body;

        // 유닛 데이터 저장
        await Unit.update({
                level: level,
                experience: experience,
                gold: gold,

                statPoint: statPoint,
                attackLevel: levels.attack,
                defenseLevel: levels.defense,
                speedLevel: levels.speed,
                criticalLevel: levels.critical,
                balanceLevel: levels.balance,

                attack: stats.attack,
                defense: stats.defense,
                speed: stats.speed,
                critical: stats.critical,
                balance: stats.balance,
                maxHp: stats.maxHp,
                maxMp: stats.maxMp,
            }, { where: { unitId }, transaction }
        );

        await transaction.commit();

        return res.status(200).json({});
      } catch(err) {
        console.log(err);
        if (transaction) await transaction.rollback();

        return next(err);
    }
}

// 인벤토리 아이템 조회
async function getItemData(req, res, next) {
    try {
        const user = req.user;
        const unitId = user.currentUnitId;

        // 존재하는 유닛인지 확인
        if (!unitId) {
            throw new UnitNotFoundError();
        }

        // 유닛의 아이템을 슬롯 번호 오름차순으로 조회
        const items = await InventoryItem.findAll({
            where: { unitId },
            order: [['slotIndex', 'ASC']],
        });

        // DTO
        const inventory = [];

        for (const item of items) {
            inventory.push({
                itemDataId: item.itemDataId,
                slotIndex: item.slotIndex,
                amount: item.amount,
                enhanceLevel: item.enhanceLevel,
                isEquipped: item.isEquipped,
                quickSlotIndex: item.quickSlotIndex
            });
        }

        return res.status(200).json({ inventory });
    } catch (err) {
        return next(err);
    }
}

// 인벤토리 정보 저장
// 현재는 유닛이 가진 기존의 인벤토리 데이터를 모두 지우고 새로 저장하는 방식
// DB I/O 비용과 부분 저장을 위한 로직의 비용을 잘 비교판단하여 결정하는 것이 좋다.
// 저장 요청이 비교적 적은 소규모의 게임에서는 지금과 같은 방식이 이점을 가질 수도 있을 것 같은데,
// 만약 DB I/O 비용이 부담되는 지점이 온다면, 변화가 이루어진 슬롯만을 추려내어
// 클라이언트에서 부분 업데이트를 하는 방식도 고려해볼 수 있을 것 같다.
// ex) 슬롯 수 증가, 저장 빈도 증가, 동시 접속자 증가 시 부분 업데이트 방식으로 전환 고려

async function saveItemData(req, res, next) {
    let transaction;
    try {
        // 트랜잭션 시작
        transaction = await sequelize.transaction();

        const user = req.user;
        const userId = user.userId;
        const unitId = user.currentUnitId;

        if (!unitId) {
            throw new UnitNotFoundError();
        }

        const { inventory } = req.body;

        if (!Array.isArray(inventory)) {
            throw new DataFormatError();
        }

        // 유저 기존 아이템 테이블 데이터 삭제
        await InventoryItem.destroy({
            where: { unitId },
            transaction,
        });

        const rows = [];

        for (const item of inventory) {
            rows.push({
                userId,
                unitId,
                itemDataId: item.itemDataId,
                slotIndex: item.slotIndex,
                amount: item.amount,
                enhanceLevel: item.enhanceLevel,
                isEquipped: item.isEquipped,
                quickSlotIndex: item.quickSlotIndex
            });
        }

        // 새로운 데이터로 생성
        if (rows.length > 0) {
            await InventoryItem.bulkCreate(rows, { transaction });
        }

        await transaction.commit();

        return res.status(200).json({});
    } catch (err) {
        console.log(err);
        if (transaction) await transaction.rollback();

        return next(err);
    }
}

// 스킬 데이터 조회
async function getSkillData(req, res, next) {
    try {
        const user = req.user;
        const unitId = user.currentUnitId;

        // 존재하는 유닛인지 확인
        if (!unitId) {
            throw new UnitNotFoundError();
        }

        // 스킬 데이터 SO id와 스킬 레벨 조회
        const skillData = await Skill.findAll({
            where: { unitId },
            attributes: ['skillDataId', 'skillLevel'],
        });

        // 스킬 슬롯 정보 조회
        const slotData = await SkillSlot.findAll({
            where: { unitId },
            attributes: ['slotIndex', 'skillDataId'],
            order: [['slotIndex', 'ASC']],
        });

        // DTO
        const skills = [];

        for (const data of skillData) {
            skills.push({
                skillDataId: data.skillDataId,
                level: data.skillLevel,
            });
        }

        // DTO
        const slots = [];

        for(const data of slotData) {
            slots.push({
                skillDataId: data.skillDataId,
                slotIndex: data.slotIndex,
            })
        }

        return res.status(200).json({skills, slots});
    } catch (err) {
        return next(err);
    }
}

// 스킬 정보 저장
async function saveSkillData(req, res, next) {
    let transaction;
    try {
        // 트랜잭션 시작
        transaction = await sequelize.transaction();

        const user = req.user;
        const unitId = user.currentUnitId;

        if (!unitId) {
            throw new UnitNotFoundError();
        }

        const { skills, slots } = req.body;

        if (!Array.isArray(skills) || !Array.isArray(slots)) {
            throw new DataFormatError();
        }

        // 기존 스킬 데이터 삭제
        await Skill.destroy({
            where: { unitId },
            transaction,
        });

        // 기존 슬롯 데이터 삭제
        await SkillSlot.destroy({
            where: { unitId },
            transaction,
        });

         // 스킬 레벨 저장
        if (skills.length > 0) {
            const skillData = skills.map(skill => ({
                unitId,
                skillDataId: skill.skillDataId,
                skillLevel: skill.level,
            }));

            await Skill.bulkCreate(skillData, { transaction });
        }

        // 슬롯 정보 저장
        if (slots.length > 0) {
            const slotData = slots.map(slot => ({
                unitId,
                skillDataId: slot.skillDataId,
                slotIndex: slot.slotIndex,
            }));

            await SkillSlot.bulkCreate(slotData, { transaction });
        }

        await transaction.commit();

        return res.status(200).json({});
    } catch (err) {
        console.log(err);
        if (transaction) await transaction.rollback();

        return next(err);
    }
}

module.exports = {
    enterGame,
    saveUnitData,
    getItemData,
    saveItemData,
    getSkillData,
    saveSkillData,
};