const db = require("../config/db");

/*==================================
        GET ALL CAMPAIGNS
==================================*/

async function getAllCampaigns() {

    const result = await db.query(

        `

        SELECT

            id,

            title,

            slug,

            description,

            cover_image,

            target_amount,

            collected_amount,

            donor_count,

            status,

            created_at,

            updated_at,

            CASE

                WHEN target_amount = 0

                THEN 0

                ELSE ROUND(

                    (collected_amount::numeric /

                    target_amount::numeric)

                    * 100,

                    0

                )

            END::INTEGER AS progress

        FROM campaigns

        WHERE status='ACTIVE'

        ORDER BY id DESC

        `

    );

    return result.rows.map(campaign => ({

        ...campaign,

        target_amount: Number(campaign.target_amount),

        collected_amount: Number(campaign.collected_amount),

        donor_count: Number(campaign.donor_count),

        progress: Number(campaign.progress)

    }));

}

/*==================================
        GET CAMPAIGN BY ID
==================================*/

async function getCampaignById(id) {

    const result = await db.query(

        `

        SELECT

            *,

            CASE

                WHEN target_amount = 0

                THEN 0

                ELSE ROUND(

                    (collected_amount::numeric /

                    target_amount::numeric)

                    * 100,

                    0

                )

            END::INTEGER AS progress

        FROM campaigns

        WHERE id=$1

        LIMIT 1

        `,

        [id]

    );

    if (result.rows.length === 0) {

        return null;

    }

    const campaign = result.rows[0];

    return {

        ...campaign,

        target_amount: Number(campaign.target_amount),

        collected_amount: Number(campaign.collected_amount),

        donor_count: Number(campaign.donor_count),

        progress: Number(campaign.progress)

    };

}

/*==================================
        GET CAMPAIGN DETAIL
==================================*/

async function getCampaignDetail(id) {

    const result = await db.query(

        `

        SELECT

            id,

            title,

            slug,

            description,

            cover_image,

            target_amount,

            collected_amount,

            donor_count,

            status,

            created_at,

            updated_at,

            CASE

                WHEN target_amount = 0

                THEN 0

                ELSE ROUND(

                    (collected_amount::numeric /

                    target_amount::numeric)

                    * 100,

                    0

                )

            END::INTEGER AS progress

        FROM campaigns

        WHERE id=$1

        LIMIT 1

        `,

        [id]

    );

    if (result.rows.length === 0) {

        return null;

    }

    const campaign = result.rows[0];

    return {

        ...campaign,

        target_amount: Number(campaign.target_amount),

        collected_amount: Number(campaign.collected_amount),

        donor_count: Number(campaign.donor_count),

        progress: Number(campaign.progress)

    };

}

/*==================================
        CREATE CAMPAIGN
==================================*/

async function createCampaign(data) {

    const result = await db.query(

        `

        INSERT INTO campaigns(

            title,

            slug,

            description,

            cover_image,

            target_amount,

            created_by

        )

        VALUES(

            $1,

            $2,

            $3,

            $4,

            $5,

            $6

        )

        RETURNING *

        `,

        [

            data.title,

            data.slug,

            data.description,

            data.cover_image,

            data.target_amount,

            data.created_by

        ]

    );

    const campaign = result.rows[0];

    return {

        ...campaign,

        target_amount: Number(campaign.target_amount),

        collected_amount: Number(campaign.collected_amount),

        donor_count: Number(campaign.donor_count)

    };

}

/*==================================
        EXPORT
==================================*/

module.exports = {

    getAllCampaigns,

    getCampaignById,

    getCampaignDetail,

    createCampaign

};