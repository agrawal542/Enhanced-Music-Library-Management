const { StatusCodes } = require("http-status-codes");
const { SuccessResponse} = require("../utils/common");
const { UserService } = require("../services");


async function signup(req, res, next ) {
    try {
        const user = await UserService.signup({
            email: req.body.email,
            password: req.body.password,
            org_name: req.body.org_name
        })
        SuccessResponse.message = "User created successfully."
        SuccessResponse.data = user;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        return next(error) ;
    }
}

async function login(req, res, next) {
    try {
        const user = await UserService.login({
            email: req.body.email,
            password: req.body.password,
        })
        SuccessResponse.message = "User logged in successfully."
        SuccessResponse.data = user;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        return next(error) ;
    }
}

async function logout(req, res) {
    try {
        const user_uid = req.user.user_id;
        const user = await UserService.logout({ user_id: user_uid })
        SuccessResponse.message = "User logged out successfully."
        SuccessResponse.data = user;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        return next(error) ;
    }
}


module.exports = { signup, login, logout }