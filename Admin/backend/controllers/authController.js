const pool = require("../config/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// =========================
// Setup Super Admin
// =========================
const setupAdmin = async (req, res) => {
    try {

        const { full_name, email, password, phone } = req.body;

        // Cek apakah email sudah ada
        const check = await pool.query(

            "SELECT id FROM admins WHERE email=$1",

            [email]

        );

        if (check.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email sudah digunakan."
            });
        }

        // Hash password
        const hash = await bcrypt.hash(password, 10);

        // Simpan admin
        await pool.query(
            `INSERT INTO admins
            (full_name, email, password_hash, phone, status, role_id)
            VALUES ($1,$2,$3,$4,$5,$6)`,
            [
                full_name,
                email,
                hash,
                phone,
                "Aktif",
                1
            ]
        );

        return res.json({
            success: true,
            message: "Super Admin berhasil dibuat."
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// ===============================
// REGISTER ADMIN BARU
// ===============================
const registerAdmin = async (req, res) => {

    try {

        const {
            full_name,
            email,
            phone,
            password
        } = req.body;

        // Validasi data kosong
        if (!full_name || !email || !phone || !password) {

            return res.status(400).json({
                success: false,
                message: "Semua data wajib diisi."
            });

        }

        // Cek email
        const checkEmail = await pool.query(

            "SELECT id FROM admins WHERE email=$1",

            [email]

        );

        if (checkEmail.rows.length > 0) {

            return res.status(400).json({

                success: false,

                message: "Email sudah terdaftar."

            });

        }

        // Hash Password
        const password_hash = await bcrypt.hash(password, 10);

        // Simpan ke database
        await pool.query(

            `INSERT INTO admins
            (
                full_name,
                email,
                password_hash,
                phone,
                status,
                role_id
            )

            VALUES

            ($1,$2,$3,$4,$5,$6)`,

            [

                full_name,

                email,

                password_hash,

                phone,

                "Pending",

                null

            ]

        );

        res.json({

            success: true,

            message: "Pendaftaran berhasil. Tunggu persetujuan Super Admin."

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =========================
// Login Admin
// =========================
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Cari admin berdasarkan email
        const result = await pool.query(

            `
SELECT

    a.*,

    r.role_name,

    p.dashboard,

    p.pembayaran,

    p.withdraw,

    p.voucher,

    p.merchant,

    p.banner,

    p.pengaturan,

    p.admin

FROM admins a

LEFT JOIN roles r
ON a.role_id = r.id

LEFT JOIN permissions p
ON a.role_id = p.role_id

WHERE a.email = $1

`,

            [email]

        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Email tidak ditemukan."
            });
        }

        const admin = result.rows[0];

        // =====================================
        // CEK STATUS ADMIN
        // =====================================

        if (admin.status === "Pending") {

            return res.status(403).json({

                success: false,

                message: "Akun Anda masih menunggu persetujuan Super Admin. whatsapp 081242347274"

            });

        }

        if (admin.status === "Rejected") {

            return res.status(403).json({

                success: false,

                message: "Pendaftaran Anda ditolak."

            });

        }

        if (admin.status === "Suspend") {

            return res.status(403).json({

                success: false,

                message: "Akun Anda sedang disuspend. Hubungi Super Admin. whatsapp 081242347274"

            });

        }

        if (admin.status === "Nonaktif") {

            return res.status(403).json({

                success: false,

                message: "Akun Anda sudah dinonaktifkan."

            });

        }

        // Cocokkan password
        const cocok = await bcrypt.compare(
            password,
            admin.password_hash
        );

        if (!cocok) {
            return res.status(401).json({
                success: false,
                message: "Password salah."
            });
        }

        // Buat Token
        const token = jwt.sign(
            {
                id: admin.id,
                role_id: admin.role_id
            },
            "GOCES_SECRET",
            {
                expiresIn: "1d"
            }
        );

        res.json({

            success: true,

            message: "Login berhasil.",

            token,

            admin: {

                id: admin.id,

                full_name: admin.full_name,

                email: admin.email,

                phone: admin.phone,

                role_id: admin.role_id,

                role_name: admin.role_name,

                permissions: {

                    dashboard: admin.dashboard,

                    pembayaran: admin.pembayaran,

                    withdraw: admin.withdraw,

                    voucher: admin.voucher,

                    merchant: admin.merchant,

                    banner: admin.banner,

                    pengaturan: admin.pengaturan,

                    admin: admin.admin

                }

            }

        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

// =====================================
// DAFTAR ADMIN PENDING
// =====================================
const getPendingAdmins = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                full_name,
                email,
                phone,
                status,
                created_at
            FROM admins
            WHERE status = 'Pending'
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            admins: result.rows
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// =====================================
// DETAIL ADMIN
// =====================================
const getAdminById = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(

            `SELECT

                a.id,

                a.full_name,

                a.email,

                a.phone,

                a.status,

                a.role_id,

                r.role_name

            FROM admins a

            LEFT JOIN roles r
            ON a.role_id = r.id

            WHERE a.id=$1`,

            [id]

        );

        if (result.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Admin tidak ditemukan."

            });

        }

        res.json({

            success: true,

            admin: result.rows[0]

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =====================================
// UPDATE ADMIN
// =====================================
const updateAdmin = async (req, res) => {

    try {

        const { id } = req.params;

        // =====================================
        // CEK TARGET ADMIN
        // =====================================

        const adminResult = await pool.query(

            `SELECT
        id,
        role_id,
        status
     FROM admins
     WHERE id=$1`,

            [id]

        );

        if (adminResult.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Admin tidak ditemukan."

            });

        }

        // =====================================
        // SUPER ADMIN TIDAK BOLEH DIUBAH
        // =====================================

        if (adminResult.rows[0].role_id == 1) {

            return res.status(403).json({

                success: false,

                message: "Role dan status Super Admin tidak dapat diubah."

            });

        }

        const {

            role_id,

            status

        } = req.body;

        const result = await pool.query(

            `

UPDATE admins

SET

role_id=$1,

status=$2,

updated_at=NOW()

WHERE id=$3

RETURNING id,status,role_id

`,

            [

                role_id,

                status,

                id

            ]

        );

        res.json({

            success: true,

            message: "Data admin berhasil diperbarui.",

            admin: result.rows[0]

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =====================================
// APPROVE ADMIN
// =====================================
const approveAdmin = async (req, res) => {

    try {

        const { id } = req.params;
        const { role_id } = req.body;

        // Validasi role
        if (!role_id) {
            return res.status(400).json({
                success: false,
                message: "Role harus dipilih."
            });
        }

        // Cek apakah admin ada
        const check = await pool.query(
            "SELECT * FROM admins WHERE id=$1",
            [id]
        );

        if (check.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin tidak ditemukan."
            });
        }

        // Update status & role
        await pool.query(
            `UPDATE admins
             SET
                status='Aktif',
                role_id=$1,
                updated_at=NOW()
             WHERE id=$2`,
            [role_id, id]
        );

        res.json({
            success: true,
            message: "Admin berhasil di-approve."
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// =====================================
// REJECT ADMIN
// =====================================
const rejectAdmin = async (req, res) => {

    try {

        const { id } = req.params;

        const check = await pool.query(

            "SELECT id FROM admins WHERE id=$1",

            [id]

        );

        if (check.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Admin tidak ditemukan."

            });

        }

        await pool.query(

            `
            UPDATE admins
            SET
                status='Rejected',
                updated_at=NOW()
            WHERE id=$1
            `,

            [id]

        );

        res.json({

            success: true,

            message: "Permintaan admin berhasil ditolak."

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =====================================
// GET ROLES
// =====================================
const getRoles = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                role_name
            FROM roles
            ORDER BY id ASC
        `);

        res.json({
            success: true,
            roles: result.rows
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// =====================================
// GET PERMISSIONS BY ROLE
// =====================================
const getPermissionsByRole = async (req, res) => {

    try {

        const { role_id } = req.params;

        const result = await pool.query(
            `
            SELECT
    dashboard,
    pembayaran,
    withdraw,
    voucher,
    merchant,
    banner,
    pengaturan,
    admin
FROM permissions
            WHERE role_id = $1
            `,
            [role_id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Permission tidak ditemukan."
            });

        }

        res.json({

            success: true,

            permissions: result.rows[0]

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =====================================
// UPDATE PERMISSIONS
// =====================================
const updatePermissions = async (req, res) => {

    try {

        const { role_id } = req.params;

        const {

            dashboard,

            pembayaran,

            withdraw,

            voucher,

            merchant,

            banner,

            pengaturan,

            admin

        } = req.body;

        await pool.query(

            `
    UPDATE permissions

    SET

        dashboard = $1,

        pembayaran = $2,

        withdraw = $3,

        voucher = $4,

        merchant = $5,

        banner = $6,

        pengaturan = $7,

        admin = $8

    WHERE role_id = $9
    `,

            [

                dashboard,

                pembayaran,

                withdraw,

                voucher,

                merchant,

                banner,

                pengaturan,

                admin,

                role_id

            ]

        );

        res.json({

            success: true,

            message: "Hak akses berhasil diperbarui."

        });

    } catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =====================================
// RESET PASSWORD ADMIN
// =====================================
const resetAdminPassword = async (req, res) => {

    try {

        const { id } = req.params;

        const { password } = req.body;

        if (!password) {

            return res.status(400).json({

                success: false,

                message: "Password baru wajib diisi."

            });

        }

        // Cek admin
        const check = await pool.query(

            "SELECT id, role_id FROM admins WHERE id=$1",

            [id]

        );

        if (check.rows.length === 0) {

            return res.status(404).json({

                success: false,

                message: "Admin tidak ditemukan."

            });

        }

        // Hash password baru
        const hash = await bcrypt.hash(password, 10);

        await pool.query(

            `UPDATE admins

            SET

                password_hash=$1,

                updated_at=NOW()

            WHERE id=$2`,

            [

                hash,

                id

            ]

        );

        res.json({

            success: true,

            message: "Password admin berhasil direset."

        });

    }

    catch (err) {

        console.log(err);

        res.status(500).json({

            success: false,

            message: err.message

        });

    }

};

// =========================
// Export
// =========================
module.exports = {
    setupAdmin,
    loginAdmin,
    registerAdmin,
    getPendingAdmins,
    approveAdmin,
    rejectAdmin,
    getAdminById,
    updateAdmin,
    getRoles,
    getPermissionsByRole,
    updatePermissions,
    resetAdminPassword
};