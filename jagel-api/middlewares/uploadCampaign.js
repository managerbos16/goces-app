const multer = require("multer");
const path = require("path");
const fs = require("fs");

/*==================================
        CREATE FOLDER
==================================*/

const uploadPath = path.join(

    __dirname,

    "..",

    "uploads",

    "campaigns"

);

if (!fs.existsSync(uploadPath)) {

    fs.mkdirSync(uploadPath, {

        recursive: true

    });

}

/*==================================
        STORAGE
==================================*/

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, uploadPath);

    },

    filename(req, file, cb) {

        const ext = path.extname(

            file.originalname

        );

        const filename =

            "campaign-" +

            Date.now() +

            ext;

        cb(null, filename);

    }

});

/*==================================
        FILTER
==================================*/

const fileFilter = (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {

        cb(null, true);

    } else {

        cb(

            new Error(

                "File harus berupa gambar."

            )

        );

    }

};

module.exports = multer({

    storage,

    fileFilter,

    limits: {

        fileSize: 5 * 1024 * 1024

    }

});