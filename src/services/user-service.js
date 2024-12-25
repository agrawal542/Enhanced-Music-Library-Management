const { StatusCodes } = require('http-status-codes');
const { UserRepository, OrganizationRepository, RoleRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { Enums } = require('../utils/common');
const { UserHelper } = require('../utils/helpers');
const { ADMIN } = Enums.ROLE_NAME;

const userRepository = new UserRepository();
const organizationRepository = new OrganizationRepository();
const roleRepository = new RoleRepository();

async function register(data) {
    try {
        // Check if the organization already exists
        let org = await organizationRepository.getByColumn({ name: data.org_name });
        if (org) {
            throw new AppError('Organization already exists. Please choose a different name.', StatusCodes.CONFLICT);
        }

        // Create a new organization
        const org_id = "org_" + Math.random().toString(36).substr(2, 9); // Generate unique org_id
        org = await organizationRepository.create({
            org_id,
            name: data.org_name
        });

        // Get the ADMIN role
        const role = await roleRepository.getByColumn({ key: ADMIN });
        if (!role) {
            throw new AppError('Admin role not found. Please contact support.', StatusCodes.NOT_FOUND);
        }

        const hashPassword = await UserHelper.hashPassword(data.password);

        // Create a new user
        const user_id = "user_" + Math.random().toString(36).substr(2, 9); // Generate unique user_id
        const user = await userRepository.create({
            user_id,
            email: data.email,
            password: hashPassword, // Ensure password is hashed before saving
            org_id,
            role_id: role.dataValues.role_id // Assuming the role has an `id` property
        });

        return user;
    } catch (error) {
        console.log(error)
        if (error.name === 'SequelizeValidationError') {
            const explanation = error.errors.map((err) => err.message);
            throw new AppError(explanation.join(', '), StatusCodes.BAD_REQUEST);
        }
        if (error instanceof AppError) {
            throw error; // Re-throw custom application errors
        }
        throw new AppError('An unexpected error occurred during registration. Please try again later.', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    register,
};
