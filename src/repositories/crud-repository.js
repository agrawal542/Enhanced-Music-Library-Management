class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const response = await this.model.create(data);
        return response;
    }

    async destroy(condition) {
        const response = await this.model.destroy({
            where: {
                condition
            },
        });
        if (!response) {
            throw new AppError('Not able to found the resource', StatusCodes.NOT_FOUND)
        }
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