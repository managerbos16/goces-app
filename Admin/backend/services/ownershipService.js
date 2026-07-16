const pool = require("../config/database");

// =====================================
// CREATE OWNERSHIP
// =====================================
async function createOwnership(
    ownerType,
    ownerId,
    childType,
    childId
) {

    const result = await pool.query(

        `
        INSERT INTO ownerships
        (
            owner_type,
            owner_id,
            child_type,
            child_id
        )

        VALUES

        ($1,$2,$3,$4)

        RETURNING *
        `,

        [

            ownerType,

            ownerId,

            childType,

            childId

        ]

    );

    return result.rows[0];

}

// =====================================
// GET OWNERSHIP
// =====================================
async function getOwnership(
    ownerType,
    ownerId,
    childType
) {

    const result = await pool.query(

        `
        SELECT *

        FROM ownerships

        WHERE

            owner_type=$1

        AND

            owner_id=$2

        AND

            child_type=$3
        `,

        [

            ownerType,

            ownerId,

            childType

        ]

    );

    return result.rows;

}

// =====================================
// CEK APAKAH DATA MILIK OWNER
// =====================================
async function isOwner(
    ownerType,
    ownerId,
    childType,
    childId
) {

    const result = await pool.query(

        `
        SELECT id

        FROM ownerships

        WHERE

            owner_type = $1

        AND

            owner_id = $2

        AND

            child_type = $3

        AND

            child_id = $4
        `,

        [

            ownerType,

            ownerId,

            childType,

            childId

        ]

    );

    return result.rows.length > 0;

}

module.exports = {

    createOwnership,

    getOwnership,

    isOwner

};