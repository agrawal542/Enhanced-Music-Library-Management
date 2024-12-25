const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Function to hash the password
const hashPassword = async (plainPassword) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error("Error hashing the password.");
    }
};

// Function to verify the password against the stored hash
const verifyPassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
        return isMatch; // Returns true if passwords match, false otherwise
    } catch (error) {
        throw new Error("Error verifying the password.");
    }
};

// Function to create a JWT token for the user
const createJwtToken = async (data) => {
    try {
        return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '24h' });
    } catch (error) {
        throw new Error("Error generating JWT token.");
    }
};

module.exports = {
    hashPassword,
    verifyPassword,
    createJwtToken
}