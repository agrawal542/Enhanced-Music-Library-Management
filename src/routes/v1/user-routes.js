const express = require("express");
const { UserController } = require("../../controllers");


const router = express.Router();

// /api/v1/airports  POST
router.post('/',UserController.register)


module.exports = router;