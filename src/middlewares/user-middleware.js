const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");
const { UserRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error.js");

const userRepository = new UserRepository();

const verifyJWT = async (req, res, next) => {
    try {
        // Check for token in cookies or Authorization header
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new AppError("Unauthorized request", StatusCodes.UNAUTHORIZED);
        }

        // Verify token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded token to request object
        req.user = decodedToken;


        const user = await userRepository.getByColumn({ user_id: req.user.user_id });
        if (!user.dataValues.status) {
            throw new AppError("User already logout.", StatusCodes.UNAUTHORIZED)
        }

        next();
    } catch (error) {

        if (error.name === "TokenExpiredError") {
            throw new AppError("Token expired, please log in again", StatusCodes.UNAUTHORIZED);
        }
        else if (error.name === "JsonWebTokenError") {
            throw new AppError("Invalid token.", StatusCodes.UNAUTHORIZED);
        }
        else if (error instanceof AppError) {
           return next(error); // Re-throw custom application errors
        }
        throw new AppError("Authentication failed! Please log in again.", StatusCodes.UNAUTHORIZED);
    }
};

module.exports = { verifyJWT };
