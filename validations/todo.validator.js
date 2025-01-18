const Joi = require ('joi');

const loginValidation = Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
});

const signupValidation = Joi.object().keys({
    username: Joi.string().required().alphanum().min(3),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{3,20}$'))
})

module.exports = {
    loginValidation,
    signupValidation
}