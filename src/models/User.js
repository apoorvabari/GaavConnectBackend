const pool = require('../config/db').promise();

const User = {

    /* ========================== CREATE ========================== */

    create: async function (userData) {
        const sql = `
            INSERT INTO users
                (full_name, mobile, email, address, pincode,
                 state, profession, password, user_type, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        `;

        const values = [
            userData.fullName,
            userData.mobile,
            userData.email,
            userData.address,
            userData.pincode,
            userData.state,
            userData.profession,
            userData.password,
            userData.userType
        ];

        const [result] = await pool.query(sql, values);
        return { insertId: result.insertId };
    },

    /* ========================== FIND ========================== */

    findById: async function (id) {
        const sql = `
            SELECT
                id,
                full_name,
                mobile,
                email,
                address,
                pincode,
                state,
                profession,
                user_type,
                status,
                created_at,
                updated_at
            FROM users
            WHERE id = ?
            LIMIT 1
        `;
        const [rows] = await pool.query(sql, [id]);
        return rows;
    },

    findByEmail: async function (email) {
        const sql = `SELECT * FROM users WHERE email = ? LIMIT 1`;
        const [rows] = await pool.query(sql, [email]);
        return rows;
    },

    findByMobile: async function (mobile) {
        const sql = `SELECT * FROM users WHERE mobile = ? LIMIT 1`;
        const [rows] = await pool.query(sql, [mobile]);
        return rows;
    },

    findByEmailOrMobile: async function (identifier) {
        const sql = `
            SELECT * FROM users
            WHERE email = ? OR mobile = ?
            LIMIT 1
        `;
        const [rows] = await pool.query(sql, [identifier, identifier]);
        return rows;
    },

    /* ========================== UPDATE ========================== */

    updatePassword: async function (id, hashedPassword) {
        const sql = `UPDATE users SET password = ? WHERE id = ?`;
        const [result] = await pool.query(sql, [hashedPassword, id]);
        return result.affectedRows > 0;
    }
};

module.exports = User;

