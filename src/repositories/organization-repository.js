
const CrudRepository = require('./crud-repository')
const { Organization } = require('../models')

class OrganizationRepository extends CrudRepository {
    constructor() {
        super(Organization)
    }

    async update(org_id, data) {
        const response = await this.model.update(data, {
            where: {
                org_id: org_id
            }
        });
        if (!response || response[0] == 0) {
            throw new AppError('Not able to found the resource', StatusCodes.NOT_FOUND)
        }
        return response;
    }

    async destroy(org_id) {
        const response = await this.model.destroy({
            where: {
                org_id: org_id,
            },
        });
        if (!response) {
            throw new AppError('Not able to found the resource', StatusCodes.NOT_FOUND)
        }
        return response;
    }
}
module.exports = OrganizationRepository; 