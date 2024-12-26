const { StatusCodes } = require('http-status-codes');
const { UserRepository, OrganizationRepository, RoleRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { Enums } = require('../utils/common');
const { UserHelper } = require('../utils/helpers');
const { Op } = require('sequelize');
const { ADMIN } = Enums.ROLE_NAME;

const userRepository = new UserRepository();
const organizationRepository = new OrganizationRepository();
const roleRepository = new RoleRepository();

async function signup(data) {
    try {
        // Check if the organization already exists
        let org = await organizationRepository.getByColumn({ name: data.org_name });
        if (org) {
            throw new AppError('Organization already exists.', StatusCodes.CONFLICT);
        }

        let user = await userRepository.getByColumn({ email: data.email });
        if (user) {
            throw new AppError('Email already exists.', StatusCodes.CONFLICT);
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
            throw new AppError('Role not found.', StatusCodes.NOT_FOUND);
        }

        const hashPassword = await UserHelper.hashPassword(data.password);

        // Create a new user
        const user_id = "user_" + Math.random().toString(36).substr(2, 9); // Generate unique user_id
        user = await userRepository.create({
            user_id,
            email: data.email,
            password: hashPassword, // Ensure password is hashed before saving
            org_id,
            role_id: role.dataValues.role_id // Assuming the role has an `id` property
        });

        return user;
    } catch (error) {
        throw error;
    }
}

async function login(data) {
    try {
        // Check if the organization already exists
        const user = await userRepository.getByColumn({ email: data.email });
        if (!user || user?.dataValues?.status === 2) {
            throw new AppError('User not found.', StatusCodes.NOT_FOUND);
        }

        const verifyPassword = await UserHelper.verifyPassword(data.password, user.dataValues.password);
        if (!verifyPassword) {
            throw new AppError('Password is invalid.', StatusCodes.CONFLICT);
        }

        const token = await UserHelper.createJwtToken({
            email: user.dataValues.email,
            user_id: user.dataValues.user_id,
            role_id: user.dataValues.role_id,
            org_id: user.dataValues.org_id,
        });

        await userRepository.update(user.dataValues.user_id, {
            status: 1
        })

        return { user, token };
    } catch (error) {
        throw error;
    }
}

async function logout(data) {
    try {
        const user_id = data.user_id

        await userRepository.update(user_id, {
            status: 0
        })
        return;
    } catch (error) {
        throw error;
    }
}

async function addUser(data) {
    try {
        // Check if the organization already exists

        let user = await userRepository.getByColumn({ email: data.email });
        if (user) {
            throw new AppError('Email already exists.', StatusCodes.CONFLICT);
        }

        const role = await roleRepository.getByColumn({ key: data.role });
        if (!role) {
            throw new AppError('Role not found.', StatusCodes.NOT_FOUND);
        }

        const hashPassword = await UserHelper.hashPassword(data.password);

        // Create a new user
        const user_id = "user_" + Math.random().toString(36).substr(2, 9); // Generate unique user_id

        user = await userRepository.create({
            user_id,
            email: data.email,
            password: hashPassword, // Ensure password is hashed before saving
            org_id: data.org_id,
            role_id: role.dataValues.role_id // Assuming the role has an `id` property
        });
        return user;
    } catch (error) {
        throw error;
    }
}

async function deleteUser(data) {
    try {
        const user_id = data.user_id;
        const user = await userRepository.getByColumn({ user_id: data.user_id });
        if (!user) {
            throw new AppError('User not found.', StatusCodes.CONFLICT);
        }

        if (user.dataValues.status === 2) {
            throw new AppError("User already deleted.", StatusCodes.FORBIDDEN)
        }

        await userRepository.update(user_id, {
            status: 2
        })
        return;
    } catch (error) {
        throw error;
    }
}

async function getUserList(data, query) {
    try {
        let customWhereFilter = {
            org_id: data.org_id,
            status: { [Op.ne]: 2 }  // remove the deleted users
        };
        let customOrderFilter = [['createdAt', 'ASC']];
        const limit = query.limit ? parseInt(query.limit, 10) : 5;
        const offset = query.offset ? parseInt(query.offset, 10) : 1;

        if (query.role) {
            const role = await roleRepository.getByColumn({ key: query.role });
            customWhereFilter.role_id = role.dataValues.role_id;
        }

        if (query.sort) {
            const params = query.sort.split(',');
            params.forEach(element => {
                const info = element.split('_');
                customOrderFilter.push(info)
            });
        }

        const users = await userRepository.getAllUsers(customWhereFilter, customOrderFilter, limit, offset);
        return { users, total_record: users.length };
    } catch (error) {
        throw error;
    }
}

async function updatePassword(data) {
    try {

        const user = await userRepository.getByColumn({ user_id: data.user_id });

        if (!user || user?.dataValues?.status === 2) {
            throw new AppError('User not found.', StatusCodes.NOT_FOUND);
        }

        const verifyPassword = await UserHelper.verifyPassword(data.old_password, user.dataValues.password);
        if (!verifyPassword) {
            throw new AppError('Old Password is invalid.', StatusCodes.CONFLICT);
        }

        if (data.old_password === data.new_password) {
            throw new AppError("New password can't same old password.", StatusCodes.NOT_FOUND);
        }

        const hashPassword = await UserHelper.hashPassword(data.new_password);

        await userRepository.update(data.user_id, {
            password: hashPassword
        })
        return user;
    } catch (error) {
        throw error;
    }
}


module.exports = {
    signup,
    login,
    logout,
    addUser,
    deleteUser,
    getUserList,
    updatePassword
};
