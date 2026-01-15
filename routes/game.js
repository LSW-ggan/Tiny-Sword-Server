const express = require('express');

const {
    enterGame, saveUnitData, 
    getItemData, saveItemData,
    getSkillData, saveSkillData,
} = require('../controllers/game');

const router = express.Router();

router.get('/enter', enterGame);
router.post('/unit/save', saveUnitData);

router.get('/inventory', getItemData);
router.post('/inventory/save', saveItemData);

router.get('/skill', getSkillData);
router.post('/skill/save', saveSkillData);

module.exports = router;