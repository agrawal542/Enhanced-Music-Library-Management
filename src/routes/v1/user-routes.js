const express = require("express");
const { UserController } = require("../../controllers");
const { UserMiddleware } = require("../../middlewares");


const router = express.Router();

router.post('/signup', UserController.signup)
router.post('/login', UserController.login)
router.get('/logout', UserMiddleware.verifyJWT, UserController.logout)


router.post('/add-user', UserMiddleware.verifyJWT, UserController.addUser)
router.delete('/:user_id', UserMiddleware.verifyJWT, UserController.deleteUser)
router.get('/', UserMiddleware.verifyJWT, UserController.getUserList)




module.exports = router;