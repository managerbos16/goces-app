const db = require("../config/db");

/*==================================
        HOME
==================================*/

exports.getHome = async () => {

    /*==============================
        CAMPAIGNS
    ==============================*/

    const campaigns = await db.query(

        `

        SELECT

            id,

            title,

            slug,

            cover_image,

            target_amount,

            collected_amount,

            donor_count,

            status,

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

    /*==============================
        STATISTICS
    ==============================*/

    const stats = await db.query(

        `

        SELECT

            COUNT(*) AS campaigns,

            COALESCE(

                SUM(collected_amount),

                0

            ) AS total_collected,

            COALESCE(

                SUM(donor_count),

                0

            ) AS donors

        FROM campaigns

        WHERE status='ACTIVE'

        `

    );

    const donation = await db.query(

        `

        SELECT

            COUNT(*) AS donations

        FROM campaign_donations

        WHERE status='PAID'

        `

    );

    return {

        campaigns:

            campaigns.rows.map(item => ({

                ...item,

                target_amount:
                    Number(item.target_amount),

                collected_amount:
                    Number(item.collected_amount),

                donor_count:
                    Number(item.donor_count),

                progress:
                    Number(item.progress)

            })),

        statistics: {

            campaigns:
                Number(
                    stats.rows[0].campaigns
                ),

            total_collected:
                Number(
                    stats.rows[0].total_collected
                ),

            donors:
                Number(
                    stats.rows[0].donors
                ),

            donations:
                Number(
                    donation.rows[0].donations
                )

        }

    };

};