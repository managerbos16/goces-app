const pool = require("../config/database");
const {
    success,
    error
} = require("../utils/response");
const {
    buildOwnershipInsert
} = require("../services/dataScopeService");

// =====================================
// GENERATE MERCHANT CODE
// =====================================

async function generateMerchantCode() {

    const result = await pool.query(

        `
        SELECT id
        FROM merchants
        ORDER BY id DESC
        LIMIT 1
        `

    );

    let nextNumber = 1;

    if (result.rows.length > 0) {

        nextNumber = result.rows[0].id + 1;

    }

    return "MRC" + String(nextNumber).padStart(8, "0");

}

// =====================================
// CREATE MERCHANT
// =====================================

const createMerchant = async (req, res) => {

    try {

        const {

            merchant_name,
            owner_name,
            phone,
            email,
            province,
            city,
            district,
            village,
            postal_code,
            address,
            latitude,
            longitude

        } = req.body;

        if (!merchant_name) {

            return error(
                res,
                "Nama merchant wajib diisi.",
                400
            );

        }

        const merchantCode =
            await generateMerchantCode();

        const ownerId =
            buildOwnershipInsert(req.user);

        const result = await pool.query(

            `
            INSERT INTO merchants
            (

                merchant_code,

                merchant_name,

                owner_name,

                phone,

                email,

                province,

                city,

                district,

                village,

                postal_code,

                address,

                latitude,

                longitude,

                created_by_admin_id

            )

            VALUES

            (

                $1,$2,$3,$4,$5,

                $6,$7,$8,$9,

                $10,$11,$12,

                $13,$14

            )

            RETURNING *

            `,

            [

                merchantCode,

                merchant_name,

                owner_name,

                phone,

                email,

                province,

                city,

                district,

                village,

                postal_code,

                address,

                latitude,

                longitude,

                ownerId

            ]

        );

        return success(

            res,

            result.rows[0],

            "Merchant berhasil dibuat."

        );

    }

    catch (err) {

        console.log(err);

        return error(

            res,

            err.message

        );

    }

};

// =====================================
// GET MERCHANTS
// =====================================

const getMerchants = async (req, res) => {
    console.log("USER LOGIN :", req.user);

    try {

        const isSuperAdmin =
            req.user.role_id === 1;

        let result;

        if (isSuperAdmin) {

            result = await pool.query(

                `
                SELECT *

                FROM merchants

                WHERE deleted_at IS NULL

                ORDER BY id DESC
                `

            );

        } else {

            result = await pool.query(

                `
                SELECT *

                FROM merchants

                WHERE

                    created_by_admin_id = $1

                AND

                    deleted_at IS NULL

                ORDER BY id DESC
                `,

                [

                    req.user.id

                ]

            );

        }

        return success(

            res,

            result.rows,

            "Data merchant berhasil diambil."

        );

    }

    catch (err) {

        console.log(err);

        return error(

            res,

            err.message

        );

    }

};

module.exports = {

    createMerchant,

    getMerchants

};