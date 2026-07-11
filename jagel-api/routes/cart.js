const express =
    require("express");

const router =
    express.Router();

const controller =
    require("../controllers/cartController");

router.post(

    "/add",

    controller.add

);

module.exports =
    router;