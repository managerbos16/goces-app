// =====================================
// SUCCESS RESPONSE
// =====================================

function success(res, data = null, message = "Berhasil") {

    return res.json({

        success: true,

        message,

        data

    });

}

// =====================================
// ERROR RESPONSE
// =====================================

function error(res, message = "Terjadi kesalahan", status = 500) {

    return res.status(status).json({

        success: false,

        message

    });

}

module.exports = {

    success,

    error

};