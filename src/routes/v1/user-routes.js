const express = require("express");
const { UserController } = require("../../controllers");
const { UserMiddleware } = require("../../middlewares");
const { Enums } = require('../../utils/common')
const { ADMIN } = Enums.ROLE_NAME


const router = express.Router();

router.post('/signup', UserController.signup)
router.post('/login', UserController.login)
router.get('/logout', UserMiddleware.verifyJWT, UserController.logout)


router.post('/add-user', UserMiddleware.verifyJWT, UserMiddleware.authorize([ADMIN]), UserController.addUser)
router.delete('/:user_id', UserMiddleware.verifyJWT, UserMiddleware.authorize([ADMIN]), UserController.deleteUser)
router.get('/', UserMiddleware.verifyJWT, UserMiddleware.authorize([ADMIN]), UserController.getUserList)




module.exports = router;