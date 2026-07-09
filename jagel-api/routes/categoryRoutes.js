const express = require("express");

const router = express.Router();

const categories = require("../categories");

const categoryHandler = require("../handlers/categoryHandler");

categories.forEach(category => {

    router.get(category.path, (req, res) => {

        req.category = category;

        categoryHandler(req, res);

    });

});

module.exports = router;