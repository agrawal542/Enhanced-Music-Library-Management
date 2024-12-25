
const CrudRepository = require('./crud-repository')
const { User, Role, Organization, sequelize } = require('../models')

class UserRepository extends CrudRepository {
    constructor() {
        super(User)
    }

    async update(user_id, data) {
        const response = await this.model.update(data, {
            where: {
                user_id: user_id
            }
        });
        if (!response || response[0] == 0) {
            throw new AppError('Not able to found the resource', StatusCodes.NOT_FOUND)
        }
        return response;
    }

    async destroy(user_id) {
        const response = await this.model.destroy({
            where: {
                user_id: user_id,
            },
        });
        if (!response) {
            throw new AppError('Not able to found the resource', StatusCodes.NOT_FOUND)
        }
        return response;
    }

    async getAllUsers(whereFilter, orderFilter, limit, offset) {
        const response = await User.findAll({
            where: whereFilter,
            order: orderFilter,
            limit,
            offset: (offset - 1) * limit,
            attributes: { exclude: ['id', 'updatedAt', 'password'] },
            include: [
                {
                    model: Role,
                    required: true,
                    as: "role_details",
                    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
                    on:
                    {
                        col1: sequelize.where(sequelize.col("User.role_id"), "=", sequelize.col("role_details.role_id"))
                    }
                },
                {
                    model: Organization,
                    required: true,
                    as: "orgnization_details",
                    attributes: { exclude: ['id', 'createdAt', 'updatedAt'] },
                    on:
                    {
                        col1: sequelize.where(sequelize.col("User.org_id"), "=", sequelize.col("orgnization_details.org_id"))
                    }
                },
            ]
        })
        return response;
    }
}
module.exports = UserRepository; 