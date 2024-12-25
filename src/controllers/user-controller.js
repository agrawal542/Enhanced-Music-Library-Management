const { StatusCodes } = require("http-status-codes");
const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { UserService } = require("../services");

/**
 *  POST: /users
 *  req-body {
 *  "email":"gautamagrawal542@gmail.com",
 *  "password":"Gautam@123",
 *  "org_name":"test-library"
 *  }
 */


async function register(req, res) {
    try {
        const user = await UserService.register({
            email: req.body.email,
            password: req.body.password,
            org_name: req.body.org_name
        })
        SuccessResponse.data = user;
        return res.status(StatusCodes.CREATED).json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        return res.status(error.statusCode).json(ErrorResponse)
    }
}


module.exports = { register }