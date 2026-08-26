const { body, validationResult } = require('express-validator');
const ApiResponse = require('../utils/apiResponse');

/* ────────────────── shared helpers ────────────────── */

const isMobile = (v) => /^[6-9]\d{9}$/.test(v);
const isEmail  = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/** Runs after all body() chains; returns 422 on any errors */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ApiResponse.error(res, {
            statusCode: 422,
            message: 'Validation failed',
            errors: errors.array().map((e) => ({ field: e.path, message: e.msg }))
        });
    }
    next();
};

/* ────────────────── register validator ────────────────── */

const registerValidator = [

    body('fullName')
        .trim()
        .notEmpty().withMessage('Full name is required'),

    body('mobile')
        .trim()
        .notEmpty().withMessage('Mobile number is required')
        .custom((v) => {
            if (!isMobile(v)) throw new Error('Enter a valid 10-digit Indian mobile number');
            return true;
        }),

    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Enter a valid email address')
        .normalizeEmail(),

    body('address')
        .trim()
        .notEmpty().withMessage('Address is required'),

    body('pincode')
        .trim()
        .notEmpty().withMessage('Pincode is required')
        .isLength({ min: 6, max: 6 }).withMessage('Pincode must be exactly 6 digits')
        .isNumeric().withMessage('Pincode must contain only numbers'),

    body('state')
        .trim()
        .notEmpty().withMessage('State is required'),

    body('profession')
        .trim()
        .notEmpty().withMessage('Profession is required'),

    body('userType')
        .trim()
        .notEmpty().withMessage('User type is required')
        .isIn(['gavkari', 'sarpanch'])
        .withMessage("User type must be 'gavkari' or 'sarpanch'"),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

    body('confirmPassword')
        .notEmpty().withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) throw new Error('Passwords do not match');
            return true;
        }),

    handleValidationErrors
];

/* ────────────────── login validator ────────────────── */

const loginValidator = [

    body('emailOrMobile')
        .trim()
        .notEmpty().withMessage('Email or mobile number is required')
        .custom((v) => {
            if (!isEmail(v) && !isMobile(v))
                throw new Error('Provide a valid email address or 10-digit mobile number');
            return true;
        }),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

    handleValidationErrors
];

/* ────────────────── forget password validator ────────────────── */

const forgetPasswordValidator = [

    body('emailOrMobile')
        .trim()
        .notEmpty().withMessage('Email or mobile number is required')
        .custom((v) => {
            if (!isEmail(v) && !isMobile(v))
                throw new Error('Provide a valid email address or 10-digit mobile number');
            return true;
        }),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),

    body('confirmpassword')
        .notEmpty().withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) throw new Error('Passwords do not match');
            return true;
        }),

    handleValidationErrors
];

module.exports = { registerValidator, loginValidator, forgetPasswordValidator };

