const bcrypt = require('bcrypt');
const { sequelize } = require('../models/index');

// Model
const User = require('../models/user');

// Error
const {
    ApiError, DataFormatError,
    DuplicateEmailError,
    InvalidIdPasswordError,
} = require('../errors');

// Validator
const {
    validateLoginSchema, validateJoinSchema, validateEmailSchema,
} = require('../utils/validators');

// 회원 가입
async function join(req, res, next) {
    let transaction;
    try {
        transaction = await sequelize.transaction();

        // 회원 가입 양식 확인
        const { error: bodyError } = validateJoinSchema(req.body);
        if (bodyError) {
            throw new DataFormatError();
        }

        // 정보 받아오기
        const { email, password } = req.body;

        // 해당 이메일의 계정이 기존에 존재하는지 확인
        if (email) {
            const user = await User.findOne({ where: { email } });
            if (user) {
                throw new DuplicateEmailError();
            }
        }

        // 이메일과 패스워드 모두 입력했다면 회원가입 처리
        if (email && password) {
            const hash = await bcrypt.hash(password, 12);

            req.user = await User.create({
                email,
                password: hash,
            }, { transaction });


            await transaction.commit();
        }
        return res.status(200).send({ message: "join success" });
    } catch (err) {
        if(transaction) await transaction.rollback();
        return next(err);
    }
}

// 이메일 중복확인
async function checkEmail(req, res, next) {
    try {
        // 이메일 양식 확인
        const { error: bodyError } = validateEmailSchema(req.body);
        if (bodyError) {
            throw new DataFormatError();
        }

        const { email } = req.body;
        if (!email) {
            throw new DataFormatError();
        }
        else {
            // 중복 확인
            const user = await User.findOne({ where: { email } });
            if (user) {
                throw new DuplicateEmailError();
            }
        }

        return res.status(200).send({ message: "available email" });
    } catch (err) {
        return next(err);
    }
}

// 로그인
async function login(req, res, next) {
    try {
        // 로그인 양식 확인
        const { error: bodyError } = validateLoginSchema(req.body);
        if (bodyError) {
            throw (new DataFormatError());
        }

        const { email, password } = req.body;

        // 아이디 확인
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw (new InvalidIdPasswordError());
        }

        // 패스워드 확인
        const result = await bcrypt.compare(password, user.password);
        if (result) {
            req.user = user;
            return next();
        }

        throw (new InvalidIdPasswordError());
    } catch (err) {
        console.log(err);
        return next(err);
    }
}

module.exports = {
    join,
    checkEmail,
    login,
};