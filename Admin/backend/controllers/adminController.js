const pool = require("../config/database");

const getAdmins = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                admins.id,
                admins.full_name,
                admins.email,
                admins.phone,
                admins.status,
                roles.role_name
            FROM admins
            JOIN roles
            ON admins.role_id = roles.id
            ORDER BY admins.id ASC
        `);

        res.json({
            success: true,
            admins: result.rows
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

module.exports = {
    getAdmins
};