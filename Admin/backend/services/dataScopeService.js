// =====================================
// DATA SCOPE SERVICE
// Digunakan seluruh modul GOCES
// =====================================

function isSuperAdmin(user) {

    return user.role_id === 1;

}

// =====================================
// FILTER DATA
// =====================================

function buildOwnershipWhere(user) {

    // Super Admin melihat semua data
    if (isSuperAdmin(user)) {

        return {

            where: "",

            values: []

        };

    }

    // Admin biasa hanya melihat datanya sendiri
    return {

        where: "WHERE created_by_admin_id = $1",

        values: [user.id]

    };

}

// =====================================
// OWNER SAAT INSERT
// =====================================

function buildOwnershipInsert(user) {

    return user.id;

}

module.exports = {

    isSuperAdmin,

    buildOwnershipWhere,

    buildOwnershipInsert

};