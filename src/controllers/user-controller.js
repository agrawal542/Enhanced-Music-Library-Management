const { StatusCodes } = require("http-status-codes");
const { SuccessResponse } = require("../utils/common");
const { UserService } = require("../services");


async function signup(req, res, next) {
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
        return next(error);
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
        return next(error);
    }
}

async function logout(req, res, next) {
    try {
        const user_uid = req.user.user_id;
        const user = await UserService.logout({ user_id: user_uid })
        SuccessResponse.message = "User logged out successfully."
        SuccessResponse.data = user;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        return next(error);
    }
}

async function addUser(req, res, next) {
    try {
        const org_id = req.user.org_id;

        const user = await UserService.addUser({
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            org_id: org_id
        })
        SuccessResponse.message = "User created successfully.",
            SuccessResponse.data = user;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        return next(error);
    }
}

async function deleteUser(req, res, next) {
    try {
        const user_id = req.params.user_id;

        await UserService.deleteUser({
            user_id: user_id
        })
        SuccessResponse.message = "User deleted successfully."
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        return next(error);
    }
}

async function getUserList(req, res, next) {
    try {
        const org_id = req.user.org_id;

        const users = await UserService.getUserList({
            org_id: org_id
        }, req.query)
        SuccessResponse.data = users;
        SuccessResponse.message = "Users retrieved successfully."
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        return next(error);
    }
}

async function updatePassword(req, res, next) {
    try {
        const user_id = req.user.user_id;

        const user = await UserService.updatePassword({
            old_password: req.body.old_password,
            new_password: req.body.new_password,
            user_id: user_id
        })
        SuccessResponse.message = "Password updated successfully." ;
        SuccessResponse.data = user;
        return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
        return next(error);
    }
}

module.exports = { signup, login, logout, addUser, deleteUser, getUserList, updatePassword }