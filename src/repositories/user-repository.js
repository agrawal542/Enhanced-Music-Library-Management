
const CrudRepository = require('./crud-repository')
const { User, Role, sequelize } = require('../models')

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
        return response;
    }

    async getAllUsers(whereFilter, orderFilter, limit, offset) {
        const response = await User.findAll({
            where: whereFilter,
            order: orderFilter,
            limit,
            offset: (offset - 1) * limit,
            attributes: { exclude: ['id', 'updatedAt', 'password', 'status', 'org_id'] },
            include: [
                {
                    model: Role,
                    required: true,
                    as: "role_details",
                    attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'role_id'] },
                    on:
                    {
                        col1: sequelize.where(sequelize.col("User.role_id"), "=", sequelize.col("role_details.role_id"))
                    }
                }
            ]
        })
        return response;
    }
}
module.exports = UserRepository; 