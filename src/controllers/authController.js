const authService = require('../services/authService');
const ApiResponse = require('../utils/apiResponse');

/* ═══════════════════════════════════════════
   REGISTER  –  POST /api/auth/register
═══════════════════════════════════════════ */

const register = async (req, res, next) => {
    try {
        const { user, token } = await authService.register(req.body);

        return ApiResponse.success(res, {
            statusCode: 201,
            message: 'Registration successful',
            data: { user, token }
        });

    } catch (error) {
        if (error.statusCode) {
            return ApiResponse.error(res, {
                statusCode: error.statusCode,
                message: error.message
            });
        }
        next(error);
    }
};

/* ═══════════════════════════════════════════
   LOGIN  –  POST /api/auth/login
═══════════════════════════════════════════ */

const login = async (req, res, next) => {
    try {
        const { email, mobile, emailOrMobile, password } = req.body;
        const identifier = email || mobile || emailOrMobile;

        const { user, token } = await authService.login(identifier, password);

        return ApiResponse.success(res, {
            statusCode: 200,
            message: 'Login successful',
            data: { user, token }
        });

    } catch (error) {
        if (error.statusCode) {
            return ApiResponse.error(res, {
                statusCode: error.statusCode,
                message: error.message
            });
        }
        next(error);
    }
};

/* ═══════════════════════════════════════════
   FORGET PASSWORD  –  POST /api/auth/forget-password
═══════════════════════════════════════════ */

const forgetPassword = async (req, res, next) => {
    try {
        const { email, mobile, emailOrMobile, password } = req.body;
        const identifier = email || mobile || emailOrMobile;

        const result = await authService.forgetPassword(identifier, password);

        return ApiResponse.success(res, {
            statusCode: 200,
            message: result.message
        });

    } catch (error) {
        if (error.statusCode) {
            return ApiResponse.error(res, {
                statusCode: error.statusCode,
                message: error.message
            });
        }
        next(error);
    }
};
/* ═══════════════════════════════════════════
   LOGOUT  –  POST /api/auth/logout
═══════════════════════════════════════════ */

const logout = async (req, res, next) => {
    try {
        return ApiResponse.success(res, {
            statusCode: 200,
            message: 'successfully logout'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, forgetPassword, logout };
