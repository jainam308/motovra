import Joi from 'joi';

export const vehicleValidation = {
  create: Joi.object({
    make: Joi.string().required(),
    model: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required()
  }).options({ stripUnknown: false, allowUnknown: false, abortEarly: false })
};
