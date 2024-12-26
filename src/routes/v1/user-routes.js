const express = require("express");
const { UserController } = require("../../controllers");
const { UserMiddleware } = require("../../middlewares");
const { Enums } = require('../../utils/common');
const { UserValidation } = require("../../validations");
const { ADMIN } = Enums.ROLE_NAME


const router = express.Router();

router.post('/signup', UserValidation.signupValidation, UserController.signup)
router.post('/login', UserValidation.loginValidation, UserController.login)
router.get('/logout', UserMiddleware.verifyJWT, UserController.logout)


router.post('/add-user', UserValidation.addUserValidation, UserMiddleware.verifyJWT, UserMiddleware.authorize([ADMIN]), UserController.addUser)
router.get('/', UserMiddleware.verifyJWT, UserMiddleware.authorize([ADMIN]), UserController.getUserList)
router.put('/update-password', UserValidation.updatePasswordValidation, UserMiddleware.verifyJWT, UserController.updatePassword)
router.delete('/:user_id', UserMiddleware.verifyJWT, UserMiddleware.authorize([ADMIN]), UserController.deleteUser)




module.exports = router;