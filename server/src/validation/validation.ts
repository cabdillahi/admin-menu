import Joi from "joi";

export const tenantCreateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9+\-() ]{7,20}$/)
    .required(),
  address: Joi.string().max(255).required(),
  country: Joi.string().max(50).optional(),
  subdomain: Joi.string().alphanum().min(3).max(30).required(),
  website: Joi.string().min(3).max(30).optional(),
  logo: Joi.string().alphanum().min(3).max(30).optional(),
  city: Joi.string().max(50).optional(),
  currency: Joi.string().max(50).optional(),
});
