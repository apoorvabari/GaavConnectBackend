const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

/* ───────────── helpers ───────────── */

const generateToken = (user) =>
    jwt.sign(
        { id: user.id, userType: user.user_type },
        process.env.JWT_SECRET || 'super_secret_fallback_key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

/* ═══════════════════════════════════════════
   REGISTER
   POST /api/auth/register
═══════════════════════════════════════════ */

const register = async (userData) => {

    const {
        fullName,
        mobile,
        email,
        address,
        pincode,
        state,
        profession,
        userType,
        password
    } = userData;

    /* ── 1. duplicate checks ── */

    const emailRows = await User.findByEmail(email);
    if (emailRows.length > 0)
        throw Object.assign(new Error('Email is already registered'), { statusCode: 409 });

    const mobileRows = await User.findByMobile(mobile);
    if (mobileRows.length > 0)
        throw Object.assign(new Error('Mobile number is already registered'), { statusCode: 409 });

    /* ── 2. hash password ── */

    const hashedPassword = await bcrypt.hash(password, 12);

    /* ── 3. insert user ── */

    const { insertId } = await User.create({
        fullName,
        mobile,
        email,
        address,
        pincode,
        state,
        profession,
        userType,
        password: hashedPassword
    });

    /* ── 4. fetch newly created user ── */

    const rows   = await User.findById(insertId);
    const newUser = rows[0];

    /* ── 5. generate JWT ── */

    const token = generateToken(newUser);

    return { user: newUser, token };
};

/* ═══════════════════════════════════════════
   LOGIN
   POST /api/auth/login
═══════════════════════════════════════════ */

const login = async (emailOrMobile, password) => {

    /* ── 1. find user ── */

    const rows = await User.findByEmailOrMobile(emailOrMobile);
    if (rows.length === 0)
        throw Object.assign(new Error('User not found'), { statusCode: 404 });

    const user = rows[0];

    /* ── 2. check account status ── */

    if (user.status !== 'active')
        throw Object.assign(new Error('Account is inactive or suspended'), { statusCode: 403 });

    /* ── 3. verify password ── */

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
        throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });

    /* ── 4. generate token ── */

    const token = generateToken(user);

    /* ── 5. return safe user object (no password) ── */

    const userResponse = {
        id:         user.id,
        fullName:   user.full_name,
        mobile:     user.mobile,
        email:      user.email,
        address:    user.address,
        pincode:    user.pincode,
        state:      user.state,
        profession: user.profession,
        userType:   user.user_type,
        status:     user.status,
        createdAt:  user.created_at,
        updatedAt:  user.updated_at
    };

    return { user: userResponse, token };
};

/* ═══════════════════════════════════════════
   FORGET PASSWORD
   POST /api/auth/forget-password
═══════════════════════════════════════════ */

const forgetPassword = async (emailOrMobile, newPassword) => {

    /* ── 1. find user ── */
    const rows = await User.findByEmailOrMobile(emailOrMobile);
    if (rows.length === 0)
        throw Object.assign(new Error('User not found'), { statusCode: 404 });

    const user = rows[0];

    /* ── 2. hash new password ── */
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    /* ── 3. update password ── */
    const updated = await User.updatePassword(user.id, hashedPassword);
    if (!updated)
        throw Object.assign(new Error('Failed to update password'), { statusCode: 500 });

    return { message: 'Password updated successfully' };
};

module.exports = { register, login, forgetPassword };

