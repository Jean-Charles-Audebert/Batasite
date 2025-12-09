const Joi = require('joi');

/**
 * Schéma de validation pour la création d'admin
 */
const adminCreateSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(8).max(128).required(),
});

/**
 * Schéma de validation pour la mise à jour d'admin (activation/désactivation)
 */
const adminUpdateSchema = Joi.object({
  is_active: Joi.boolean().strict().required(),
});

/**
 * Schéma de validation pour la mise à jour du contenu
 */
const contentUpdateSchema = Joi.object({
  data: Joi.object().required(),
});

/**
 * Schéma de validation pour le login
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
});

/**
 * Valide les données selon un schéma
 * @param {object} schema - Schéma Joi
 * @param {object} data - Données à valider
 * @returns {object} { value, error }
 */
const validate = (schema, data) => {
  return schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  });
};

module.exports = {
  adminCreateSchema,
  adminUpdateSchema,
  contentUpdateSchema,
  loginSchema,
  validate,
};
