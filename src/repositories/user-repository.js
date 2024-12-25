
const CrudRepository = require('./crud-repository')
const { User } = require('../models')

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
}
module.exports = UserRepository; 