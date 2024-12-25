const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { UserService } = require("../services");


async function signup(req, res) {
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
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse)
    }
}

async function login(req, res) {
    try {
        const user = await UserService.login({
            email: req.body.email,
            password: req.body.password,
        })
        SuccessResponse.message = "User logged in successfully."
        SuccessResponse.data = user;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse)
    }
}


module.exports = { signup ,login}