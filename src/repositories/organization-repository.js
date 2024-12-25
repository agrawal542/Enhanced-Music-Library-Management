
const CrudRepository = require('./crud-repository')
const { Organization } = require('../models')

class OrganizationRepository extends CrudRepository {
    constructor() {
        super(Organization)
    }

    async getByColumn(data) {
        const response = await this.model.findOne({
            where: data, 
        });
        return response;
    }
}
module.exports = OrganizationRepository; 