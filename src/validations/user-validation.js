const { Joi, validate } = require("express-validation");
const { Enums } = require('../utils/common');
const { ADMIN, VIEWER, EDITOR } = Enums.ROLE_NAME;

// Validation
const signupValidation = validate(
    {
        body: Joi.object({
            email: Joi.string().trim().email().required().messages({
                "string.email": "Invalid email address.",
                "string.empty": "Email cannot be empty.",
                "any.required": "Email is required.",
            }),
            password: Joi.string()
                .trim()
                .min(8)
                .required()
                .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/)
                .messages({
                    "string.min": "Password must be at least 8 characters long.",
                    "string.pattern.base":
                        "Password must include at least one uppercase letter, one number, and one special character.",
                    "string.empty": "Password cannot be empty.",
                    "any.required": "Password is required.",
                }),
            org_name: Joi.string().trim().min(1).required().messages({
                "string.min": "Organization name must have at least 1 character.",
                "string.empty": "Organization name cannot be empty.",
                "any.required": "Organization name is required.",
            }),
        }),
    },
    { keyByField: true }
);

const loginValidation = validate(
    {
        body: Joi.object({
            email: Joi.string().trim().email().required().messages({
                "string.email": "Invalid email address.",
                "string.empty": "Email cannot be empty.",
                "any.required": "Email is required.",
            }),
            password: Joi.string().trim().required().messages({
                "string.empty": "Password cannot be empty.",
                "any.required": "Password is required.",
            }),
        }),
    },
    { keyByField: true }
);

const addUserValidation = validate(
    {
        body: Joi.object({
            email: Joi.string().trim().email().required().messages({
                "string.email": "Invalid email address.",
                "string.empty": "Email cannot be empty.",
                "any.required": "Email is required.",
            }),
            password: Joi.string().trim().required().messages({
                "string.empty": "Password cannot be empty.",
                "any.required": "Password is required.",
            }),
            role: Joi.string().trim().required().valid(VIEWER, EDITOR).messages({
                "string.empty": "Role cannot be empty.",
                "any.required": "Role is required.",
            }),
        }),
    },
    { keyByField: true }
);

const updatePasswordValidation = validate(
    {
        body: Joi.object({
            old_password: Joi.string()
                .trim()
                .min(8)
                .required()
                .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/)
                .messages({
                    "string.min": "Old password must be at least 8 characters long.",
                    "string.pattern.base":
                        "Old password must include at least one uppercase letter, one number, and one special character.",
                    "string.empty": "Old password cannot be empty.",
                    "any.required": "Old password is required.",
                }),
            new_password: Joi.string()
                .trim()
                .min(8)
                .required()
                .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])/)
                .messages({
                    "string.min": "New password must be at least 8 characters long.",
                    "string.pattern.base":
                        "New password must include at least one uppercase letter, one number, and one special character.",
                    "string.empty": "New password cannot be empty.",
                    "any.required": "New password is required.",
                }),
        }),
    },
    { keyByField: true }
);

// Export validations
module.exports = {
    signupValidation,
    loginValidation,
    addUserValidation,
    updatePasswordValidation,
};
