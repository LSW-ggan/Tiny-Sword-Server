const express = require('express');

const auth = require('./auth');
const game = require('./game');
const { verifyToken } = require('../middleware/token');

const router = express.Router();

router.use('/auth', auth);

router.use('/game', verifyToken, game);

module.exports = router;