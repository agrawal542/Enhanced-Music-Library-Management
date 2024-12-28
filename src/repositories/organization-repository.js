
const CrudRepository = require('./crud-repository')
const { Organization } = require('../models')

class OrganizationRepository extends CrudRepository {
    constructor() {
        super(Organization)
    }
}
module.exports = OrganizationRepository; 