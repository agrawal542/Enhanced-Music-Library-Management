const express = require("express");
const { UserController } = require("../../controllers");
const { UserMiddleware } = require("../../middlewares");


const router = express.Router();

router.post('/signup', UserController.signup)
router.post('/login', UserController.login)
router.get('/logout',UserMiddleware.verifyJWT, UserController.logout)


module.exports = router;