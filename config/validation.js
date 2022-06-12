const Joi = require("joi"); // for schema object validation

//register  validation

const registerValidation = (input) => {
  const regSchema = Joi.object({
    username: Joi.string().max(255).required(),
    email: Joi.string().min(6).max(255).email(),
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      )
      .required(),
  });

  return regSchema.validate(input);
};
module.exports.registerValidation = registerValidation;

const loginValidation = (input) => {
  const loginSchema = Joi.object({
    email: Joi.string().min(6).max(255).email(),
    password: Joi.string()
      .pattern(
        new RegExp(
          "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
        )
      )
      .required(),
  });

  return loginSchema.validate(input);
};
module.exports.loginValidation = loginValidation;
