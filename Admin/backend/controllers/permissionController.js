const pool = require("../config/database");

const getPermissions = async (req, res) => {
    try {

        const role_id = req.user.role_id;

        const result = await pool.query(
            "SELECT * FROM permissions WHERE role_id = $1",
            [role_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Permission tidak ditemukan"
            });
        }

        res.json({
            success: true,
            permissions: result.rows[0]
        });

    } catch (err) {

        res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

module.exports = {
    getPermissions
};