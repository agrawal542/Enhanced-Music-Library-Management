
const CrudRepository = require('./crud-repository')
const { Role } = require('../models')

class RoleRepository extends CrudRepository {
    constructor() {
        super(Role)
    }
    async getByColumn(data) {
        const response = await this.model.findOne({
            where: data, 
        });
        return response;
    }
}
module.exports = RoleRepository; 