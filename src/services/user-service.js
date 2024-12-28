const { StatusCodes } = require('http-status-codes');
const { UserRepository, OrganizationRepository, RoleRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { Enums } = require('../utils/common');
const { UserHelper } = require('../utils/helpers');
const { Op } = require('sequelize');
const { ROLE_NAME, USER_STATUS } = Enums;


const userRepository = new UserRepository();
const organizationRepository = new OrganizationRepository();
const roleRepository = new RoleRepository();


async function signup(data) {
    try {
        // Step 1: Check if a user with the provided email already exists
        const user = await userRepository.getByColumn({ email: data.email });
        if (user) {
            throw new AppError('Email already exists.', StatusCodes.CONFLICT);
        }

        // Step 2: Check if an organization with the given name already exists
        const org = await organizationRepository.getByColumn({ name: data.org_name });
        if (org) {
            throw new AppError('Organization already exists.', StatusCodes.CONFLICT);
        }

        // Step 3: Fetch the ADMIN role to assign it to the user
        const role = await roleRepository.getByColumn({ key: ROLE_NAME.ADMIN });
        if (!role) {
            throw new AppError('Role not found.', StatusCodes.NOT_FOUND);
        }

        // Step 4: Generate unique IDs for the organization and user
        const org_id = `org_${Math.random().toString(36).substr(2, 9)}`;
        const user_id = `user_${Math.random().toString(36).substr(2, 9)}`;

        // Step 5: Create the new organization
        await organizationRepository.create({
            org_id,
            name: data.org_name
        });

        // Step 6: Hash the user's password securely
        const hashPassword = await UserHelper.hashPassword(data.password);

        // Step 7: Create the new user with the hashed password and assigned role
        await userRepository.create({
            user_id,
            email: data.email,
            password: hashPassword,
            org_id,
            role_id: role.dataValues.role_id // Assuming role contains a role_id field
        });

        return;
    } catch (error) {
        // Handle errors and propagate them
        throw error;
    }
}

async function login(data) {
    try {
        // Step 1: Retrieve the user by email from the repository
        const user = await userRepository.getByColumn({ email: data.email });
        // Step 2: Check if the user exists and is not marked as deleted
        if (!user || user?.dataValues?.status === USER_STATUS.DELETE) {
            throw new AppError('User not found.', StatusCodes.NOT_FOUND);
        }

        // Step 3: Verify the provided password matches the stored hashed password
        const verifyPassword = await UserHelper.verifyPassword(data.password, user.dataValues.password);
        if (!verifyPassword) {
            throw new AppError('Password is invalid.', StatusCodes.CONFLICT);
        }

        // Step 4: Generate a JWT token for the authenticated user
        const token = await UserHelper.createJwtToken({
            email: user.dataValues.email,
            user_id: user.dataValues.user_id,
            role_id: user.dataValues.role_id,
            org_id: user.dataValues.org_id,
        });

        // Step 5: Update the user status to ACTIVE upon successful login
        await userRepository.update(user.dataValues.user_id, {
            status: USER_STATUS.ACTIVE
        });

        // Step 6: Return token as a success response 
        return { token };
    } catch (error) {
        // Step 8: Handle and propagate any errors that occur during the login process
        throw error;
    }
}

async function logout(data) {
    try {
        // Step 1: Update the user status to INACTIVE in the database
        await userRepository.update(data.user_id, {
            status: USER_STATUS.INACTIVE
        });
        return;
    } catch (error) {
        // Step 3: Handle and propagate any errors that occur during the logout process
        throw error;
    }
}

async function addUser(data) {
    try {
        // Step 1: Initialize success message
        let message = "User created successfully";

        // Step 2: Check if a user with the provided email already exists
        const user = await userRepository.getByColumn({ email: data.email });

        // Step 3: If the user exists and is not marked as deleted, throw a conflict error
        if (user && user?.dataValues.status !== USER_STATUS.DELETE) {
            throw new AppError('Email already exists.', StatusCodes.CONFLICT);
        }

        // Step 4: Fetch the role by its key from the repository
        const role = await roleRepository.getByColumn({ key: data.role });
        if (!role) {
            throw new AppError('Role not found.', StatusCodes.NOT_FOUND);
        }

        // Step 5: Hash the user's password securely
        const hashPassword = await UserHelper.hashPassword(data.password);

        // Step 6: If the user exists (and is marked as deleted), update the user
        if (user) {
            message = "User updated successfully";
            await userRepository.update(user.dataValues.user_id, {
                password: hashPassword,
                role_id: role.dataValues.role_id,
                status: USER_STATUS.ACTIVE // Reactivate user if updating
            });
            return { message }; // Return success message after update
        }

        // Step 7: Generate a unique user ID for the new user
        const user_id = `user_${Math.random().toString(36).substr(2, 9)}`;

        // Step 8: Create a new user in the repository
        await userRepository.create({
            user_id,
            email: data.email,
            password: hashPassword, // Save hashed password securely
            org_id: data.org_id,
            role_id: role.dataValues.role_id // Assuming the role object contains a `role_id` property
        });

        // Step 9: Return success message after creating the user
        return { message };
    } catch (error) {
        // Step 10: Handle and propagate any errors that occur during user addition or update
        throw error;
    }
}

async function deleteUser(data) {
    try {
        // Step 1: Prevent a user from deleting their own account
        if (data.user_id === data.delete_user_id) {
            throw new AppError("You can't delete yourself.", StatusCodes.CONFLICT);
        }

        // Step 2: Check if the user to be deleted exists in the repository
        const user = await userRepository.getByColumn({ user_id: data.delete_user_id });
        if (!user) {
            throw new AppError('User not found.', StatusCodes.NOT_FOUND);
        }

        // Step 3: Check if the user is already marked as deleted
        if (user.dataValues.status === USER_STATUS.DELETE) {
            throw new AppError("User already deleted.", StatusCodes.FORBIDDEN);
        }

        // Step 4: Update the user's status to mark them as deleted
        await userRepository.update(user.dataValues.user_id, {
            status: USER_STATUS.DELETE
        });

        // Step 5: Successful deletion does not return additional data
        return;
    } catch (error) {
        // Step 6: Handle and propagate any errors that occur during the deletion process
        throw error;
    }
}

async function updatePassword(data) {
    try {
        // Step 1: Fetch the user by ID to retrieve the current password
        const user = await userRepository.getByColumn({ user_id: data.user_id });
        if (!user) {
            throw new AppError('User not found.', StatusCodes.NOT_FOUND);
        }

        // Step 2: Verify the provided old password matches the stored hashed password
        const verifyPassword = await UserHelper.verifyPassword(data.old_password, user.dataValues.password);
        if (!verifyPassword) {
            throw new AppError('Old password is invalid.', StatusCodes.CONFLICT);
        }

        // Step 3: Check if the new password is the same as the old password
        if (data.old_password === data.new_password) {
            throw new AppError("New password can't be the same as the old password.", StatusCodes.BAD_REQUEST);
        }

        // Step 4: Hash the new password securely
        const hashPassword = await UserHelper.hashPassword(data.new_password);

        // Step 5: Update the user's password in the repository
        await userRepository.update(user.dataValues.user_id, {
            password: hashPassword
        });
        return;
    } catch (error) {
        // Step 7: Handle and propagate any errors that occur during the password update process
        throw error;
    }
}

async function getUserList(data, query) {
    try {
        // Step 1: Initialize filters for the query
        let customWhereFilter = {
            org_id: data.org_id,
            status: { [Op.ne]: USER_STATUS.DELETE } // Exclude deleted users
        };
        let customOrderFilter = [['createdAt', 'ASC']]; // Default sort order by creation date

        // Step 2: Parse limit and offset for pagination with default values
        const limit = query.limit ? parseInt(query.limit, 10) : 5;
        const offset = query.offset ? parseInt(query.offset, 10) : 1;

        // Step 3: Filter by role if specified in the query
        if (query.role) {
            const role = await roleRepository.getByColumn({ key: query.role });
            if (role) {
                customWhereFilter.role_id = role.dataValues.role_id;
            } else {
                throw new AppError('Role not found.', StatusCodes.NOT_FOUND);
            }
        }

        // Step 4: Apply custom sorting if specified in the query
        if (query.sort) {
            const params = query.sort.split(',');
            params.forEach(element => {
                const info = element.split('_'); // Split sort parameters into field and order
                customOrderFilter.push(info);
            });
        }

        // Step 5: Fetch users from the repository with the constructed filters and pagination
        const users = await userRepository.getAllUsers(customWhereFilter, customOrderFilter, limit, offset);

        // Step 6: Return the fetched users along with the total record count
        return { users, total_record: users.length };
    } catch (error) {
        // Step 7: Handle and propagate errors
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
