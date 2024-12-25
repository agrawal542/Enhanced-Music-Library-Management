const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");


class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const response = await this.model.create(data);
        return response;
    }

    async getAll() {
        const response = await this.model.findAll();
        return response;
    }

    async getByColumn(condition) {
        const response = await this.model.findOne({
            where: condition,
        });
        return response;
    }
}

module.exports = CrudRepository;