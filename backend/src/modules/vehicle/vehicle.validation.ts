import Joi from 'joi';

export const vehicleValidation = {
  create: Joi.object({
    make: Joi.string().required(),
    model: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().positive().required(),
    quantity: Joi.number().integer().min(0).required(),
    imageUrl: Joi.string().uri().allow('', null).optional()
  }).options({ stripUnknown: false, allowUnknown: false, abortEarly: false }),

  search: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(20),
    make: Joi.string().optional(),
    model: Joi.string().optional(),
    category: Joi.string().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
  }).custom((obj, helpers) => {
    if (obj.minPrice !== undefined && obj.maxPrice !== undefined && obj.minPrice > obj.maxPrice) {
      return helpers.message({ custom: 'minPrice cannot be greater than maxPrice' } as any);
    }
    return obj;
  }),

  update: Joi.object({
    make: Joi.string().optional(),
    model: Joi.string().optional(),
    category: Joi.string().optional(),
    price: Joi.number().positive().optional(),
    quantity: Joi.number().integer().min(0).optional(),
    imageUrl: Joi.string().uri().allow('', null).optional()
  }).options({ stripUnknown: false, allowUnknown: false, abortEarly: false })
};
