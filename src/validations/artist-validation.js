const { Joi, validate } = require("express-validation");

// Validation
const addArtistValidation = validate(
    {
        body: Joi.object({
            name: Joi.string().trim().min(1).required().messages({
                "string.min": "Artist name must have at least 1 character.",
                "string.empty": "Artist name cannot be empty.",
                "any.required": "Artist name is required.",
            }),
            grammy: Joi.number().integer().min(0).optional().messages({
                "number.base": "Grammy count must be a number.",
                "number.min": "Grammy count cannot be negative.",
            }),
            hidden: Joi.boolean().optional().messages({
                "boolean.base": "Hidden must be a boolean value.",
            }),
        }),
    },
    { keyByField: true }
);


module.exports = {
    addArtistValidation,
};
