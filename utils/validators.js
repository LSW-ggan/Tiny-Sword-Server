/* eslint-disable newline-per-chained-call */
const Joi = require("Joi");
const moment = require("moment");

const validator = (schema) => (payload) =>
    schema.validate(payload, { abortEarly: false });


const joinSchema = Joi.object({
    userId: Joi.number(),
    email: Joi.string().email().min(5).max(40),
    password: Joi.string().min(5).max(100),
});

const passwordSchema = Joi.object({
    currentPassword: Joi.string().max(100).required(),
    newPassword: Joi.string().min(10).max(100).required(),
    newPasswordCheck: Joi.string().min(10).max(100).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().min(1).max(40).required(),
    password: Joi.string().min(1).max(100).required(),
});

const checkEmailSchema = Joi.object({
    email: Joi.string().email().min(5).max(40).required(),
})

module.exports = {
    validateJoinSchema: validator(joinSchema),
    validatePasswordSchema: validator(passwordSchema),
    validateLoginSchema: validator(loginSchema),
    validateEmailSchema: validator(checkEmailSchema),
};