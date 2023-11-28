const Joi = require("joi");

const ValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.alternatives()
    .try(
      Joi.string().pattern(/^\d{10}$/),
      Joi.string().pattern(/^\(\d{3}\)\d{3}-\d{2}-\d{2}$/),
      Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{2}-\d{2}$/),
      Joi.string().pattern(/^\(\d{3}\)-\d{3}-\d{2}-\d{2}$/),
      Joi.string().pattern(/^\d{3} \d{3}-\d{2}-\d{2}$/),
      Joi.string().pattern(/^\d{3}-\d{3}-\d{2}-\d{2}$/),
      Joi.string().pattern(/^\(\d{3}\)\d{3}-\d{4}$/),
      Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
      Joi.string().pattern(/^\(\d{3}\)-\d{3}-\d{4}$/),
      Joi.string().pattern(/^\(\d{3}\)\d{7}$/),
      Joi.string().pattern(/^\(\d{3}\) \d{7}$/),
      Joi.string().pattern(/^\(\d{3}\)-\d{7}$/),
      Joi.string().pattern(/^\d{3} \d{7}$/),
      Joi.string().pattern(/^\d{3}-\d{7}$/),
    )
    .required(),

});

const PatchSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.alternatives().try(
    Joi.string().pattern(/^\d{10}$/),
    Joi.string().pattern(/^\(\d{3}\)\d{3}-\d{2}-\d{2}$/),
    Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{2}-\d{2}$/),
    Joi.string().pattern(/^\(\d{3}\)-\d{3}-\d{2}-\d{2}$/),
    Joi.string().pattern(/^\d{3} \d{3}-\d{2}-\d{2}$/),
    Joi.string().pattern(/^\d{3}-\d{3}-\d{2}-\d{2}$/),
    Joi.string().pattern(/^\(\d{3}\)\d{3}-\d{4}$/),
    Joi.string().pattern(/^\(\d{3}\) \d{3}-\d{4}$/),
    Joi.string().pattern(/^\(\d{3}\)-\d{3}-\d{4}$/),
    Joi.string().pattern(/^\(\d{3}\)\d{7}$/),
    Joi.string().pattern(/^\(\d{3}\) \d{7}$/),
    Joi.string().pattern(/^\(\d{3}\)-\d{7}$/),
    Joi.string().pattern(/^\d{3} \d{7}$/),
    Joi.string().pattern(/^\d{3}-\d{7}$/),
  ),
  favorite: Joi.boolean(),
});
const registrationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});


module.exports = {
  ValidationSchema,
  PatchSchema,
  registrationSchema
};