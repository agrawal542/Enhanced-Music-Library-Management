const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { UserRepository, RoleRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error.js");
const { Enums } = require('../utils/common');
const { ROE_NAME, USER_STATUS } = Enums;

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();


const verifyJWT = async (req, res, next) => {
    try {
        // Check for token in cookies or Authorization header
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new AppError("Unauthorized Access.", StatusCodes.UNAUTHORIZED);
        }

        // Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded token to request object
        req.user = decodedToken;
        const user = await userRepository.getByColumn({ user_id: req.user.user_id });

        if (!user || user?.dataValues?.status !== USER_STATUS.ACTIVE) {
            throw new AppError("Unauthorized Access.", StatusCodes.UNAUTHORIZED)
        }
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new AppError("Token expired, please log in again", StatusCodes.UNAUTHORIZED))
        }
        else if (error.name === "JsonWebTokenError") {
            return next(new AppError("Invalid token.", StatusCodes.UNAUTHORIZED))
        }
        else if (error instanceof AppError) {
            return next(error); // Re-throw custom application errors
        }
        return next(new AppError("Authentication failed! Please log in again.", StatusCodes.UNAUTHORIZED))
    }
};


const authorize = (requiredRoles = []) => {
    return async (req, res, next) => {
        try {
            const role = await roleRepository.getByColumn({ role_id: req.user.role_id });
            if (!role) {
                throw new AppError('Role not found.', StatusCodes.NOT_FOUND);
            }
            if (!requiredRoles.includes(role.dataValues.key)) {
                throw new AppError("Forbidden Access/Operation not allowed.", StatusCodes.FORBIDDEN);
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = { verifyJWT, authorize };
