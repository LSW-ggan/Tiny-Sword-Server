const express = require('express');

const {
    join, login, checkEmail,
} = require('../controllers/auth');

const {
    createToken, verifyToken, renewToken,
} = require('../middleware/token');

const router = express.Router();

router.post('/join', join);
router.post('/login', login, createToken);
router.post('/check-email', checkEmail);
router.get('/token/refresh', renewToken);
router.get('/token/verify', verifyToken, (req, res) => res.status(200).end());

module.exports = router;