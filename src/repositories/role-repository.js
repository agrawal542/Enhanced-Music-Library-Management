
const CrudRepository = require('./crud-repository')
const { Role } = require('../models')

class RoleRepository extends CrudRepository {
    constructor() {
        super(Role)
    }
}
module.exports = RoleRepository; 