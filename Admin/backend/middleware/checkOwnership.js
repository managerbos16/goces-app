const { isOwner } = require("../services/ownershipService");

// =====================================
// OWNERSHIP MIDDLEWARE
// =====================================

function checkOwnership(childType) {

    return async (req, res, next) => {

        try {

            // Super Admin selalu boleh
            if (req.user.role_id === 1) {

                return next();

            }

            const childId = parseInt(req.params.id);

            const allowed = await isOwner(

                "ADMIN",

                req.user.id,

                childType,

                childId

            );

            if (!allowed) {

                return res.status(403).json({

                    success: false,

                    message: "Anda tidak memiliki akses ke data ini."

                });

            }

            next();

        } catch (err) {

            console.log(err);

            return res.status(500).json({

                success: false,

                message: err.message

            });

        }

    };

}

module.exports = checkOwnership;